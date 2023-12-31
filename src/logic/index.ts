import { STARTING_INFLUENCE, VOTES_TO_WIN } from "../constants";
import { GameState } from "../types";
import { species, traits as allTraits } from "./party-traits";

const effects = {
  squirrelsLoseAllInfluence(game: GameState) {
    const squirrelPlayer = Object.values(game.players).find(
      (p) => p.party.species === "Squirrel"
    );
    if (squirrelPlayer) {
      squirrelPlayer.influence = 0;
    }
  },
} satisfies Record<string, (game: GameState) => void>;

export type Effect = keyof typeof effects;

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

function randomVote(traits: string[]) {
  const [positiveTraits, rest] = randomSplit(traits, randomTraitCount());
  const [negativeTraits] = randomSplit(rest, randomTraitCount());
  return {
    name: "thing",
    flavor: "flavor text",
    positiveTraits,
    negativeTraits,
    votesFor: 0,
    votesAgainst: 0,
    effect: "squirrelsLoseAllInfluence" as Effect,
  };
}

function generateParty(species: string, traits: string[]) {
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
    const traits = Array.from(
      playerIds,
      () => randomSplit(allTraits, 5)[0]
    ).flat();
    const players = Object.fromEntries(
      playerIds.map((p) => [
        p,
        {
          party: generateParty(
            randomizedSpecies.splice(
              Math.floor(Math.random() * randomizedSpecies.length),
              1
            )[0],
            traits
          ),
          influence: STARTING_INFLUENCE,
          hasVoted: false,
        },
      ])
    );
    return {
      players,
      playerHasVoted: Object.fromEntries(playerIds.map((p) => [p, false])),
      currentVote: randomVote(traits),
      votesPassed: {},
      traits,
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
        if (game.currentVote.effect && game.currentVote.effect in effects) {
          effects[game.currentVote.effect](game);
        }
      }

      game.currentVote = randomVote(game.traits);
      allPlayerIds.forEach((p) => (game.players[p].hasVoted = false));

      const winners = allPlayerIds.filter(
        (p) =>
          game.players[p].party.likes.some(
            (l) => game.votesPassed[l]?.for >= VOTES_TO_WIN
          ) ||
          game.players[p].party.dislikes.some(
            (d) => game.votesPassed[d]?.against >= VOTES_TO_WIN
          )
      );
      if (winners.length > 0) {
        Rune.gameOver({
          players: Object.fromEntries(
            allPlayerIds.map((p) => [p, winners.includes(p) ? "WON" : "LOST"])
          ),
        });
      }
    },
  },
});
