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

function randomVote() {
  return {
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
  };
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 8,
  setup: (playerIds) => {
    return {
      influence: Object.fromEntries(playerIds.map((p) => [p, 15])),
      playerHasVoted: Object.fromEntries(playerIds.map((p) => [p, false])),
      currentVote: randomVote(),
      votesPassed: {},
    };
  },
  actions: {
    castVote(params, { game, playerId, allPlayerIds }) {
      if (game.playerHasVoted[playerId]) {
        throw Rune.invalidAction();
      }
      if (game.influence[playerId] < params.amount) {
        throw Rune.invalidAction();
      }
      game.currentVote[
        params.direction === "for" ? "votesFor" : "votesAgainst"
      ] += params.amount;
      game.influence[playerId] -= params.amount;
      game.playerHasVoted[playerId] = true;

      if (!Object.values(game.playerHasVoted).every((v) => v)) {
        return;
      }

      if (game.currentVote.votesFor > game.currentVote.votesAgainst) {
        for (const vote of game.currentVote.positiveTraits) {
          game.votesPassed[`Pro-${vote}`] ??= 0;
          game.votesPassed[`Pro-${vote}`] += 1;
        }
        for (const vote of game.currentVote.negativeTraits) {
          game.votesPassed[`Anti-${vote}`] ??= 0;
          game.votesPassed[`Anti-${vote}`] += 1;
        }
      }

      game.currentVote = randomVote();
      game.playerHasVoted = Object.fromEntries(
        allPlayerIds.map((p) => [p, false])
      );
    },
  },
});
