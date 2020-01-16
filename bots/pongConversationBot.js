import { TurnContext, MessageFactory, TeamsActivityHandler, TeamsInfo } from 'botbuilder'
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
      const predictions = await getPredictionsFromLuis(utterance)
      const actions = botActions(predictions, trimmedEntities, this.members)
      const result = await actions.handleBotActions();
      
      const replyActivity = MessageFactory.text(result.text);
      if(result.attachments) {
        replyActivity.attachments = result.attachments
      }
      replyActivity.entities = result.entities;
      await context.sendActivity(replyActivity);
      await next();
    });
  }
}

