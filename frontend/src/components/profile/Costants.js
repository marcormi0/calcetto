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
    criteria: (playerStats) => playerStats.wins > 0,
    description: "Win 1 game to unlock",
  },
  {
    name: "mous2",
    src: "/accessories/mous2.png",
    category: "moustache",
    criteria: (playerStats) => playerStats.wins > 4,
    description: "Win 5 games to unlock",
  },
  {
    name: "mous3",
    src: "/accessories/mous3.png",
    category: "moustache",
    criteria: (playerStats) => playerStats.wins > 9,
    description: "Win 10 games to unlock",
  },
  /* {
    name: "mous5",
    src: "/accessories/mous5.png",
    category: "moustache",
    criteria: (playerStats) => playerStats.wins > playerStats.losses,
    description: "Have more wins than losses",
  }, */
  {
    name: "Sunglasses1",
    src: "/accessories/sung1.png",
    category: "eyewear",
    criteria: (playerStats) => playerStats.goals > 9,
    description: "Score 10 goals to unlock",
  },
  {
    name: "Sunglasses2",
    src: "/accessories/sung2.png",
    category: "eyewear",
    criteria: (playerStats) => playerStats.goals > 19,
    description: "Score 20 goals to unlock",
  },
  {
    name: "Sūpā Sutā Sangurasezu",
    src: "/accessories/sung3.png",
    category: "eyewear",
    criteria: (playerStats) => playerStats.goals > 29,
    description: "Score 30 goals to unlock",
  },
  {
    name: "Necktie",
    src: "/accessories/neckt.png",
    category: "neck",
    criteria: (playerStats) => playerStats.assists > 9,
    description: "Make 10 assists to unlock",
  },
  {
    name: "Bowtie",
    src: "/accessories/bowtie.png",
    category: "neck",
    criteria: (playerStats) => playerStats.assists > 19,
    description: "Make 20 assists to unlock",
  },
  {
    name: "BroChain",
    src: "/accessories/bro.png",
    category: "neck",
    criteria: (playerStats) => playerStats.assists > 29,
    description: "Make 30 assists to unlock",
  },
  {
    name: "mouth3",
    src: "/accessories/mouth3.png",
    category: "moustache",
    criteria: (playerStats) => playerStats.goals > 4 && playerStats.assists > 4,
    description: "Score 5 goals and make 5 assists to unlock",
  },
  {
    name: "mouth2",
    src: "/accessories/mouth2.png",
    category: "moustache",
    criteria: (playerStats) =>
      playerStats.goals > 14 && playerStats.assists > 14,
    description: "Score 15 goals and make 15 assists to unlock",
  },
  {
    name: "mouth1",
    src: "/accessories/mouth1.png",
    category: "moustache",
    criteria: (playerStats) =>
      playerStats.goals > 29 && playerStats.assists > 29,
    description: "Score 30 goals and make 30 assists to unlock",
  },
  /* {
    name: "Hat",
    src: "/accessories/hat.png",
    category: "headwear",
    criteria: () => new Date().getMonth() === 11, // true in December
    description: "Only available in December",
  }, */
  /* {
    name: "Straw Hat",
    src: "/accessories/strawhat.png",
    category: "headwear",
    criteria: () => false,
    description: "",
  }, */
  {
    name: "mous4",
    src: "/accessories/mous4.png",
    category: "moustache",
    criteria: (playerStats) => playerStats.goals > 6000000,
    description: "Score 6 million goals to unlock",
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
