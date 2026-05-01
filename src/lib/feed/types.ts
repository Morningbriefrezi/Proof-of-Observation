export type ReactionType = 'stars' | 'moon' | 'comet' | 'galaxy' | 'supernova' | 'telescope'

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
  stars: '✦',
  moon: '🌙',
  comet: '☄',
  galaxy: '🌌',
  supernova: '💫',
  telescope: '🔭',
}

export const REACTION_LABEL: Record<ReactionType, string> = {
  stars: 'Stars',
  moon: 'Moon',
  comet: 'Comet',
  galaxy: 'Galaxy',
  supernova: 'Supernova',
  telescope: 'Telescope',
}

export const REACTION_GRADIENT: Record<ReactionType, string> = {
  stars: 'linear-gradient(135deg, #FFD166, #F472B6)',
  moon: 'linear-gradient(135deg, #F4EDE0, #c89a3e)',
  comet: 'linear-gradient(135deg, #38F0FF, #8465CB)',
  galaxy: 'linear-gradient(135deg, #8465CB, #38F0FF)',
  supernova: 'linear-gradient(135deg, #F472B6, #38F0FF)',
  telescope: 'linear-gradient(135deg, #34D399, #38F0FF)',
}

export const REACTION_PICK_BG: Record<ReactionType, string> = {
  stars: 'radial-gradient(circle, rgba(255,209,102,0.3), transparent 70%)',
  moon: 'radial-gradient(circle, rgba(232,230,227,0.25), transparent 70%)',
  comet: 'radial-gradient(circle, rgba(56,240,255,0.3), transparent 70%)',
  galaxy: 'radial-gradient(circle, rgba(132,101,203,0.3), transparent 70%)',
  supernova: 'radial-gradient(circle, rgba(244,114,182,0.3), transparent 70%)',
  telescope: 'radial-gradient(circle, rgba(52,211,153,0.3), transparent 70%)',
}
