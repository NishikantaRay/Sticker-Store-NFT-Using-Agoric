// @ts-check

import { E } from '@agoric/eventual-send';
import { Far } from '@agoric/marshal';
import { makePromiseKit } from '@agoric/promise-kit';
import { sameStructure } from '@agoric/same-structure';

import { q } from '@agoric/assert';
import {
  ChoiceMethod,
  QuorumRule,
  ElectionType,
  looksLikeQuestionSpec,
} from './question.js';
import { assertType } from './paramManager.js';

const { details: X } = assert;

/** @type {MakeParamChangePositions} */
const makeParamChangePositions = (paramSpec, proposedValue) => {
  const positive = harden({ changeParam: paramSpec, proposedValue });
  const negative = harden({ noChange: paramSpec });
  return { positive, negative };
};

/** @type {ValidateParamChangeQuestion} */
const validateParamChangeQuestion = details => {
  assert(
    details.method === ChoiceMethod.UNRANKED,
    X`ChoiceMethod must be UNRANKED, not ${details.method}`,
  );
  assert(
    details.electionType === ElectionType.PARAM_CHANGE,
    X`ElectionType must be PARAM_CHANGE, not ${details.electionType}`,
  );
  assert(
    details.maxChoices === 1,
    X`maxChoices must be 1, not ${details.maxChoices}`,
  );
  assert(
    details.quorumRule === QuorumRule.MAJORITY,
    X`QuorumRule must be MAJORITY, not ${details.quorumRule}`,
  );
  assert(
    details.tieOutcome.noChange,
    X`tieOutcome must be noChange, not ${details.tieOutcome}`,
  );
};

/** @type {AssertBallotConcernsQuestion} */
const assertBallotConcernsQuestion = (paramName, questionDetails) => {
  assert(
    // @ts-ignore typescript isn't sure the question is a paramChangeIssue
    // if it isn't, the assertion will fail.
    questionDetails.issue.paramSpec.parameterName === paramName,
    X`expected ${q(paramName)} to be included`,
  );
};

/** @type {SetupGovernance} */
const setupGovernance = async (
  paramManagerRetriever,
  poserFacet,
  contractInstance,
  timer,
) => {
  /** @type {WeakSet<Instance>} */
  const voteCounters = new WeakSet();

  /** @type {VoteOnParamChange} */
  const voteOnParamChange = async (
    paramSpec,
    proposedValue,
    voteCounterInstallation,
    deadline,
  ) => {
    const paramMgr = E(paramManagerRetriever).get(paramSpec);
    const paramName = paramSpec.parameterName;
    const param = await E(paramMgr).getParam(paramName);
    assertType(param.type, proposedValue, paramName);
    const outcomeOfUpdateP = makePromiseKit();

    const { positive, negative } = makeParamChangePositions(
      paramSpec,
      proposedValue,
    );
    const issue = harden({
      paramSpec,
      contract: contractInstance,
      proposedValue,
    });
    const questionSpec = looksLikeQuestionSpec({
      method: ChoiceMethod.UNRANKED,
      issue,
      positions: [positive, negative],
      electionType: ElectionType.PARAM_CHANGE,
      maxChoices: 1,
      closingRule: { timer, deadline },
      quorumRule: QuorumRule.MAJORITY,
      tieOutcome: negative,
    });

    const { publicFacet: counterPublicFacet, instance: voteCounter } = await E(
      poserFacet,
    ).addQuestion(voteCounterInstallation, questionSpec);

    voteCounters.add(voteCounter);

    // CRUCIAL: Here we wait for the voteCounter to declare an outcome, and then
    // attempt to update the value of the parameter if that's what the vote
    // decided. We need to make sure that outcomeOfUpdateP is updated whatever
    // happens.
    // * If the vote was negative, resolve to the outcome
    // * If we update the value, say so
    // * If the update fails, reject the promise
    // * if the vote outcome failed, reject the promise.
    E(counterPublicFacet)
      .getOutcome()
      .then(outcome => {
        if (sameStructure(positive, outcome)) {
          E(paramMgr)
            [`update${paramName}`](proposedValue)
            .then(newValue => outcomeOfUpdateP.resolve(newValue))
            .catch(e => {
              outcomeOfUpdateP.reject(e);
            });
        } else {
          outcomeOfUpdateP.resolve(negative);
        }
      })
      .catch(e => {
        outcomeOfUpdateP.reject(e);
      });

    return {
      outcomeOfUpdate: outcomeOfUpdateP.promise,
      instance: voteCounter,
      details: E(counterPublicFacet).getDetails(),
    };
  };

  return Far('paramGovernor', {
    voteOnParamChange,
    createdQuestion: b => voteCounters.has(b),
  });
};

harden(setupGovernance);
harden(makeParamChangePositions);
harden(validateParamChangeQuestion);
harden(assertBallotConcernsQuestion);
export {
  setupGovernance,
  makeParamChangePositions,
  validateParamChangeQuestion,
  assertBallotConcernsQuestion,
};
