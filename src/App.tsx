import React, { useState } from "react";
import { PlayerId } from "rune-games-sdk/multiplayer";
import { GameState } from "./types";
import Vote from "./vote";
import VoteChart from "./vote-chart";

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
      <div style={{backgroundImage: "url(${./PartyAlignmentBar.png})"}} className="bg-local">
        <h1 className="text-5xl text-center">{me.party.species} Party</h1>
        <div className="m-3">
        
          <div className="flex text-center">
           <div className="flex-1 text-senut-green">
             Supported:
             <ul className="list-disc list-inside">
                {me.party.likes.map((t) => (
                  <li key={t}>{t}</li>
               ))}
             </ul>
           </div>
            <div className="flex-1 text-senut-red">
             Opposed:
              <ul className=" list-disc list-inside">
               {me.party.dislikes.map((t) => (
                 <li key={t}>{t}</li>
               ))}
              </ul>
          </div>
         </div>
          <div className="text-center bg-cover">Current Influence: <br></br> {me.influence}</div>
        </div>
      </div>
    

      {!me.hasVoted ? (
        <Vote currentVote={currentVote} availableInfluence={me.influence} />
      ) : (
        "Awaiting all votes..."
      )}
      <VoteChart passedVotes={passedVotes} />
    </>
  );

  
}



export default App;
