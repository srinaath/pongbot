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
  `You absolutely crushed it <at>winner</at>. Better luck next time <at>loser</at>.`,
  `That was a no contest.<at>winner</at> is on fire. Better luck next time <at>loser</at>.`
]

const firstGameMsg = [
  `Welcome to @pongbot for your first game!!`
]

const winStreakMsg = (winStreakCt) => {
  if(winStreakCt >= 3) {
    const msgs = [
      `You are on a ${winStreakCt} game winning streak.`,
      `You are on fire with a ${winStreakCt} game winning streak.`
    ]
    return getRandomizedValueFromArray(msgs)
  }
  return ''
}
  
export const getRandomizedValueFromArray = (arr) => {
  if(arr.length > 0) {
    return arr[Math.floor(Math.random() * arr.length)];    
  }
  return undefined
}

export const suggestPlayerSuccessMsg = (player, isFirstGame) => {
  let msg = ''
  if(isFirstGame) {
    msg +=  getRandomizedValueFromArray(firstGameMsg)
  }
  const randomizedResult = getRandomizedValueFromArray(suggestPlayerMessaging)
  msg +=randomizedResult.replace('<at>player<at>', player.text)
  return msg
}

export const suggestPlayerWinMessage = (winner, loser, winnerSet, loserSet, winStreakCt, loseStreakCt) => {
  let msg = ''
  msg += winStreakMsg(winStreakCt) + getRandomizedValueFromArray(closeWinMessage)
  if(winnerSet - loserSet >= 3) {
    msg = winStreakMsg(winStreakCt) + getRandomizedValueFromArray(bigWinMessage)
  }
  return msg.replace('<at>winner</at>', winner).replace('<at>loser</at>', loser)
}
