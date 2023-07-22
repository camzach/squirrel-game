Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds) => {
    return {
      influence: Object.fromEntries(playerIds.map((p) => [p, 15])),
      playerHasVoted: Object.fromEntries(playerIds.map((p) => [p, false])),
      currentVote: {
        name: "thing",
        flavor: "flavor text",
        votesFor: 0,
        votesAgainst: 0,
      },
    };
  },
  actions: {
    castVote(params, actionContext) {
      if (actionContext.game.playerHasVoted[actionContext.playerId]) {
        throw Rune.invalidAction();
      }
      if (
        actionContext.game.influence[actionContext.playerId] < params.amount
      ) {
        throw Rune.invalidAction();
      }
      actionContext.game.currentVote[
        params.direction === "for" ? "votesFor" : "votesAgainst"
      ] += params.amount;
      actionContext.game.influence[actionContext.playerId] -= params.amount;
      actionContext.game.playerHasVoted[actionContext.playerId] = true;
    },
  },
});
