/* global setTimeout clearTimeout setInterval clearInterval */
// Start a network service
import path from 'path';
import http from 'http';
import { createConnection } from 'net';
import express from 'express';
import WebSocket from 'ws';
import anylogger from 'anylogger';
import morgan from 'morgan';

import { getAccessToken } from '@agoric/access-token';

const log = anylogger('web');

const channels = new Map();

const send = (ws, msg) => {
  if (ws.readyState === ws.OPEN) {
    ws.send(msg);
  }
};

/**
 * This is a constant-time operation so that the caller cannot tell the
 * difference between initial characters that match vs. ones that don't.
 *
 * This is our interpretation of `secure-compare`s algorithm.
 *
 * @param {unknown} actual
 * @param {unknown} expected
 * @returns {boolean}
 */
const verifyToken = (actual, expected) => {
  assert.typeof(actual, 'string');
  assert.typeof(expected, 'string');

  const expectedLength = expected.length;

  /** @type {string} */
  let stringToCompare;

  /** @type {number} */
  let failed;
  if (actual.length !== expectedLength) {
    // We force a failure, but run the comparison in constant time.
    failed = 1;
    stringToCompare = expected;
  } else {
    // We do the actual comparison in constant time, starting from no failure.
    failed = 0;
    stringToCompare = actual;
  }

  // The bitwise operations here and fixed loop length are necessary to
  // guarantee constant time.
  for (let i = 0; i < expectedLength; i += 1) {
    // eslint-disable-next-line no-bitwise
    failed |= stringToCompare.charCodeAt(i) ^ expected.charCodeAt(i);
  }

  return !failed;
};

