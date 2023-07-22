import React, { useState } from "react";
import { PlayerId, Players } from "rune-games-sdk/multiplayer";
import { GameState } from "./types";
import Vote from "./vote";
import {
  XYPlot,
  HorizontalBarSeries,
  HorizontalGridLines,
  LabelSeries,
  VerticalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
} from "react-vis";

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
  const [passedVotes, setPassedVotes] = useState<
    GameState["votesPassed"] | null
  >(null);
  const [me, setMe] = useState<PlayerId | undefined>(undefined);
  React.useEffect(() => {
    Rune.initClient({
      onChange({ newGame, yourPlayerId }) {
        setCurrentVote(newGame.currentVote);
        setInfluence(newGame.influence);
        setPlayerHasVoted(newGame.playerHasVoted);
        setPassedVotes(newGame.votesPassed);
        setMe(yourPlayerId);
      },
    });
  }, []);
  if (
    currentVote === null ||
    influence === null ||
    playerHasVoted === null ||
    passedVotes === null
  )
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
      <ul>
        {Object.entries(passedVotes)
          .sort(([, aVotes], [, bVotes]) => bVotes - aVotes)
          .map(([trait, votes]) => (
            <li key={trait} className="relative isolate">
              <div
                style={{
                  "--votes": `${100 - Math.floor((votes / 10) * 100)}%`,
                }}
                className="bg-blue-500 absolute top-0 left-0 bottom-0 right-[var(--votes)] -z-10"
              />
              {trait} - {votes}
            </li>
          ))}
      </ul>
    </>
  );
}

export default App;
