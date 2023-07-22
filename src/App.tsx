import React, { useState } from "react";
import { PlayerId } from "rune-games-sdk/multiplayer";
import { GameState } from "./types";
import Vote from "./vote";

function App() {
  const [currentVote, setCurrentVote] = useState<
    GameState["currentVote"] | null
  >(null);
  const [passedVotes, setPassedVotes] = useState<
    GameState["votesPassed"] | null
  >(null);
  const [me, setMe] = useState<GameState["players"][PlayerId] | undefined>(
    undefined
  );
  React.useEffect(() => {
    Rune.initClient({
      onChange({ newGame, yourPlayerId }) {
        setCurrentVote(newGame.currentVote);
        setPassedVotes(newGame.votesPassed);
        if (yourPlayerId !== undefined) {
          setMe(newGame.players[yourPlayerId]);
        }
      },
    });
  }, []);
  if (currentVote === null || me === undefined || passedVotes === null)
    return "Loading...";
  if (me === undefined) return "Spectator Mode";
  return (
    <>
      <h1 className="text-5xl">{me.party.species} Game!!!</h1>
      <div className="m-3">
        <div>Current Influence: {me.influence}</div>
        <div className="flex">
          <div className="flex-1">
            Your likes:
            <ul className=" list-disc list-inside">
              {me.party.likes.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            Your dislikes:
            <ul className=" list-disc list-inside">
              {me.party.dislikes.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {!me.hasVoted ? (
        <Vote currentVote={currentVote} availableInfluence={me.influence} />
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
