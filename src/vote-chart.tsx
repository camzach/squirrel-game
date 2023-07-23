import { CSSProperties, useState } from "react";
import { VOTES_TO_WIN } from "./constants";
import { traits } from "./logic/party-traits";
import { GameState } from "./types";

type Props = {
  passedVotes: GameState["votesPassed"];
};

export default function VoteChart({ passedVotes }: Props) {
  const [sortOrder, setSortOrder] = useState<"for" | "against">("for");
  return (
    <div>
      <div className="flex text-center">
        <label className="flex-1">
          <input
            className="hidden peer"
            type="radio"
            value="against"
            name="forOrAgainst"
            checked={sortOrder === "against"}
            onChange={(e) => setSortOrder(e.target.value as "against")}
          />
          <div
            aria-hidden
            className="bg-gray-300 hover:bg-gray-500 peer-checked:bg-gray-400"
          >
            Sort by votes Against
          </div>
        </label>
        <label className="flex-1">
          <input
            className="hidden peer"
            type="radio"
            value="for"
            name="forOrAgainst"
            checked={sortOrder === "for"}
            onChange={(e) => setSortOrder(e.target.value as "for")}
          />
          <div
            aria-hidden
            className="bg-gray-300 hover:bg-gray-500 peer-checked:bg-gray-400"
          >
            Sort by votes For
          </div>
        </label>
      </div>
      <ul>
        {traits
          .filter(
            (t) =>
              t in passedVotes &&
              (passedVotes[t].for > 0 || passedVotes[t].against > 0)
          )
          .sort((a, b) => passedVotes[b][sortOrder] - passedVotes[a][sortOrder])
          .map((trait) => (
            <li
              key={trait}
              className="relative text-center"
              style={
                {
                  "--votes-for": `${Math.floor(
                    50 - Math.min(1, passedVotes[trait].for / VOTES_TO_WIN) * 50
                  )}%`,
                  "--votes-against": `${Math.floor(
                    50 -
                      Math.min(1, passedVotes[trait].against / VOTES_TO_WIN) *
                        50
                  )}%`,
                } as CSSProperties
              }
            >
              <div
                aria-hidden
                className="absolute left-1/2 right-[var(--votes-for)] h-full -z-10 bg-gradient-to-r from-white via-90% via-blue-200 to-blue-500"
              />
              <div
                aria-hidden
                className="absolute right-1/2 left-[var(--votes-against)] h-full -z-10 bg-gradient-to-l from-white via-90% via-red-200 to-red-500"
              />
              {trait}
            </li>
          ))}
      </ul>
    </div>
  );
}
