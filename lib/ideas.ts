import { Vote } from '@/types/api'

export const getIdeaCount = (votes: Vote[]) => {
  let likeCount = 0
  let dislikeCount = 0

  votes.forEach(vote => {
    if (vote.isThumbUp) {
      likeCount++
    } else {
      dislikeCount++
    }
  })

  return { likeCount, dislikeCount }
}
