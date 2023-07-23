import { STARTING_INFLUENCE } from "../constants";
import { GameState } from "../types";
import { species, traits } from "./party-traits";

const effects: Record<string, (game: GameState) => void> = {
  squirrelsLoseAllInfluence(game: GameState) {
    const squirrelPlayer = Object.values(game.players).find(
      (p) => p.party.species === "Squirrel"
    );
    if (squirrelPlayer) {
      squirrelPlayer.influence = 0;
    }
  },
};

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

function randomSplit<T>(list: T[], count: number) {
  const chosen = [];
  const rest = [...list];
  const _count = Math.min(count, rest.length);
  for (let i = 0; i < _count; i++) {
    const el = rest.splice(Math.floor(Math.random() * rest.length), 1)[0];
    chosen.push(el);
  }
  return [chosen, rest] as const;
}

function randomVote() {
  const [positiveTraits, rest] = randomSplit(traits, randomTraitCount());
  const [negativeTraits] = randomSplit(rest, randomTraitCount());
  return {
    name: "thing",
    flavor: "flavor text",
    positiveTraits,
    negativeTraits,
    votesFor: 0,
    votesAgainst: 0,
    effect: "squirrelsLoseAllInfluence",
  };
}

function generateParty(species: string) {
  const [likes, rest] = randomSplit(traits, randomTraitCount());
  const [dislikes] = randomSplit(rest, randomTraitCount());
  return {
    species,
    likes,
    dislikes,
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
            influence: STARTING_INFLUENCE,
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
        for (const trait of game.currentVote.positiveTraits) {
          game.votesPassed[trait] ??= { for: 0, against: 0 };
          game.votesPassed[trait].for += 1;
        }
        for (const trait of game.currentVote.negativeTraits) {
          game.votesPassed[trait] ??= { for: 0, against: 0 };
          game.votesPassed[trait].against += 1;
        }
      }

      if (game.currentVote.effect && game.currentVote.effect in effects) {
        effects[game.currentVote.effect](game);
      }

      game.currentVote = randomVote();
      allPlayerIds.forEach((p) => (game.players[p].hasVoted = false));
    },
  },
});
