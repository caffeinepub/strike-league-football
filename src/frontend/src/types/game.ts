export type Position = "GK" | "DEF" | "MID" | "FWD";

export type Player = {
  id: number;
  name: string;
  position: Position;
  rating: number;
  price: number;
  owned: boolean;
  inLineup: boolean;
};

export type MatchResult = {
  id: number;
  opponent: string;
  goalsFor: number;
  goalsAgainst: number;
  result: "W" | "D" | "L";
  coinsEarned: number;
  date: string;
};

export type TeamStanding = {
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
  isUser: boolean;
};

export type GameState = {
  teamName: string;
  coins: number;
  stadiumLevel: number;
  players: Player[];
  matchHistory: MatchResult[];
  standings: TeamStanding[];
};

export type View =
  | "home"
  | "squad"
  | "recruit"
  | "matches"
  | "standings"
  | "game";
