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
      <div className="flex flex-col text-center border-gray-500 border">
        <div>
          <span className="text-xl font-semibold">{currentVote.name}</span>
          <p>{currentVote.flavor}</p>
        </div>
        <div className="flex border-gray-500 border-t border-collapse">
          <p className="flex-1 border-r border-gray-500">
            <ul>
              {currentVote.positiveTraits.map((t) => (
                <li>Pro-{t}</li>
              ))}
            </ul>
          </p>
          <p className="flex-1">
            <ul>
              {currentVote.negativeTraits.map((t) => (
                <li>Anti-{t}</li>
              ))}
            </ul>
          </p>
        </div>
      </div>
      <input
        type="number"
        onChange={(e) => setVotesToCast(e.target.valueAsNumber)}
        value={votesToCast}
        min={0}
        max={availableInfluence}
      />
      <button
        className="bg-gray-200 hover:bg-gray-500 rounded-lg p-2 py-1"
        onClick={() =>
          Rune.actions.castVote({ direction: "for", amount: votesToCast })
        }
      >
        Cast votes For
      </button>
      <button
        className="bg-gray-200 hover:bg-gray-500 rounded-lg p-2 py-1"
        onClick={() =>
          Rune.actions.castVote({ direction: "against", amount: votesToCast })
        }
      >
        Cast votes Against
      </button>
    </>
  );
}
