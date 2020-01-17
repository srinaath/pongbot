/* eslint-disable no-case-declarations */
import { TurnContext, MessageFactory, TeamsActivityHandler, TeamsInfo } from 'botbuilder'
import get from 'lodash.get'
import lowercase from 'lodash.lowercase'
import trim from 'lodash.trim'
import { getPredictionsFromLuis } from '../src/luisConnect'
import { parsedEntities } from '../src/helpers/parseEntities'
import botActions from '../src/botActions'

export class PongConversationBot extends TeamsActivityHandler {
  constructor() {
    super();
    this.members = []

    this.onMessage(async (context, next) => {
      this.members = await TeamsInfo.getMembers(context);
      
      TurnContext.removeRecipientMention(context.activity);
      TurnContext.removeMentionText(context.activity)
      const {
        utterance,
        trimmedEntities
      } = parsedEntities(context.activity)

      let replyActivity
      switch (lowercase(trim(get(context, 'activity.text', '')))) {
        case 'help':
         replyActivity = MessageFactory.text('1. Record games by using this sample utterance "@pongbot i beat @player by 3 sets to 1" \r2. "Show leaderboard" to view the top 10 ranked players\r3. "Suggest me someone to play" to find an equal matchup for and setup a match with them.');
          await context.sendActivity(replyActivity);
          break;
      
        default:
          const predictions = await getPredictionsFromLuis(utterance)
          const actions = botActions(predictions, trimmedEntities, this.members)
          const result = await actions.handleBotActions();
          
          replyActivity = MessageFactory.text(result.text);
          if(result.attachments) {
            replyActivity.attachments = result.attachments
          }
          replyActivity.entities = result.entities;
          await context.sendActivity(replyActivity);
          break;
      }
      await next();
    });
  }
}

