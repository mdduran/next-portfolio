import type { Project } from 'types/types';

const projects: Project[] = [
  {
    title: 'Games',
    projectType: 'game'
  },
  {
    title: "Laika's Journey",
    projectType: 'game',
    yearDeveloped: 2019,
    platform: 'Android',
    genre: 'Puzzle',
    accomplishments: 'First independent game released on the Google Play Store, uses Unreal Engine 4',
    splashImage: '',
    description: 'A 3D puzzle game where you play as Laika, a dog sent into space on a mission to explore the galaxy. The objective is to jump from planet to planet and explore the unique dangers that are found in Outer Space.',
    website: 'https://laika-62929912.web.app/',
    downloadLink: 'https://play.google.com/store/apps/details?id=com.NightApparatus.Laika&hl=en_US&gl=US'
  },
  {
    title: 'Osmorrow',
    projectType: 'game',
    yearDeveloped: 2017,
    platform: 'Windows, Linux',
    genre: 'Action, Adventure, Indie, RPG',
    accomplishments: 'First independent game released on Steam',
    splashImage: 'osmorrow.png',
    website: 'https://osmorrow.net',
    shortDescription: 'A fast paced adventure game that challenges you to use high skilled melee and ranged combat to save Osmorrow from the Ogre clan threat.',
    description: 'An adventure set on the planet of Osmorrow, where the Ogre clan has run rampant. Your mission is to help restore peace and order to this world as you liberate Osmorrow from the Ogre oppression. Use high skilled melee and ranged combat along with swift and precise movement to quell the Ogre threat.'
  },
  {
    title: 'Step Symphony',
    projectType: 'game',
    yearDeveloped: 2016,
    platform: 'Android',
    genre: 'Location Based Rhythm',
    accomplishments:
      'Created using the Unity game engine for the front end and used a Django backend to store game information using a relational database.',
    splashImage: 'step_symphony.png',
    shortDescription: 'Step Symphony is a location-based mobile game in which players can search for run-away creatures throughout Central Kyoto.',
    description:
      `
       These creatures, known as kyokubou, are colorful animals in Japanese attire that play instruments.
       In order to find and catch these kyokubou, players must utilize panning directional music as well as their phone's camera to locate them.
       When the player finds the kyokubou, they are then prompted to capture the kyokubou by playing a rhythm game.`
  },
  {
    title: 'Rock Lives',
    yearDeveloped: 2015,
    projectType: 'game',
    platform: 'Windows',
    genre: 'Rouge-like, Role Playing Game',
    accomplishments:
      'This game was a group project for the final assignment in IMGD 3000 "Technical Game Development 1" course taught at WPI. This game was developed in a custom game engine called the Dragonfly. This version of the engine has sounds and procedural generation. I created the music and sound effects in the game. I also wrote the pathfinding aspect, monster stats and classes, as well as item stats and classes.',
    splashImage: 'rock-lives.png',
    description:
      `Rock Lives is a survival game in which the player must defeat a horde of monsters while traveling through a rocky pass.
       The world is made of an array of monsters, items, and environment tiles.
       The goal of this game is to survive as long as possible until the player is defeated in battle by one of the monsters or starves to death.
       Along the way, the player will be able to explore to find new weapons, armor and food to keep yourself alive.`,
    trailer: 'https://youtube.com/embed/y741xuc-Ndc'
  },
  {
    title: 'Sixes Wild',
    projectType: 'game',
    yearDeveloped: 2015,
    platform: 'Windows, Mac OS, and Linux',
    genre: 'Puzzle Game',
    accomplishments: 'This game was a group project for the CS 3733 "Software Engineering" course taught at WPI.',
    splashImage: 'sixes-wild.png',
    description:
      `This project consists of a playable game called Sixes Wild, and an accompanying Sixes Wild Level Builder.
       The goal of Sixes Wild is to create selections of tiles that add to a sum of six (6).
       Tiles have number values that represent how much they contribute towards a sum of six during a move,
       as well as a multiplier to increase the move's score.
       The level builder is used to create playable levels with tiles that can be added into the game.`
  },
  {
    title: 'American Toad',
    projectType: 'game',
    yearDeveloped: 2015,
    platform: 'Multi-platform',
    genre: 'Solitaire Card Game',
    accomplishments:
      'This game was an individual assignment for the CS 3733 "Software Engineering" course taught at WPI. The exercise required students to design a game with specific rules using a given framework of code in Java. ',
    splashImage: 'american-toad.png',
    description:
      'American Toad is a solitaire game using two decks of playing cards.This game is similar to Canfield except that the Tableau builds down in suit, and a partial Tableau Stack cannot be moved (only the top card or entire stack can be moved). The object of the game is to move all cards to the Foundations.',
    downloadLink: '#'
  },
  {
    title: 'Software',
    projectType: 'software'
  },
  {
    title: 'spicy-nan-facts',
    projectType: 'software',
    yearDeveloped: 2017,
    accomplishments: '',
    splashImage: '',
    description: '',
    downloadLink: 'https://github.com/mdduran/spicy-nan-facts'
  },
  {
    title: 'Somaria',
    projectType: 'software',
    yearDeveloped: 2018,
    accomplishments: 'First contribution to an open source project.',
    // splashImage: '',
    description: 'Somaria draws shapes in WebGL based on a JSON object describing how data influences those shapes. This data is composed of "blocks" which interconnect so that data flows through calculations and into shapes.',
    downloadLink: '#',
    website: 'https://github.com/pegasystems/somaria'
  },
  {
    title: 'Audio Visualizer',
    projectType: 'software',
    yearDeveloped: 2017,
    accomplishments: '',
    // splashImage: "",
    description: 'Animated arbitrary models using spectrum data from a music player. Software was written in C++ and used the OpenGL programmable rendering pipeline. SFML was used for window creation and input. GLM was used for linear algebra classes. FMOD was used for playing music and calculating the real time sound spectrum.',
    trailer: 'https://youtube.com/embed/inPkhC5sN3Q'
  },
  {
    title: 'Aquarium in OpenGL',
    projectType: 'software',
    yearDeveloped: 2017,
    accomplishments: '',
    // splashImage: "",
    description:
      'An aquarium with three different types of fish that separated into schools based on color. When the fish collide with one another, depending on which fish collides, will change the color of the fish. The fish are animated with a technique called behavioral animation where the fish are considered boids. The fish have their own respective flocks, or schools (since we are talking about fish) and move together using characteristics such as cohesion, separation and alignment.',
    trailer: 'https://youtube.com/embed/t-_ZESSl280'
  }
];

export default projects;
