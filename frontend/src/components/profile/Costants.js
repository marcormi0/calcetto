export const avatarOptions = [
  "/avatars/default-avatar.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
];

export const accessoryOptions = [
  {
    name: "mous1",
    src: "/accessories/mous1.png",
    category: "moustache",
    criteria: (playerStats) => playerStats.goals > 1,
    description: "Score 1 goal to unlock",
  },
  {
    name: "mous2",
    src: "/accessories/mous2.png",
    category: "moustache",
    criteria: (playerStats) => playerStats.goals > 2,
    description: "Score 3 goals to unlock",
  },
  {
    name: "mous3",
    src: "/accessories/mous3.png",
    category: "moustache",
    criteria: (playerStats) => playerStats.goals > 4,
    description: "Score 5 goals to unlock",
  },
  {
    name: "mous4",
    src: "/accessories/mous4.png",
    category: "moustache",
    criteria: (playerStats) => playerStats.goals > 6000000,
    description: "Score 6 million goals to unlock",
  },
  {
    name: "mous4",
    src: "/accessories/mous5.png",
    category: "moustache",
    criteria: (playerStats) => playerStats.wins > playerStats.losses,
    description: "Have more wins than losses",
  },
  {
    name: "Glasses",
    src: "/accessories/glasses.png",
    category: "eyewear",
    criteria: (playerStats) => playerStats.goals > 19,
    description: "Score 20 goals to unlock",
  },
  {
    name: "Bowtie",
    src: "/accessories/bowtie.png",
    category: "neck",
    criteria: (playerStats) => playerStats.assists > 19,
    description: "Make 20 assists to unlock",
  },
  {
    name: "Hat",
    src: "/accessories/hat.png",
    category: "headwear",
    criteria: () => new Date().getMonth() === 11, // true in December
    description: "Only available in December",
  },
  {
    name: "Straw Hat",
    src: "/accessories/strawhat.png",
    category: "headwear",
    criteria: () => false,
    description: "",
  },
];

export const flagOptions = [
  {
    name: "Italy",
    src: "/flags/it.png",
    criteria: (playerStats) => playerStats.matchesPlayed > 0,
    description: "Italy Flag",
  },
  {
    name: "United Kingdom",
    src: "/flags/uk.png",
    criteria: (playerStats) => playerStats.matchesPlayed > 3,
    description: "Play 3 matches to unlock",
  },
  {
    name: "France",
    src: "/flags/fr.png",
    criteria: (playerStats) => playerStats.matchesPlayed > 3,
    description: "Play 3 matches to unlock",
  },
  {
    name: "Germany",
    src: "/flags/de.png",
    criteria: (playerStats) => playerStats.matchesPlayed > 3,
    description: "Play 3 matches to unlock",
  },
  {
    name: "Spain",
    src: "/flags/es.png",
    criteria: (playerStats) => playerStats.matchesPlayed > 3,
    description: "Play 3 matches to unlock",
  },
  // Add more flags as needed
];
