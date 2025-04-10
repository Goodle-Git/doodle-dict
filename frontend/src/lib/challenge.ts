export const DOODLE_CHALLENGES = {
  EASY: [
    'circle', 'square', 'star', 'heart', 'sun', 'moon', 'cloud',
    'flower', 'tree', 'house', 'cup', 'hat', 'book', 'chair',
    // Add more easy challenges here
  ],
  MEDIUM: [
    'bicycle', 'cat', 'dog', 'bird', 'fish', 'car', 'boat',
    'airplane', 'clock', 'glasses', 'camera', 'phone',
    // Add more medium challenges here
  ],
  HARD: [
    'elephant', 'giraffe', 'kangaroo', 'helicopter', 'motorcycle',
    'submarine', 'castle', 'dragon', 'robot', 'spaceship',
    // Add more hard challenges here
  ]
};

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';