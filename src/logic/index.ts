import { traits } from "./party-traits";

function randomTraitCount() {
  const roll = Math.random();
  if (roll < 0.25) {
    return 1;
  }
  if (roll < 0.75) {
    return 2;
  }
  return 3;
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds) => {
    return {
      influence: Object.fromEntries(playerIds.map((p) => [p, 15])),
      playerHasVoted: Object.fromEntries(playerIds.map((p) => [p, false])),
      currentVote: {
        name: "thing",
        flavor: "flavor text",
        positiveTraits: Array.from(Array(randomTraitCount()), () =>
          Math.floor(Math.random() * traits.length)
        ).map((i) => traits[i]),
        negativeTraits: Array.from(Array(randomTraitCount()), () =>
          Math.floor(Math.random() * traits.length)
        ).map((i) => traits[i]),
        votesFor: 0,
        votesAgainst: 0,
      },
    };
  },
  actions: {
    castVote(params, actionContext) {
      if (actionContext.game.playerHasVoted[actionContext.playerId]) {
        throw Rune.invalidAction();
      }
      if (
        actionContext.game.influence[actionContext.playerId] < params.amount
      ) {
        throw Rune.invalidAction();
      }
      actionContext.game.currentVote[
        params.direction === "for" ? "votesFor" : "votesAgainst"
      ] += params.amount;
      actionContext.game.influence[actionContext.playerId] -= params.amount;
      actionContext.game.playerHasVoted[actionContext.playerId] = true;
    },
  },
});
