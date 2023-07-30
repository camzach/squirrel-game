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
      <div className="bg-[#160100]">
        <div className="bg-[url('/PartyAlignmentBar.png')]  bg-no-repeat bg-center bg-[length:100%_100%] pt-4">
          <h1 className="text-5xl text-[#391309] py-2 text-center font-black">{me.party.species} Party</h1>
          <div className="text-center text-[#391309] text-lg leading-3">
              <div className="font-bold">
              Current Influence: 
              </div>
              <div className="text-2xl font-black pb-8">
                {me.influence}
              </div>
            </div>
        </div>
        {!me.hasVoted ? (
          <Vote currentVote={currentVote} availableInfluence={me.influence} />
          ) : (
            "Awaiting all votes..."
          )}
          <div className="mx-1 pb-16">
            <div className="flex mx-2 text-center">
              <div className="flex-1 font-bold text-lg text-[#196f15]">
                Supported:
                <ul className="list-disc text-left pl-10 leading-5 list-inside text-base">
                  {me.party.likes.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 text-lg font-bold text-[#840000]">
                Opposed:
                <ul className="list-disc text-left pl-12 leading-5 list-inside text-base">
                  {me.party.dislikes.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        
      </div>

      
      <VoteChart passedVotes={passedVotes} />
    </>
  );
}

export default App;
