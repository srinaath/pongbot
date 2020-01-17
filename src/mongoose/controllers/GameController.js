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
  return {
    winStreak: await winStreakCt(winner),
    loseStreak: await loseStreakCt(loser)
  }
};

const winStreakCt = async (player) => {
  const results = await GameModel.find( { $or: [ { 'winner.id': player.mentioned.id }, { 'loser.id': player.mentioned.id } ] } ).sort ({'updated_at': -1})
  let winStreak = 0
  for(let i=0; i < results.length; i++) {
    const result = results[i]
    if(result.winner.id === player.mentioned.id) {
      winStreak ++
    } else {
      break;
    }
  }
  return winStreak
}

const loseStreakCt = async (player) => {
  const results = await GameModel.find( { $or: [ { 'winner.id': player.mentioned.id }, { 'loser.id': player.mentioned.id } ] } ).sort ({'updated_at': -1})
  let loseStreak = 0
  for(let i=0; i < results.length; i++) {
    const result = results[i]
    if(result.loser.id === player.mentioned.id) {
      loseStreak ++
    } else {
      break;
    }
  }
  return loseStreak
}

const getStats = async (player) => {
  const wonGames = await GameModel.find({
    'winner.id': player.mentioned.id
  }).sort ({'updated_at': -1})

  const lostGames = await GameModel.find({
    'loser.id': player.mentioned.id
  }).sort ({'updated_at': -1})
  await StatsOperations.updateStats(player, wonGames.length, lostGames.length)
};


export default GameController