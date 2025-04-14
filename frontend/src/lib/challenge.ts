export interface Challenge {
  word: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export const DOODLE_CHALLENGES: Challenge[] = [
  // Easy challenges
  { word: 'house', difficulty: 'EASY' },
  { word: 'tree', difficulty: 'EASY' },
  { word: 'flower', difficulty: 'EASY' },
  { word: 'sun', difficulty: 'EASY' },
  { word: 'apple', difficulty: 'EASY' },
  { word: 'banana', difficulty: 'EASY' },
  { word: 'cat', difficulty: 'EASY' },
  { word: 'dog', difficulty: 'EASY' },
  { word: 'fish', difficulty: 'EASY' },
  { word: 'boat', difficulty: 'EASY' },
  { word: 'hat', difficulty: 'EASY' },
  { word: 'clock', difficulty: 'EASY' },
  { word: 'cloud', difficulty: 'EASY' },
  { word: 'heart', difficulty: 'EASY' },
  { word: 'umbrella', difficulty: 'EASY' },
  { word: 'star', difficulty: 'EASY' },
  { word: 'moon', difficulty: 'EASY' },
  { word: 'ball', difficulty: 'EASY' },
  { word: 'book', difficulty: 'EASY' },
  { word: 'cup', difficulty: 'EASY' },
  { word: 'chair', difficulty: 'EASY' },
  { word: 'leaf', difficulty: 'EASY' },
  { word: 'bird', difficulty: 'EASY' },
  { word: 'door', difficulty: 'EASY' },
  { word: 'lamp', difficulty: 'EASY' },
  { word: 'ring', difficulty: 'EASY' },
  { word: 'smile', difficulty: 'EASY' },
  { word: 'spoon', difficulty: 'EASY' },
  { word: 'bread', difficulty: 'EASY' },
  { word: 'pizza', difficulty: 'EASY' },
  { word: 'candy', difficulty: 'EASY' },
  { word: 'gift', difficulty: 'EASY' },
  { word: 'key', difficulty: 'EASY' },
  { word: 'bed', difficulty: 'EASY' },
  { word: 'nail', difficulty: 'EASY' },

  // Medium challenges
  { word: 'bicycle', difficulty: 'MEDIUM' },
  { word: 'airplane', difficulty: 'MEDIUM' },
  { word: 'butterfly', difficulty: 'MEDIUM' },
  { word: 'lighthouse', difficulty: 'MEDIUM' },
  { word: 'penguin', difficulty: 'MEDIUM' },
  { word: 'rabbit', difficulty: 'MEDIUM' },
  { word: 'turtle', difficulty: 'MEDIUM' },
  { word: 'guitar', difficulty: 'MEDIUM' },
  { word: 'camera', difficulty: 'MEDIUM' },
  { word: 'windmill', difficulty: 'MEDIUM' },
  { word: 'cactus', difficulty: 'MEDIUM' },
  { word: 'rainbow', difficulty: 'MEDIUM' },
  { word: 'sailboat', difficulty: 'MEDIUM' },
  { word: 'volcano', difficulty: 'MEDIUM' },
  { word: 'train', difficulty: 'MEDIUM' },
  { word: 'dolphin', difficulty: 'MEDIUM' },
  { word: 'mountain', difficulty: 'MEDIUM' },
  { word: 'bridge', difficulty: 'MEDIUM' },
  { word: 'pineapple', difficulty: 'MEDIUM' },
  { word: 'rocket', difficulty: 'MEDIUM' },
  { word: 'snowman', difficulty: 'MEDIUM' },
  { word: 'castle', difficulty: 'MEDIUM' },
  { word: 'sushi', difficulty: 'MEDIUM' },
  { word: 'robot', difficulty: 'MEDIUM' },
  { word: 'monkey', difficulty: 'MEDIUM' },
  { word: 'crown', difficulty: 'MEDIUM' },
  { word: 'glasses', difficulty: 'MEDIUM' },
  { word: 'pirate', difficulty: 'MEDIUM' },
  { word: 'wizard', difficulty: 'MEDIUM' },
  { word: 'moustache', difficulty: 'MEDIUM' },
  { word: 'trumpet', difficulty: 'MEDIUM' },
  { word: 'carousel', difficulty: 'MEDIUM' },
  { word: 'fountain', difficulty: 'MEDIUM' },
  { word: 'scarecrow', difficulty: 'MEDIUM' },
  { word: 'television', difficulty: 'MEDIUM' },

  // Hard challenges
  { word: 'elephant', difficulty: 'HARD' },
  { word: 'giraffe', difficulty: 'HARD' },
  { word: 'castle', difficulty: 'HARD' },
  { word: 'helicopter', difficulty: 'HARD' },
  { word: 'octopus', difficulty: 'HARD' },
  { word: 'mermaid', difficulty: 'HARD' },
  { word: 'unicorn', difficulty: 'HARD' },
  { word: 'dragon', difficulty: 'HARD' },
  { word: 'dinosaur', difficulty: 'HARD' },
  { word: 'scorpion', difficulty: 'HARD' },
  { word: 'crocodile', difficulty: 'HARD' },
  { word: 'peacock', difficulty: 'HARD' },
  { word: 'submarine', difficulty: 'HARD' },
  { word: 'ferriswheel', difficulty: 'HARD' },
  { word: 'rollercoaster', difficulty: 'HARD' },
  { word: 'spaceship', difficulty: 'HARD' },
  { word: 'centaur', difficulty: 'HARD' },
  { word: 'mermaid', difficulty: 'HARD' },
  { word: 'phoenix', difficulty: 'HARD' },
  { word: 'werewolf', difficulty: 'HARD' },
  { word: 'skyscraper', difficulty: 'HARD' },
  { word: 'windmill', difficulty: 'HARD' },
  { word: 'lighthouse', difficulty: 'HARD' },
  { word: 'waterfall', difficulty: 'HARD' },
  { word: 'astronaut', difficulty: 'HARD' },
  { word: 'orchestra', difficulty: 'HARD' },
  { word: 'firefighter', difficulty: 'HARD' },
  { word: 'caterpillar', difficulty: 'HARD' },
  { word: 'dragonfly', difficulty: 'HARD' },
  { word: 'chameleon', difficulty: 'HARD' },
  { word: 'jellyfish', difficulty: 'HARD' },
  { word: 'carousel', difficulty: 'HARD' },
  { word: 'kangaroo', difficulty: 'HARD' },
  { word: 'porcupine', difficulty: 'HARD' },
  { word: 'stegosaurus', difficulty: 'HARD' },
];

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export const getRandomChallenge = (): Challenge => {
  return DOODLE_CHALLENGES[Math.floor(Math.random() * DOODLE_CHALLENGES.length)];
};

export const generateGameChallenges = (): Challenge[] => {
  const easy = DOODLE_CHALLENGES.filter(c => c.difficulty === 'EASY');
  const medium = DOODLE_CHALLENGES.filter(c => c.difficulty === 'MEDIUM');
  const hard = DOODLE_CHALLENGES.filter(c => c.difficulty === 'HARD');

  // Get 5 random challenges from each difficulty
  const getRandomItems = (arr: Challenge[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const selectedChallenges = [
    ...getRandomItems(easy, 5),
    ...getRandomItems(medium, 5),
    ...getRandomItems(hard, 5)
  ];

  // Shuffle the combined array
  return selectedChallenges.sort(() => 0.5 - Math.random());
};