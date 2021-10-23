// -*- js -*-
import { extractMessage } from './util';

export default function setup(syscall, _state, _helpers, vatPowers) {
  function dispatch(vatDeliverObject) {
    if (vatDeliverObject[0] === 'message') {
      const { facetID, method, args } = extractMessage(vatDeliverObject);
      vatPowers.testLog(JSON.stringify({ target: facetID, method, args }));
    }
  }
  return dispatch;
}
