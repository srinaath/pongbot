import GameModel from '../models/GameModel'
import StatsOperations from './StatsController'

const GameController = {};

// Show list of employees
GameController.saveGame = async (winner, loser, winnerSet, loserSet) => {
  const game = new GameModel({
     winner: {
      id: winner.mentioned.id,
      name: winner.mentioned.name,
      text: winner.text
    },
    loser: {
      id: loser.mentioned.id,
      name: loser.mentioned.name,
      text: loser.text
    },
    winnerSet,
    loserSet
  })
  await game.save()
  await getStats(winner)
  await getStats(loser)
};

const getStats = async (player) => {
  const wonGames = await GameModel.find({
    'winner.id': player.mentioned.id
  })

  const lostGames = await GameModel.find({
    'loser.id': player.mentioned.id
  })
  await StatsOperations.updateStats(player, wonGames.length, lostGames.length)
};


export default GameController