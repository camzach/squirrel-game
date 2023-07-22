import React, { useState } from "react";
import { PlayerId, Players } from "rune-games-sdk/multiplayer";
import { GameState } from "./types";
import Vote from "./vote";

function App() {
  const [currentVote, setCurrentVote] = useState<
    GameState["currentVote"] | null
  >(null);
  const [influence, setInfluence] = useState<GameState["influence"] | null>(
    null
  );
  const [playerHasVoted, setPlayerHasVoted] = useState<
    GameState["playerHasVoted"] | null
  >(null);
  const [me, setMe] = useState<PlayerId | undefined>(undefined);
  React.useEffect(() => {
    Rune.initClient({
      onChange({ newGame, yourPlayerId }) {
        setCurrentVote(newGame.currentVote);
        setInfluence(newGame.influence);
        setPlayerHasVoted(newGame.playerHasVoted);
        setMe(yourPlayerId);
      },
    });
  }, []);
  if (currentVote === null || influence === null || playerHasVoted === null)
    return "Loading...";
  if (me === undefined) return "Spectator Mode";
  return (
    <>
      <h1 className="text-5xl">Squirrel Game!!!</h1>
      <div>Current Influence: {influence[me]}</div>
      {!playerHasVoted[me] ? (
        <Vote currentVote={currentVote} availableInfluence={influence[me]} />
      ) : (
        "Awaiting all votes..."
      )}
    </>
  );
}

export default App;
