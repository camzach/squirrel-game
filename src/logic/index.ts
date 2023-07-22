import { species, traits } from "./party-traits";

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

function generateParty(species: string) {
  return {
    species,
    likes: Array.from(Array(randomTraitCount()), () =>
      Math.floor(Math.random() * traits.length)
    ).map((i) => traits[i]),
    dislikes: Array.from(Array(randomTraitCount()), () =>
      Math.floor(Math.random() * traits.length)
    ).map((i) => traits[i]),
  };
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 8,
  setup: (playerIds) => {
    const randomizedSpecies = [...species];
    return {
      players: Object.fromEntries(
        playerIds.map((p) => [
          p,
          {
            party: generateParty(
              randomizedSpecies.splice(
                Math.floor(Math.random() * randomizedSpecies.length),
                1
              )[0]
            ),
            influence: 15,
            hasVoted: false,
          },
        ])
      ),
      playerHasVoted: Object.fromEntries(playerIds.map((p) => [p, false])),
      currentVote: randomVote(),
      votesPassed: {},
    };
  },
  actions: {
    castVote(params, { game, playerId, allPlayerIds }) {
      const player = game.players[playerId];
      if (player.hasVoted) {
        throw Rune.invalidAction();
      }
      if (player.influence < params.amount) {
        throw Rune.invalidAction();
      }
      game.currentVote[
        params.direction === "for" ? "votesFor" : "votesAgainst"
      ] += params.amount;
      player.influence -= params.amount;
      player.hasVoted = true;

      if (!Object.values(game.players).every((p) => p.hasVoted)) {
        return;
      }

      if (game.currentVote.votesFor > game.currentVote.votesAgainst) {
        for (const vote of game.currentVote.positiveTraits) {
          console.log("positive trait for ", vote);
          game.votesPassed[`Pro-${vote}`] ??= 0;
          game.votesPassed[`Pro-${vote}`] += 1;
          console.log(game.votesPassed);
        }
        for (const vote of game.currentVote.negativeTraits) {
          console.log("negative trait for ", vote);
          game.votesPassed[`Anti-${vote}`] ??= 0;
          game.votesPassed[`Anti-${vote}`] += 1;
        }
      }

      game.currentVote = randomVote();
      allPlayerIds.forEach((p) => (game.players[p].hasVoted = false));
    },
  },
});
