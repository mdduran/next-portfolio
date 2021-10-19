import type { Project } from 'types';

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
    description: '',
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
    description: ''
  },
  {
    title: 'Step Symphony',
    projectType: 'game',
    yearDeveloped: 2016,
    platform: 'Android',
    genre: 'Location Based Rhythm',
    accomplishments:
      'Created using the Unity game engine for the front end and used a Django backend to store information about kyokubo location and data using a sqllite3 database.',
    splashImage: 'step_symphony.png',
    description:
      "Step Symphony is a location-based mobile game in which players can search for run-away creatures throughout Central Kyoto. These creatures, known as kyokubou (short for kyoku no bouame, or Musical Candy), are colorful animals in Japanese attire that play instruments. In order to find and catch these kyokubou, players must utilize panning directional music as well as their phone's camera to locate them. While searching for the kyokubou, the player is accompanied by the monkey kyokubou Sarushi. When the player finds the kyokubou, they are then prompted to capture the kyokubou by playing a rhythm game. When the kyokubou has  been captured, they are added to the player's collection and their instruments can be played. You can also view a story about the relationship of each kyokubou and their location within central Kyoto."
    // downloadLink: "#"
  },
  {
    title: 'Rock Lives',
    yearDeveloped: 2015,
    projectType: 'game',
    platform: 'Windows',
    genre: 'Rougelike Role Playing Game',
    accomplishments:
      'This game was a group project for the final assignment in IMGD 3000 "Technical Game Development 1" course taught at WPI. This game was developed in a custom game engine called the Dragonfly. This version of the engine has sounds and procedural generation. I created the music and sound effects in the game. I also wrote the pathfinding aspect, monster stats and classes, as well as item stats and classes.',
    splashImage: 'rock-lives.png',
    description:
      'Rock Lives is a survival game in which the player must defeat a horde of monsters while traveling through a rocky pass. When the player initiates play of the game he is given control of his avatar which will be referred to in game as a “Wanderer” He is then be placed in the game world to explore. The game world consists of a 2D grid of ASCII Characters. The world is made of an array of monsters, items, and environment tiles. The environment has two different types of tiles, walkable and unwalkable. Unwalkable tiles are represented by mountains. The goal of this game is to survive as long as possible until the player is defeated in battle by one of the monsters or starves to death. Along the way, the player will be able to find new weapons and armor to make the wanderer stronger. There are also items that heal, feed, and increase the strength of the wanderer. After defeating a foe the Wanderer may level up increasing the base stats of the character.',
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
      "This project consists of a playable game called Sixes Wild Game, and an accompanying Sixes Wild Level Builder. The Sixes Wild Game is a tile selection based game. The goal in each level is to create selections of tiles that add to a sum of six (6). Tiles have number values that represent how much they contribute towards a sum of six during a move, as well as a multiplier to increase the move's score. The level builder is used to create playable levels with tiles that can be added into the game."
  },
  {
    title: 'American Toad',
    projectType: 'game',
    yearDeveloped: 2015,
    platform: 'Multiplatform',
    genre: 'Solitaire Card Game',
    accomplishments:
      'This game was an individual assignment for the CS 3733 "Software Engineering" course taught at WPI. The excercise required students to design a game with specific rules using a given framework of code in Java. The framework was developed by George Hieneman. Using the solitaire framework and the E(entity)B(boundary)C(control) model for software enginerring practices, I created a solitaire game that reached 85.3 percent code coverage.',
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
    downloadLink: '#'
  },
  {
    title: 'Somaria',
    projectType: 'software',
    yearDeveloped: 2017,
    accomplishments: '',
    splashImage: '',
    description: '',
    downloadLink: '#'
  },
  {
    title: 'Audio Visualizer using FMOD and OpenGL',
    projectType: 'software',
    yearDeveloped: 2017,
    accomplishments: '',
    // splashImage: "",
    description: '',
    trailer: 'https://youtube.com/embed/inPkhC5sN3Q'
  },
  {
    title: 'Aquarium in OpenGL',
    projectType: 'software',
    yearDeveloped: 2017,
    accomplishments: '',
    // splashImage: "",
    description:
      'An aquarium with three different types of fish that separated into schools based on color. When the fish collide with one another, depending on which fish collides, will change the color of the fish. The red fish will chase the blue fish, and run away from the green fish. The blue fish will chase the green fish and run away from the red fish. Finally the green fish will chase the red fish and run away from the blue fish. The fish are animated with a technique called behavioral animation where the fish are considered boids. The fish have their own respective flocks, or schools (since we are talking about fish) and move together using characteristics such as cohesion, separation and alignment.',
    trailer: 'https://youtube.com/embed/t-_ZESSl280'
  }
];

export default projects;
