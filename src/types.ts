import type { RuneClient, PlayerId } from "rune-games-sdk/multiplayer";

export interface GameState {
  influence: Record<PlayerId, number>;
  playerHasVoted: Record<PlayerId, boolean>;
  currentVote: {
    name: string;
    flavor: string;
    votesFor: number;
    votesAgainst: number;
  };
}

export type GameActions = {
  castVote: (params: { direction: "for" | "against"; amount: number }) => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}
