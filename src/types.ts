import type { RuneClient, PlayerId } from "rune-games-sdk/multiplayer";

export type GameState = {
  players: Record<
    PlayerId,
    {
      party: Party;
      influence: number;
      hasVoted: boolean;
    }
  >;
  currentVote: {
    name: string;
    flavor: string;
    positiveTraits: string[];
    negativeTraits: string[];
    votesFor: number;
    votesAgainst: number;
  };
  votesPassed: Record<string, { for: number; against: number }>;
};

export type Party = {
  species: string;
  likes: string[];
  dislikes: string[];
};

export type GameActions = {
  castVote: (params: { direction: "for" | "against"; amount: number }) => void;
};

export type Law = {
  title: string;
  flavor: string;
  positiveTraits: string[];
  negativeTraits: string[];
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}
