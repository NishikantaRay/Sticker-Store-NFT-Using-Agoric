# Network API

Suitably-empowered code inside a vat can access a "network API" that works vaguely like the BSD socket API. This code can open a listening port on various networking stacks, initiate connections to remote ports, send and receive data over these connections, and finally close the connection and/or ports.

The type of connection is limited by the host in which the vat is running. Chain-based machines must operate in a platonic realm of replicated consensus, so their network options are limited to protocols like IBC, which allow one gestalt chain to talk to other chain-like entities. Each such entity is defined by an evolving set of consensus rules, which typically include a current set of validator public keys and a particular history of hashed block identifiers.

[**CAVEAT:** IBC uses "Connection" to mean a chain-to-chain "hop", and "Channel" to mean a Port-to-Port pathway through a series of hops.  https://github.com/cosmos/ics/blob/master/ibc/1_IBC_TERMINOLOGY.md#connection . This is unfortunate, because IBC "Channels" correspond most precisely to TCP "connections", and most discussions of network APIs (including this one, below) will talk about "connections" extensively. 
For now, our IBC implementation can only use pre-established hops, and provides no means for user-level code to create new hops (IBC Connections) at runtime. But user-level code can create new IBC Channels at any time. The terminology confusion will be most obvious in the section on "Accepting an Inbound Connection", where the user code is really accepting an inbound *IBC Channel*.]

A channel via these IBC hops will terminate in IBC-aware code on either end. These endpoints might be traditional (static) IBC handlers (such as an ICS-20 token transfer module), or dynamic IBC handlers (e.g. running in a SwingSet vat). SwingSet vat code that wants to speak to vat code in a different SwingSet machine would not use the IBC connection directly: instead it would simply perform normal eventual-send operations (`E(target).foo(args)`) and let the "CapTP" promise-pipelining layer handle the details. But vat code which wants to speak to an ICS-20 handler in some other chain would need to use this layer.

Vats which live inside a solo machine are able to use traditional networking layers, like TCP, HTTP, and WebSockets. This enables them to communicate with e.g. browser-side UI frontends that use WebSockets to query the vat for order status. These connections do not have to follow normal ocap rules, so vat code which accept them must provide their own authentication and access control protections.

Solo machines may be able to talk to chains and vice versa using specialized protocols. This will be used by CapTP to provide ocap messaging between these heterogeneous machine types.

## The agoric-sdk User Local Port

Each user of the Agoric testnet gets a few personal IBC listening ports. You can access these `Port` objects in the `home.ibcport` array, and you can learn their local address by calling something like `E(home.ibcport[0]).getLocalAddress()`, which will give you a local address like `/ibc-port/portbvmnfb`.

This is currently the only way for user code to get an IBC `Port`, though non-IBC ports can be allocated using the local `home.network` object.  This is an advanced use case, to be documented later.

## Connecting to a Remote Port

To establish a connection, you must start with a local `Port` object, and you must know the name of the remote endpoint. The remote endpoint will have a name like `/ibc-hop/$HOPNAME/ibc-port/$PORTNAME/ordered/$VERSION` (where `ibc-hop`, `ibc-port` and `ordered` are literal strings, spelled just like that, but `$HOPNAME`, `$PORTNAME`, and `$VERSION` are placeholders for arbitrary values that will vary from one endpoint to another).

You must also prepare a `ConnectionHandler` object to manage the connection you're about to create. This has a number of methods which will be called when the things happen to the connection, including packets arriving. This is described below.

Then you will call the `connect()` method on your local `Port`. This will return a `Promise` that will fire with a new `Connection` object, on which you can send data. Your `ConnectionHandler` will be notified about the new channel, and will receive inbound data from the other side.

```js
E(home.ibcport[0]).connect(endpoint, connectionHandler)
  .then(conn => doSomethingWithConnection(conn));
```

## Opening a Listening Port and Accepting an Inbound Connection

The other side of `connect()` is a "listening port". These ports are waiting for inbound connections to be established.

To get a listening port, you need a `NetworkInterface` object (such as the one on your `ag-solo` under `home.network`) and ask it to `bind()` to an endpoint. You can either provide a specific port name, or allow the API to allocate a random one for you. The endpoint specifies the type of connection that this port will be able to accept (IBC, TCP, etc), and some properties of that connection. `bind()` uses a "multiaddress" to encode this information.

```js
// ask for a random allocation - ends with a slash
E(home.network).bind('/ibc-port/`)
  .then(port => usePort(port));
