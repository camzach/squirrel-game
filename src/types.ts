import type { RuneClient, PlayerId } from "rune-games-sdk/multiplayer";

export type GameState = {
  influence: Record<PlayerId, number>;
  playerHasVoted: Record<PlayerId, boolean>;
  currentVote: {
    name: string;
    flavor: string;
    positiveTraits: string[];
    negativeTraits: string[];
    votesFor: number;
    votesAgainst: number;
  };
  votesPassed: Record<string, number>;
};

export type GameActions = {
  castVote: (params: { direction: "for" | "against"; amount: number }) => void;
};

export type Law = {
  title: string;
  flavor: string;
  positiveTraits: string[];
  negativeTraits: string[];
}

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}
