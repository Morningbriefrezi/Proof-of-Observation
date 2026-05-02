export type ReactionType = 'like' | 'love' | 'dislike' | 'wow' | 'sad'

export const REACTION_TYPES: ReactionType[] = ['like', 'love', 'dislike', 'wow', 'sad']

export type FeedPostType = 'text' | 'photo' | 'achievement'

export interface FeedComment {
  id: string
  postId: string
  authorWallet: string
  authorName: string | null
  body: string
  reactionCount: number
  createdAt: string
}

export interface FeedPost {
  id: string
  authorWallet: string
  authorName: string | null
  authorRank: string | null
  type: FeedPostType
  body: string | null
  imageUrl: string | null
  achievementTarget: string | null
  achievementDifficulty: string | null
  achievementStars: number | null
  achievementMintTx: string | null
  observationTarget: string | null
  observationLat: string | null
  observationLon: string | null
  observationBortle: number | null
  observationNftAddress: string | null
  reactionCount: number
  commentCount: number
  shareCount: number
  createdAt: string
  topReactions?: ReactionType[]
  myReaction?: ReactionType | null
  commentsPreview?: FeedComment[]
}

export const REACTION_EMOJI: Record<ReactionType, string> = {
  like: '👍',
  love: '❤️',
  dislike: '👎',
  wow: '😮',
  sad: '😢',
}

export const REACTION_LABEL: Record<ReactionType, string> = {
  like: 'Like',
  love: 'Love',
  dislike: 'Dislike',
  wow: 'Wow',
  sad: 'Sad',
}

export const REACTION_GRADIENT: Record<ReactionType, string> = {
  like: 'linear-gradient(135deg, #38BDF8, #6366F1)',
  love: 'linear-gradient(135deg, #F472B6, #EF4444)',
  dislike: 'linear-gradient(135deg, #94A3B8, #475569)',
  wow: 'linear-gradient(135deg, #FFD166, #F59E0B)',
  sad: 'linear-gradient(135deg, #60A5FA, #312E81)',
}

export const REACTION_PICK_BG: Record<ReactionType, string> = {
  like: 'radial-gradient(circle, rgba(56,189,248,0.3), transparent 70%)',
  love: 'radial-gradient(circle, rgba(244,114,182,0.3), transparent 70%)',
  dislike: 'radial-gradient(circle, rgba(148,163,184,0.3), transparent 70%)',
  wow: 'radial-gradient(circle, rgba(255,209,102,0.3), transparent 70%)',
  sad: 'radial-gradient(circle, rgba(96,165,250,0.3), transparent 70%)',
}
