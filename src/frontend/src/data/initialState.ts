import type { GameState, Player, TeamStanding } from "../types/game";

const ALL_PLAYERS: Player[] = [
  // GKs
  {
    id: 1,
    name: "Marco Ferretti",
    position: "GK",
    rating: 62,
    price: 800,
    owned: true,
    inLineup: true,
  },
  {
    id: 2,
    name: "Luca Brambini",
    position: "GK",
    rating: 74,
    price: 2400,
    owned: false,
    inLineup: false,
  },
  {
    id: 3,
    name: "Diego Vargas",
    position: "GK",
    rating: 81,
    price: 5200,
    owned: false,
    inLineup: false,
  },
  {
    id: 4,
    name: "Rashid Okonkwo",
    position: "GK",
    rating: 88,
    price: 12000,
    owned: false,
    inLineup: false,
  },
  // DEFs
  {
    id: 5,
    name: "Tomas Novak",
    position: "DEF",
    rating: 63,
    price: 900,
    owned: true,
    inLineup: true,
  },
  {
    id: 6,
    name: "Kwame Asante",
    position: "DEF",
    rating: 67,
    price: 1400,
    owned: true,
    inLineup: true,
  },
  {
    id: 7,
    name: "Ivan Petrov",
    position: "DEF",
    rating: 70,
    price: 2000,
    owned: true,
    inLineup: true,
  },
  {
    id: 8,
    name: "Carlos Mendez",
    position: "DEF",
    rating: 72,
    price: 2600,
    owned: false,
    inLineup: false,
  },
  {
    id: 9,
    name: "Nico Rossi",
    position: "DEF",
    rating: 76,
    price: 3800,
    owned: false,
    inLineup: false,
  },
  {
    id: 10,
    name: "Fabio Dragoni",
    position: "DEF",
    rating: 80,
    price: 5800,
    owned: false,
    inLineup: false,
  },
  {
    id: 11,
    name: "Seun Adebayo",
    position: "DEF",
    rating: 84,
    price: 9000,
    owned: false,
    inLineup: false,
  },
  {
    id: 12,
    name: "Mikkel Hansen",
    position: "DEF",
    rating: 87,
    price: 13500,
    owned: false,
    inLineup: false,
  },
  {
    id: 13,
    name: "Alexei Volkov",
    position: "DEF",
    rating: 90,
    price: 19000,
    owned: false,
    inLineup: false,
  },
  // MIDs
  {
    id: 14,
    name: "Emre Demir",
    position: "MID",
    rating: 64,
    price: 1000,
    owned: true,
    inLineup: true,
  },
  {
    id: 15,
    name: "Paulo Salave",
    position: "MID",
    rating: 66,
    price: 1300,
    owned: true,
    inLineup: true,
  },
  {
    id: 16,
    name: "Nkosi Dlamini",
    position: "MID",
    rating: 69,
    price: 1800,
    owned: true,
    inLineup: true,
  },
  {
    id: 17,
    name: "Lior Ben-David",
    position: "MID",
    rating: 71,
    price: 2300,
    owned: true,
    inLineup: true,
  },
  {
    id: 18,
    name: "Sven Lindqvist",
    position: "MID",
    rating: 74,
    price: 3200,
    owned: false,
    inLineup: false,
  },
  {
    id: 19,
    name: "Matteo Conti",
    position: "MID",
    rating: 77,
    price: 4500,
    owned: false,
    inLineup: false,
  },
  {
    id: 20,
    name: "Rafa Castillo",
    position: "MID",
    rating: 80,
    price: 6200,
    owned: false,
    inLineup: false,
  },
  {
    id: 21,
    name: "Jerome Dumont",
    position: "MID",
    rating: 83,
    price: 8800,
    owned: false,
    inLineup: false,
  },
  {
    id: 22,
    name: "Takumi Inoue",
    position: "MID",
    rating: 86,
    price: 12500,
    owned: false,
    inLineup: false,
  },
  {
    id: 23,
    name: "Andrei Popescu",
    position: "MID",
    rating: 89,
    price: 17000,
    owned: false,
    inLineup: false,
  },
  {
    id: 24,
    name: "Jules Moreau",
    position: "MID",
    rating: 92,
    price: 28000,
    owned: false,
    inLineup: false,
  },
  // FWDs
  {
    id: 25,
    name: "Obinna Chukwu",
    position: "FWD",
    rating: 65,
    price: 1200,
    owned: true,
    inLineup: true,
  },
  {
    id: 26,
    name: "Viktor Sabo",
    position: "FWD",
    rating: 68,
    price: 1700,
    owned: true,
    inLineup: true,
  },
  {
    id: 27,
    name: "Santiago Cruz",
    position: "FWD",
    rating: 73,
    price: 2800,
    owned: false,
    inLineup: false,
  },
  {
    id: 28,
    name: "Mirko Blazic",
    position: "FWD",
    rating: 78,
    price: 4800,
    owned: false,
    inLineup: false,
  },
  {
    id: 29,
    name: "Thierry Kone",
    position: "FWD",
    rating: 83,
    price: 9500,
    owned: false,
    inLineup: false,
  },
  {
    id: 30,
    name: "Adriano Fonseca",
    position: "FWD",
    rating: 88,
    price: 16000,
    owned: false,
    inLineup: false,
  },
  {
    id: 31,
    name: "Zlatan Marko",
    position: "FWD",
    rating: 95,
    price: 42000,
    owned: false,
    inLineup: false,
  },
];

const AI_TEAMS = [
  "Ironclad FC",
  "Golden Eagles",
  "Stormbolt United",
  "Red Horizon",
  "Vortex City",
  "Nova Rangers",
  "Titan Athletic",
  "Phantom FC",
];

function generateAIStandings(): TeamStanding[] {
  const standings: TeamStanding[] = AI_TEAMS.map((name) => {
    const played = 10 + Math.floor(Math.random() * 6);
    const won = Math.floor(Math.random() * (played * 0.7));
    const remaining = played - won;
    const drawn = Math.floor(Math.random() * (remaining * 0.5));
    const lost = remaining - drawn;
    const gf =
      won * (2 + Math.floor(Math.random() * 2)) +
      drawn * 1 +
      Math.floor(Math.random() * 5);
    const ga =
      lost * (1 + Math.floor(Math.random() * 2)) +
      drawn * 1 +
      Math.floor(Math.random() * 5);
    return {
      name,
      played,
      won,
      drawn,
      lost,
      gf,
      ga,
      points: won * 3 + drawn,
      isUser: false,
    };
  });

  // User team starts mid-table
  const userTeam: TeamStanding = {
    name: "FC Strike",
    played: 12,
    won: 4,
    drawn: 3,
    lost: 5,
    gf: 14,
    ga: 16,
    points: 15,
    isUser: true,
  };

  return [...standings, userTeam].sort((a, b) => b.points - a.points);
}

export function createInitialState(): GameState {
  return {
    teamName: "FC Strike",
    coins: 5000,
    stadiumLevel: 1,
    players: ALL_PLAYERS,
    matchHistory: [],
    standings: generateAIStandings(),
  };
}

export const AI_TEAM_NAMES = AI_TEAMS;
