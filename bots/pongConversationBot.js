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
         replyActivity =
          MessageFactory.text('Sample utterances for recording your games are\r- @pongbot I beat @player by 3 sets to 1\r- @pongbot @player1 thrashed me by 6:0\r - @pongbot @player3 beat @player4 beat me by 4 sets to 3.');
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

