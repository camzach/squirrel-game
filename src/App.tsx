import React, { useState } from "react";
import { Players } from "rune-games-sdk/multiplayer";

function App() {
  const [points, setPoints] = useState<Record<string, number>>({});
  const [players, setPlayers] = useState<Players>({});
  React.useEffect(() => {
    Rune.initClient({
      onChange({ players, newGame: { points } }) {
        setPlayers(players);
        setPoints(points);
      },
    });
  }, []);
  return (
    <>
      <h1 className="text-5xl">Squirrel Game!!!</h1>
      <ul>
        {Object.keys(players).map((player) => (
          <li>
            {players[player].displayName} - {points[player]}
            <button onClick={() => Rune.actions.givePoint(player)}>
              Give a point
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