//
// or ask for a specific port name
E(home.network).bind('/ibc-port/my-cool-port-name`)
  .then(port => usePort(port));
```

IBC has named "hops" (what they call "Connections" in the IBC spec) which each carry data between two specific chains.  These hops are different from the connections described in this document.  When you bind a port like `/ibc-port/$PORT` without specifying the "hop", any IBC chain can initiate a connection to this port.

You can ask the `Port` object this returns for its local address, which is especially useful if you had asked for a random allocation (since otherwise you have no way to know what address you got):

```js
E(port).getLocalAddress().then(localAddress => useIt(localAddress))
```

`E(home.ibcport[0]).addListener()`

Once the port is bound, you must call `addListener` to mark it as ready for inbound connections. You must provide this with a `ListenHandler` object, which has methods to react to listening events. As with `ConnectionHandler`, these methods are all optional.

* `onListen(port, handler)`: called when the port starts listening
* `onAccept(port, remote, handler)`: called when a new channel has been accepted
* `onError(port, rejection, handler)`: called if the port is no longer able to accept channels, such as if the Connection to the remote chain has failed, perhaps because a consensus failure was observed
* `onRemove(port, handler)`: called when the `ListenHandler` is being removed

Once your `ChannelHandler` is prepared, call `addListener`:

```js
port.addListener(handler).then(() => console.log('listener is active'))
```

Of all the methods, `onAccept` is the interesting one. It is called with a `remote` endpoint, which tells you the address of the `Port` at the other end, where someone else called `.connect`. You can use this to decide if you want to accept the connection, or what sort of authority to exercise in response to messages arriving therein.

If you choose to accept, your `onAccept` method must return a `Promise` that fires with a `ConnectionHandler`. This will be used just like the one you would pass into `connect()`. To decline, throw an error.


## Sending Data

The Networking API (at least for IBC) provides a "record pipe", in which each packet is transmitted intact over the network, requiring no additional framing to distinguish where one packet ends and the next one begins. This is in contrast to the "byte pipe" provided by a TCP connection, where you must typically prepend length headers to establish framing boundaries.

Once you have a `Connection` object, you send data by calling its `send` method:

```js
connection.send('data');
```

`send` actually returns a Promise (for more `Bytes`), which contains the ACK data for this message.  For IBC, if anything but an empty `''` ACK is needed, you must resolve the `onReceive` returned Promise within the same block as the received packet message (i.e. it must not depend upon further input from the chain in order to resolve).  This restriction may be enforced differently or lifted for other network implementations.

NOTE: The type of this data is currently a string.  Ideally we would also accept Node.js `Buffer` objects, or Javascript `ArrayBuffer` and `TypedArray` objects, but unfortunately neither can be serialized by our current inter-vat marshalling code.

## Receiving Data: The ConnectionHandler

You must provide each open connection with a `ConnectionHandler` object, where you write methods that will be called when various things happen to the connection. You can share a single handler object between multiple connections, if you like, or you can make a separate one for each.

You can omit any of the methods and those events will simply be ignored. All these methods include the Connection object as the first argument, and the `ConnectionHandler` itself as the last argument, which might help if you want to share a common handler function among multiple connections.

* `onOpen(connection, handler)`: this is called when the connection is established, which tells you that the remote end has successfully accepted the connection request
* `onReceive(connection, packetBytes, handler)`: this is called each time the remote end sends a packet full of data
* `onClose(connection, reason, handler)`: this is called when the connection is closed, either because one side wanted it to close, or because an error occurred

The `reason` in `onclose` is optional, as in it may be `undefined`.

`onReceive` is the most important method. Each time the remote end sends a packet, your `onReceive` method will be called with the data inside that packet (currently as a String, but ideally as an ArrayBuffer with a custom `.toString()` method with an optional `encoding` argument (default `'latin1'`), so that it can contain arbitrary bytes).

The return value of `onReceive` is nominally a Promise for the ACK data of the message (and should thus appear as the eventual resolution of the Promise returned by `connection.send()` on the other side). However the ACK data can only appear in the block which includes the transaction that delivered the message, so there is a limited time window during which this data can be successfully delivered, and there is no guarantee that `onReceive` will return a Promise that resolves in time.  If the promise does not resolve in time, the implementation will automatically send an empty `''` ACK.  Because ACKs with data in them are difficult for your handler to get right, it is better to avoid them, where possible.

## Closing the Connection

When a given Connection has ceased to be useful, you should close it:

```js
connection.close();
```

This initiates a shutdown. The `ConnectionHandler` on both sides will eventually see their `onClose()` methods be called, with a `reason`.  It will allow them to distinguish an intentional `onClose()` (`reason` is `undefined`) from some error condition.

## Removing a Listener

When you no longer wish to receive connections on a port, you can remove the listener:

```js
port.removeListener(handler).then(() => console.log('removed'));
```

You must provide the handler you added, to enable the future ability to have multiple listeners on the same port.

Note that if you want to listen on this port again, you can just call `port.addListener(...)`, as before.  If you want to start a new connection, you can always call `port.connect(...)`.

### Closing the Port Entirely

Removing a listener doesn't release the port address to make it available for other `bind` requests.  You can call:

```js
port.revoke();
```

to completely deallocate the port, remove all listeners, close all pending connections, and release its address.

**CAUTION:** Be aware that if you call `E(home.ibcport[0]).revoke()`, it will be useless for new `.connect` or `.addListener` attempts.  You will need to provision a new Agoric client via https://testnet.agoric.com/ to obtain a new setup with a functioning `home.ibcport`.
