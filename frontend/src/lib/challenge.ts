export interface Challenge {
  word: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export const DOODLE_CHALLENGES: Challenge[] = [
  // Easy challenges
  { word: 'circle', difficulty: 'EASY' },
  { word: 'square', difficulty: 'EASY' },
  { word: 'star', difficulty: 'EASY' },
  { word: 'heart', difficulty: 'EASY' },
  // Medium challenges
  { word: 'bicycle', difficulty: 'MEDIUM' },
  { word: 'cat', difficulty: 'MEDIUM' },
  { word: 'dog', difficulty: 'MEDIUM' },
  // Hard challenges
  { word: 'elephant', difficulty: 'HARD' },
  { word: 'giraffe', difficulty: 'HARD' },
  { word: 'castle', difficulty: 'HARD' },
];

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export const getRandomChallenge = (): Challenge => {
  return DOODLE_CHALLENGES[Math.floor(Math.random() * DOODLE_CHALLENGES.length)];
};