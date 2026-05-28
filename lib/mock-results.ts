export type ResultStatus = "WON" | "LOST" | "PENDING";

export type LatestResult = {
  home: string;
  away: string;
  league: string;
  pick: string;
  score: string;
  result: ResultStatus;
};

export type LeagueStat = {
  league: string;
  accuracy: string;
  record: string;
};

export const latestResults: LatestResult[] = [
  {
    home: "Arsenal",
    away: "Chelsea",
    league: "Premier League",
    pick: "Arsenal Win",
    score: "2-1",
    result: "WON",
  },
  {
    home: "Barcelona",
    away: "Sevilla",
    league: "La Liga",
    pick: "Over 2.5 Goals",
    score: "3-1",
    result: "WON",
  },
  {
    home: "Inter",
    away: "Napoli",
    league: "Serie A",
    pick: "Inter Draw No Bet",
    score: "1-1",
    result: "LOST",
  },
  {
    home: "PSG",
    away: "Lyon",
    league: "Ligue 1",
    pick: "PSG Win",
    score: "Pending",
    result: "PENDING",
  },
];

export const leagueStats: LeagueStat[] = [
  { league: "Premier League", accuracy: "72%", record: "18W / 7L" },
  { league: "La Liga", accuracy: "69%", record: "11W / 5L" },
  { league: "Serie A", accuracy: "64%", record: "9W / 5L" },
  { league: "Bundesliga", accuracy: "67%", record: "8W / 4L" },
];