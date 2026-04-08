export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Hard' | 'Expert';
export type ObsType = 'naked_eye' | 'telescope';
export type MissionState = 'idle' | 'observing' | 'camera' | 'review' | 'verifying' | 'verified' | 'minting' | 'done';

export interface Mission {
  id: string;
  name: string;
  emoji: string;
  difficulty: Difficulty;
  stars: number;
  type: ObsType;
  desc: string;
  hint: string;
  context?: string; // Scriptonia context tag
}

export interface SkyVerification {
  verified: boolean;
  cloudCover: number;
  visibility: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  conditions: string;
  humidity: number;
  temperature: number;
  windSpeed: number;
  oracleHash: string;
  verifiedAt: string;
}

export interface CompletedMission {
  id: string;
  name: string;
  emoji: string;
  stars: number;
  txId: string;
  photo: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  sky: SkyVerification | null;
  status: 'completed' | 'pending';
  method?: 'onchain' | 'simulated';
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  stars: number;
  timestamp: string;
}

export interface AppState {
  walletConnected: boolean;
  walletAddress: string;
  membershipMinted: boolean;
  membershipTx: string;
  telescope: { brand: string; model: string; aperture: string } | null;
  telescopeTx: string;
  completedMissions: CompletedMission[];
  claimedRewards: string[];
  completedQuizzes: QuizResult[];
}
