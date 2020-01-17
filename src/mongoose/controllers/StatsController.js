import StatsModel from '../models/StatsModel'
import { getRandomizedValueFromArray } from '../../helpers/randomizedText'

const StatsController = {};


StatsController.updateStats = async (player, winCt, lostCt) => {
  const percentageOfWins = (winCt/(winCt + lostCt)) * 100
  await StatsModel.findOneAndUpdate({
    'player': player
  }, {
    wins: winCt,
    losses: lostCt,
    percentage: percentageOfWins
  }, {
    new: true,
    upsert: true
  })
};

StatsController.getPlayersOfSameCaliber = async (player, offsetPercentage) => {
  const matchedPlayer = await StatsModel.findOne({
    'player.mentioned.id': player.mentioned.id
  })
  if(matchedPlayer) {
    const lowerBound = matchedPlayer.percentage - offsetPercentage
    const upperBound = matchedPlayer.percentage + offsetPercentage
    const players = await StatsModel.find({ 
      "percentage": {
        $gt: lowerBound,
        $lt: upperBound
      },
      'player.mentioned.id': { $ne: player.mentioned.id }  
    })

  if(players.length > 0) {
      return getRandomizedValueFromArray(players)
    }
  }
  const randomPlayers = await StatsModel.find({
    'player.mentioned.id': { $ne: player.mentioned.id },
  })
  return getRandomizedValueFromArray(randomPlayers)
};

StatsController.getLeaderboards = async () => {
  const leaderboards = await StatsModel.find({}).sort({percentage: -1}).limit(10)
  return leaderboards
};


export default StatsController