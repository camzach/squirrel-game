import { useState } from "react";
import { GameState } from "./types";

type Props = {
  currentVote: GameState["currentVote"];
  availableInfluence: number;
};

export default function Vote({ currentVote, availableInfluence }: Props) {
  const [votesToCast, setVotesToCast] = useState(0);
  return (
    <>
      <div className="flex flex-col text-[#391309] text-center bg-contain bg-center bg-no-repeat bg-[url('Law_BG.png')] bg-[length:100%_99%] px-14 pt-12 pb-16">
        <div>
          <span className="text-4xl uppercase font-bold">{currentVote.name}</span>
          <p className="m-3 text-lg font-semibold">It's the classic problem of Too Many bears. I got a Bear in the East, I got a bear in the west, I... {currentVote.flavor}</p>
        </div>
        <div className="flex border-[#391309] border-t-4 border-collapse font-bold">
          <div className="flex-1 border-r-4 border-inherit pt-2 text-[#196f15] " >
            <ul>
              {currentVote.positiveTraits.map((t) => (
                <li key={t}>Pro-{t}</li>
              ))}
            </ul>
          </div>
          <div className="flex-1 pt-2 text-[#840000]">
            <ul>
              {currentVote.negativeTraits.map((t) => (
                <li key={t}>Anti-{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-[url('/PartyAlignmentBar.png')] bg-no-repeat bg-center bg-[length:100%_100%] py-8 pb-10">
        <div className="flex justify-center px-10 space-x-0" >
          <button
            className="bg-[url('/Button_For.png')] bg-cover h-28 aspect-square"
            onClick={() =>
              Rune.actions.castVote({ direction: "for", amount: votesToCast })
            }
          />
          <div className="font-black text-[#391309] text-4xl px-12 content-center">
            <input className="bg-black/0 text-right w-10"
            type="number"
            onChange={(e) => setVotesToCast(e.target.valueAsNumber)}
            value={votesToCast}
            min={0}
            max={availableInfluence}
            />/{availableInfluence}
            
          </div>
          
          <button
            className="bg-[url('/Button_Against.png')] bg-cover h-28 aspect-square"
            onClick={() =>
              Rune.actions.castVote({ direction: "against", amount: votesToCast })
            }
          />
        </div>
      </div>
    </>
  );
}
