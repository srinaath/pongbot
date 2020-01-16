/* eslint-disable no-case-declarations */
import cloneDeep from 'lodash.clonedeep'
import { CardFactory } from 'botbuilder'
const MeetingCard = require('../src/cardTemplates/meetingCard.json') 
import GameOperations from './mongoose/controllers/GameController'
import StatsOperations from './mongoose/controllers/StatsController'
import { suggestPlayerSuccessMsg, suggestPlayerWinMessage } from './helpers/randomizedText'

const intents = {
  updateScores: 'UPDATE_SCORES',
  suggestPlayer: 'PLAYER_SUGGEST',
  showStats: 'SHOW_STATS',
  help: 'HELP'
}

export default (luisResponse, entityMappers, members) => {
  const handleIncompleteRequests = () => {
    return {
      text: `Gosh. Thats a bit embarassing. I'm having a problem tracking now. Please try again later.`,
      entities: []
    } 
  }
  
  const handleUpdateScoreIntent = async (intentResponse) => {
    const parsedWinnerEntity = intentResponse.entityPredictions.find(entity => entity.entityName === 'winner')
    const parsedLoserEntity = intentResponse.entityPredictions.find(entity => entity.entityName === 'loser')
    const parsedWinnerScore = intentResponse.entityPredictions.find(entity => entity.entityName === 'winnerSet')
    const parsedLoserScore = intentResponse.entityPredictions.find(entity => entity.entityName === 'loserSet')
    if(parsedWinnerEntity && parsedLoserEntity && parsedWinnerScore && parsedLoserScore) {
      const winnerEntity = entityMappers[parsedWinnerEntity.phrase]
      const loserEntity = entityMappers[parsedLoserEntity.phrase]
      const winnerScore = parseInt(parsedWinnerScore.phrase, 10)
      const loserScore = parseInt(parsedLoserScore.phrase, 10)
      await GameOperations.saveGame(winnerEntity.originalEntity, loserEntity.originalEntity, winnerScore, loserScore)
      return {
        text: suggestPlayerWinMessage(winnerEntity.text, loserEntity.text, winnerScore, loserScore),
        entities: [winnerEntity.originalEntity, loserEntity.originalEntity]
      }
    }
    return handleIncompleteRequests()
  }

  const handlePlayerSuggest = async () => {
    const player = entityMappers['i'].originalEntity
    const foundPlayer = await StatsOperations.getPlayersOfSameCaliber(player, 10)
    if(!foundPlayer) {
      return {
        text: `Gosh. Thats a bit embarassing. I couldnt find a player to suggest for you. But, keep tracking more games and I bet I'll find you one the next time.`,
        entities: []
      }
    }
    const objPlayer = foundPlayer.player.toObject()
    const clonedCard = cloneDeep(MeetingCard)
    const member = members.find((member) => member.id === objPlayer.mentioned.id) || ''
    clonedCard.actions[0].url = clonedCard.actions[0].url.replace('<attendeeAlias>', member.email)
    const adaptiveCard = CardFactory.adaptiveCard(clonedCard)
    return {
      text: suggestPlayerSuccessMsg(foundPlayer.player.toObject()),
      entities: [foundPlayer.player.toObject()],
      attachments: [adaptiveCard]
    }
  }

  const handleLeaderboard = async () => {
    const players = await StatsOperations.getLeaderboards()
    let text = ''
    const entities = []
    players.forEach((playerDb, index) => {
      const player = playerDb.player
      text += `${index+1}.${player.text} \n`
      entities.push(player.toObject())
    })
    return {
      text,
      entities
    }
  }
  
  const handleBotActions = async () => {
    if (luisResponse.intentPredictions.length > 0 && luisResponse.intentPredictions[0].score > 0.6) {
      let resp
      switch(luisResponse.intentPredictions[0].name) {
        case intents.updateScores:
          return await handleUpdateScoreIntent(luisResponse)
        case intents.suggestPlayer:
          resp = await handlePlayerSuggest()
          return resp
        case intents.showStats:
          resp = await handleLeaderboard()
          return resp
        default: 
          return handleIncompleteRequests()
      }
    }
    return undefined
  }
  return {
    handleBotActions
  }
}