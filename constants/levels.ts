export const LEVELS = [
  {
    level: 1,
    title: 'memenoob',
    minAccount: 0,
    point: 100,
    cost: 0.01,
  },
  {
    level: 2,
    title: 'memefan',
    minAccount: 10,
    point: 1000,
    cost: 0.025,
  },
  {
    level: 3,
    title: 'memeking',
    minAccount: 20,
    point: 3000,
    cost: 0.05,
  },
]

export const MAX_LEVEL = LEVELS.reduce((a, b) => (a.level > b.level ? a : b)).level
