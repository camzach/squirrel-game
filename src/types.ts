import type { RuneClient, PlayerId } from "rune-games-sdk/multiplayer";

export interface GameState {
  points: Record<PlayerId, number>;
}

export type GameActions = {
  givePoint: (to: string) => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}
