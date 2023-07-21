Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds) => {
    return {
      points: Object.fromEntries(playerIds.map((p) => [p, 0])),
    };
  },
  actions: {
    givePoint(to, { game }) {
      game.points[to] += 1;
    },
  },
  events: {
    playerJoined: (playerId, { game }) => {
      game.points[playerId] = 0;
    },
    playerLeft: (playerId, { game }) => {
      delete game.points[playerId];
    },
  },
});
