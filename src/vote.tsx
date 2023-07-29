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
      <div className="flex flex-col text-center bg-[url('Law_BG.png')] bg-[length:100%_100%] p-12">
        <div>
          <span className="text-3xl font-semibold">{currentVote.name}</span>
          <p className="m-4">{currentVote.flavor}</p>
        </div>
        <div className="flex border-gray-500 border-t border-collapse">
          <div className="flex-1 border-r border-gray-500">
            <ul>
              {currentVote.positiveTraits.map((t) => (
                <li key={t}>Pro-{t}</li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <ul>
              {currentVote.negativeTraits.map((t) => (
                <li key={t}>Anti-{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <input
        type="number"
        onChange={(e) => setVotesToCast(e.target.valueAsNumber)}
        value={votesToCast}
        min={0}
        max={availableInfluence}
      />
      <div className="flex justify-around">
        <button
          className="bg-[url('/Button_Against.png')] bg-cover h-24 aspect-square text-red-700"
          onClick={() =>
            Rune.actions.castVote({ direction: "against", amount: votesToCast })
          }
        />
        <button
          className="bg-[url('/Button_For.png')] bg-cover h-24 aspect-square text-green-700"
          onClick={() =>
            Rune.actions.castVote({ direction: "for", amount: votesToCast })
          }
        />
      </div>
    </>
  );
}
