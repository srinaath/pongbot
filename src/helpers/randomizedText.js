const suggestPlayerMessaging = [
  `I bet a game with <at>player<at> will be a tight context`,
  `Something tells me a game with <at>player<at> will be an absolute cracker`,
  `Alright <at>player<at>, are you up for the challenge?`
]

const closeWinMessage = [
  `What a nail biter of a contest. Great win <at>winner</at>. Kudos to you too <at>loser</at>.`,
  `Great game from both of you. One more win under your belt <at>winner</at>!!. Better luck next time <at>loser</at>.`
]

const bigWinMessage = [
  `What a game <at>winner</at>. You absolute crushed it. Better luck next time <at>loser</at>.`,
  `That was a no contest. You absolutely crushed it <at>winner</at>. Better luck next time <at>loser</at>.`
]


export const getRandomizedValueFromArray = (arr) => {
  if(arr.length > 0) {
    return arr[Math.floor(Math.random() * arr.length)];    
  }
  return undefined
}

export const suggestPlayerSuccessMsg = (player) => {
  const randomizedResult = getRandomizedValueFromArray(suggestPlayerMessaging)
  return randomizedResult.replace('<at>player<at>', player.text)
}

export const suggestPlayerWinMessage = (winner, loser, winnerSet, loserSet) => {
  let msg = getRandomizedValueFromArray(closeWinMessage)
  if(winnerSet - loserSet >= 3) {
    msg = getRandomizedValueFromArray(bigWinMessage)
  }
  return msg.replace('<at>winner</at>', winner).replace('<at>loser</at>', loser)
}
