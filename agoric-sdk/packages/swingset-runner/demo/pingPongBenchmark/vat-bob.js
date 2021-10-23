import { E } from '@agoric/eventual-send';
import { Far } from '@agoric/marshal';

const log = console.log;

export function buildRootObject(_vatPowers) {
  let myNickname;

  function makeContact(otherContact, otherNickname) {
    return Far('contact', {
      ping(tag) {
        log(`${myNickname}: pinged with "${tag}", ponging ${otherNickname}`);
        E(otherContact).pong(tag, myNickname);
      },
    });
  }

  return Far('root', {
    setNickname(nickname) {
      myNickname = nickname;
    },
    hello(otherContact, otherNickname) {
      const myContact = makeContact(otherContact, otherNickname);
      E(otherContact).myNameIs(myNickname);
      log(`${myNickname}.hello sees ${otherNickname}`);
      return myContact;
    },
  });
}
