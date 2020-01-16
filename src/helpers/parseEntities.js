// import { TextEncoder } from 'util'
// new TextEncoder().encode(activity.from.name)

export const parsedEntities = (activity) => {
  const entities = [...activity.entities]
  const mention = {
    mentioned: activity.from,
    text: `<at>${ activity.from.name }</at>`,
    type: 'mention'
  };
  entities.shift()
  let playerCt = 1
  let utterance = activity.text
  const trimmedEntities = {}
  const finalEntities = []
  entities.forEach((entity) => {
    if(entity.type === 'mention') {
      const alias = `player${playerCt}`
      trimmedEntities[alias] = {
        alias,
        text: entity.text,
        originalEntity: entity
      }
      utterance = utterance.replace(entity.text, alias)
      finalEntities.push(entity)
      playerCt++
    }
  })
  trimmedEntities['me'] = {
    originalEntity: mention,
    text: mention.text,
    alias: 'me'
  }
  trimmedEntities['i'] = {
    originalEntity: mention,
    text: mention.text,
    alias: 'i'
  }
  return {
    trimmedEntities: trimmedEntities,
    utterance: utterance.toLowerCase()
  }
}