export async function makeHTTPListener(basedir, port, host, rawInboundCommand) {
  // Enrich the inbound command with some metadata.
  const inboundCommand = (
    body,
    { channelID, dispatcher, url, headers: { origin } = {} } = {},
    id = undefined,
  ) => {
    // Strip away the query params, as the inbound command device can't handle
    // it and the accessToken is there.
    const parsedURL = new URL(url, 'http://some-host');
    const query = { isQuery: true };
    for (const [key, val] of parsedURL.searchParams.entries()) {
      if (key !== 'accessToken') {
        query[key] = val;
      }
    }

    const obj = {
      ...body,
      meta: {
        channelID,
        dispatcher,
        origin,
        query,
        url: parsedURL.pathname,
        date: Date.now(),
      },
    };
    return rawInboundCommand(obj).catch(err => {
      const idpfx = id ? `${id} ` : '';
      log.error(
        `${idpfx}inbound error:`,
        err,
        'from',
        JSON.stringify(obj, undefined, 2),
      );
      throw (err && err.message) || err;
    });
  };

  const app = express();
  // HTTP logging.
  app.use(
    morgan(`:method :url :status :res[content-length] - :response-time ms`, {
      stream: {
        write(msg) {
          log(msg.trimRight());
        },
      },
    }),
  );
  app.use(express.json()); // parse application/json
  const server = http.createServer(app);

  // serve the static HTML for the UI
  const htmldir = path.join(basedir, 'html');
  log(`Serving static files from ${htmldir}`);
  app.use(express.static(htmldir));
  app.use(express.static(new URL('../public', import.meta.url).pathname));

  // The rules for validation:
  //
  // path outside /private: always accept
  //
  // path /private/wallet-bridge: always accept
  //
  // other path in /private: require correct accessToken= in query params
  const validateAccessToken = async req => {
    const id = `${req.socket.remoteAddress}:${req.socket.remotePort}:`;

    const parsedUrl = new URL(req.url, 'http://some-host');
    const fullPath = parsedUrl.pathname;

    if (!fullPath.startsWith('/private/')) {
      // Allow any origin that's not marked private, without a accessToken.
      return true;
    }

    if (fullPath === '/private/wallet-bridge') {
      // Bypass accessToken just for the wallet bridge.
      return true;
    }

    // Validate the private accessToken.
    const accessToken = await getAccessToken(port);
    const reqToken = parsedUrl.searchParams.get('accessToken');

    if (verifyToken(reqToken, accessToken)) {
      return true;
    }

    log.error(
      id,
      `Invalid access token ${JSON.stringify(
        reqToken,
      )}; try running "agoric open"`,
    );
    return false;
  };

  // accept POST messages to arbitrary endpoints
  app.post('*', async (req, res) => {
    if (!(await validateAccessToken(req))) {
      res.json({ ok: false, rej: 'Unauthorized' });
      return;
    }

    // console.debug(`POST ${ep} got`, req.body); // should be jsonable
    inboundCommand(req.body, req, `POST`)
      .then(
        r => res.json({ ok: true, res: r }),
        rej => res.json({ ok: false, rej }),
      )
      .catch(_ => {});
  });

  // accept WebSocket channels at the root path.
  // This senses the Upgrade header to distinguish between plain
  // GETs (which should return index.html) and WebSocket requests.
  const wss = new WebSocket.Server({ noServer: true });
  server.on('upgrade', async (req, socket, head) => {
    if (!(await validateAccessToken(req))) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req);
    });
  });

  // Test to see if the listener already exists.
  await new Promise((resolve, reject) => {
    const to = setTimeout(
      () =>
        reject(
          Error(`Something is listening (but suspended) on ${host}:${port}`),
        ),
      3000,
    );
    const existing = createConnection(port, host, _c => {
      clearTimeout(to);
      reject(Error(`Something is aready listening on ${host}:${port}`));
    });
    existing.on('error', err => {
      clearTimeout(to);
      if (err.code === 'ECONNREFUSED') {
        // Success! host:port is not currently listening.
        resolve();
      } else {
        reject(err);
      }
    });
  });

  server.listen(port, host, () => log.info('Listening on', `${host}:${port}`));

  const pingInterval = setInterval(function ping() {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) {
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping(() => {});
    });
  }, 30000);

  wss.on('close', () => clearInterval(pingInterval));

  let lastChannelID = 0;

  function newChannel(ws, req) {
    lastChannelID += 1;
    const channelID = lastChannelID;
    const meta = { ...req, channelID };
    const id = `${req.socket.remoteAddress}:${req.socket.remotePort}[${channelID}]:`;

    log(id, `new WebSocket ${req.url}`);

    // Manage connection pings.
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Register the point-to-point channel.
    channels.set(channelID, ws);

    ws.on('error', err => {
      log.error(id, 'client error', err);
    });

    ws.on('close', (_code, _reason) => {
      log(id, 'client closed');
      inboundCommand(
        { type: 'ws/meta' },
        { ...meta, dispatcher: 'onClose' },
        id,
      ).finally(() => channels.delete(channelID));
    });

    // Close and throw if the open handler gives an error.
    inboundCommand(
      { type: 'ws/meta' },
      { ...meta, dispatcher: 'onOpen' },
      id,
    ).catch(e => {
      log(id, 'error opening connection:', e);
      ws.close();
    });

    ws.on('message', async message => {
      let obj = {};
      try {
        obj = JSON.parse(message);
        const res = await inboundCommand(obj, meta, id);

        // eslint-disable-next-line no-use-before-define
        sendJSON({ ...res, meta });
      } catch (error) {
        inboundCommand(
          { ...obj, error },
          { ...meta, dispatcher: 'onError' },
          id,
        ).catch(_ => {});
      }
    });
  }
  wss.on('connection', newChannel);

  function sendJSON(rawObj) {
    const { meta: { channelID } = {} } = rawObj;
    const obj = { ...rawObj };
    delete obj.meta;

    // Point-to-point.
    const c = channels.get(channelID);
    if (c) {
      send(c, JSON.stringify(obj));
    } else {
      // They probably just hung up.  On replay, we don't
      // want to be noisy.
      // TODO: Somehow coordinate with the inbound vat that
      // we no longer have active connections.
      log.debug(`[${channelID}]: channel not found`);
    }
  }

  return sendJSON;
}
