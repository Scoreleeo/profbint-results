import { prisma } from "@/lib/prisma";

import type { LatestResult, ResultStatus } from "@/lib/mock-results";

export type SummaryStat = {
  label: string;
  value: string;
  detail: string;
  tone: "emerald" | "red" | "amber";
};

export type LeagueStat = {
  rank: number;
  league: string;
  accuracy: string;
  wins: number;
  losses: number;
  settled: number;
  pending: number;
  record: string;
};

export type StrongestPickStat = {
  accuracy: string;
  record: string;
  note: string;
};

export type SeasonInsight = {
  label: string;
  value: string;
  detail: string;
};

export type ResultsDashboardData = {
  selectedSeason: string;
  seasons: string[];
  summaryStats: SummaryStat[];
  leagueStats: LeagueStat[];
  latestResults: LatestResult[];
  strongestPick: StrongestPickStat;
  seasonInsights: SeasonInsight[];
};

type PredictionHistoryRow = {
  leagueName: string | null;
  season: string;
  homeTeam: string;
  awayTeam: string;
  firstChoice: string | null;
  secondChoice: string | null;
  strongestPick: string | null;
  actualResult: string | null;
  firstChoiceResult: string | null;
  secondChoiceResult: string | null;
  status: string;
  savedAt: Date;
  updatedAt: Date;
};

const CURRENT_SEASON = "2026-27";

const TRACKED_LEAGUES = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Eredivisie",
  "Primeira Liga",
];

export async function getResultsDashboardData(
  _requestedSeason?: string,
): Promise<ResultsDashboardData> {
  try {
    const rows = await prisma.predictionHistory.findMany({
      where: {
        season: CURRENT_SEASON,
      },
      select: {
        leagueName: true,
        season: true,
        homeTeam: true,
        awayTeam: true,
        firstChoice: true,
        secondChoice: true,
        strongestPick: true,
        actualResult: true,
        firstChoiceResult: true,
        secondChoiceResult: true,
        status: true,
        savedAt: true,
        updatedAt: true,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
        {
          savedAt: "desc",
        },
      ],
      take: 500,
    });

    const leagueStats = buildLeagueStats(rows);
    const strongestPick = buildStrongestPickStat(rows);

    return {
      selectedSeason: CURRENT_SEASON,
      seasons: [CURRENT_SEASON],
      summaryStats: buildSummaryStats(rows),
      leagueStats,
      latestResults: buildLatestResults(rows),
      strongestPick,
      seasonInsights: buildSeasonInsights(rows, leagueStats, strongestPick),
    };
  } catch (error) {
    console.error("Failed to load results dashboard data:", error);
    return getEmptyDashboardData();
  }
}

function buildSummaryStats(rows: PredictionHistoryRow[]): SummaryStat[] {
  const completed = getCompletedRows(rows);
  const won = completed.filter((row) => row.firstChoiceResult === "WON").length;
  const lost = completed.filter((row) => row.firstChoiceResult === "LOST").length;
  const pending = rows.filter((row) => row.status === "PENDING").length;

  return [
    {
      label: "Overall Accuracy",
      value: getAccuracy(won, completed.length),
      detail: `${won} won / ${lost} lost`,
      tone: "emerald",
    },
    {
      label: "Won",
      value: String(won),
      detail: "Settled winning picks",
      tone: "emerald",
    },
    {
      label: "Lost",
      value: String(lost),
      detail: "Settled losing picks",
      tone: "red",
    },
    {
      label: "Pending",
      value: String(pending),
      detail: "Awaiting settlement",
      tone: "amber",
    },
  ];
}

function buildLeagueStats(rows: PredictionHistoryRow[]): LeagueStat[] {
  const leagueMap = new Map<
    string,
    { won: number; lost: number; pending: number; settled: number }
  >();

  TRACKED_LEAGUES.forEach((league) => {
    leagueMap.set(league, {
      won: 0,
      lost: 0,
      pending: 0,
      settled: 0,
    });
  });

  rows.forEach((row) => {
    const league = row.leagueName || "Unknown League";
    const current = leagueMap.get(league) ?? {
      won: 0,
      lost: 0,
      pending: 0,
      settled: 0,
    };

    if (isCompleted(row)) {
      current.settled += 1;

      if (row.firstChoiceResult === "WON") {
        current.won += 1;
      }

      if (row.firstChoiceResult === "LOST") {
        current.lost += 1;
      }
    } else {
      current.pending += 1;
    }

    leagueMap.set(league, current);
  });

  return Array.from(leagueMap.entries())
    .map(([league, record]) => ({
      rank: 0,
      league,
      accuracy: getAccuracy(record.won, record.settled),
      wins: record.won,
      losses: record.lost,
      settled: record.settled,
      pending: record.pending,
      record:
        record.settled > 0
          ? `${record.won}W / ${record.lost}L`
          : `${record.pending} pending`,
    }))
    .sort((a, b) => {
      const accuracyDifference =
        parseAccuracy(b.accuracy) - parseAccuracy(a.accuracy);

      if (accuracyDifference !== 0) {
        return accuracyDifference;
      }

      if (b.settled !== a.settled) {
        return b.settled - a.settled;
      }

      return (
        TRACKED_LEAGUES.indexOf(a.league) -
        TRACKED_LEAGUES.indexOf(b.league)
      );
    })
    .map((league, index) => ({
      ...league,
      rank: index + 1,
    }));
}

function buildLatestResults(rows: PredictionHistoryRow[]): LatestResult[] {
  const completedRows = getCompletedRows(rows);
  const displayRows =
    completedRows.length > 0
      ? completedRows
      : rows.filter((row) => row.status === "PENDING");

  return displayRows.slice(0, 10).map((row) => ({
    home: row.homeTeam,
    away: row.awayTeam,
    league: row.leagueName || "Unknown League",
    pick: row.firstChoice || row.strongestPick || row.secondChoice || "Pending",
    score: row.actualResult || "Pending",
    result: getDisplayResult(row),
  }));
}

function buildStrongestPickStat(rows: PredictionHistoryRow[]): StrongestPickStat {
  const completed = rows.filter(
    (row) =>
      row.status === "RESULTED" &&
      Boolean(row.actualResult) &&
      Boolean(row.strongestPick),
  );

  const wins = completed.filter(
    (row) => row.strongestPick === row.actualResult,
  ).length;

  const losses = completed.length - wins;

  return {
    accuracy: getAccuracy(wins, completed.length),
    record: `${wins}W / ${losses}L`,
    note:
      completed.length > 0
        ? "Verified accuracy for highest-confidence selections."
        : "Accuracy will calculate automatically after settled results arrive.",
  };
}

function buildSeasonInsights(
  rows: PredictionHistoryRow[],
  leagueStats: LeagueStat[],
  strongestPick: StrongestPickStat,
): SeasonInsight[] {
  const completed = getCompletedRows(rows);
  const wins = completed.filter((row) => row.firstChoiceResult === "WON").length;
  const losses = completed.filter((row) => row.firstChoiceResult === "LOST").length;
  const settledLeagues = leagueStats.filter((league) => league.settled > 0);
  const bestLeague = settledLeagues[0];

  const lowestLeague = [...settledLeagues].sort((a, b) => {
    const difference = parseAccuracy(a.accuracy) - parseAccuracy(b.accuracy);

    if (difference !== 0) {
      return difference;
    }

    return b.settled - a.settled;
  })[0];

  return [
    {
      label: "Settled Picks",
      value: String(completed.length),
      detail: "Verified completed results",
    },
    {
      label: "Win/Loss Record",
      value: `${wins}-${losses}`,
      detail: "First-choice performance",
    },
    {
      label: "Best League",
      value: bestLeague?.league ?? "Awaiting data",
      detail: bestLeague
        ? `${bestLeague.accuracy} from ${bestLeague.settled} settled`
        : "Updates automatically",
    },
    {
      label: "Lowest League",
      value: lowestLeague?.league ?? "Awaiting data",
      detail: lowestLeague
        ? `${lowestLeague.accuracy} from ${lowestLeague.settled} settled`
        : "Updates automatically",
    },
    {
      label: "Strongest Pick",
      value: strongestPick.accuracy,
      detail: strongestPick.record,
    },
    {
      label: "Tracked Leagues",
      value: String(TRACKED_LEAGUES.length),
      detail: "Competitions prepared for 2026/27",
    },
  ];
}

function getCompletedRows(rows: PredictionHistoryRow[]): PredictionHistoryRow[] {
  return rows.filter(isCompleted);
}

function isCompleted(row: PredictionHistoryRow): boolean {
  return (
    row.status === "RESULTED" &&
    Boolean(row.actualResult) &&
    Boolean(row.firstChoiceResult)
  );
}

function getDisplayResult(row: PredictionHistoryRow): ResultStatus {
  if (!isCompleted(row)) {
    return "PENDING";
  }

  if (row.firstChoiceResult === "WON") {
    return "WON";
  }

  if (row.firstChoiceResult === "LOST") {
    return "LOST";
  }

  return "PENDING";
}

function parseAccuracy(value: string): number {
  return Number.parseInt(value.replace("%", ""), 10) || 0;
}

function getAccuracy(wins: number, completed: number): string {
  if (completed === 0) {
    return "0%";
  }

  return `${Math.round((wins / completed) * 100)}%`;
}

function getEmptyDashboardData(): ResultsDashboardData {
  const leagueStats = TRACKED_LEAGUES.map((league, index) => ({
    rank: index + 1,
    league,
    accuracy: "0%",
    wins: 0,
    losses: 0,
    settled: 0,
    pending: 0,
    record: "0 pending",
  }));

  return {
    selectedSeason: CURRENT_SEASON,
    seasons: [CURRENT_SEASON],
    summaryStats: buildSummaryStats([]),
    leagueStats,
    latestResults: [],
    strongestPick: {
      accuracy: "0%",
      record: "0W / 0L",
      note: "Accuracy will calculate automatically after settled results arrive.",
    },
    seasonInsights: [
      {
        label: "Settled Picks",
        value: "0",
        detail: "Verified completed results",
      },
      {
        label: "Win/Loss Record",
        value: "0-0",
        detail: "First-choice performance",
      },
      {
        label: "Best League",
        value: "Awaiting data",
        detail: "Updates automatically",
      },
      {
        label: "Lowest League",
        value: "Awaiting data",
        detail: "Updates automatically",
      },
      {
        label: "Strongest Pick",
        value: "0%",
        detail: "0W / 0L",
      },
      {
        label: "Tracked Leagues",
        value: String(TRACKED_LEAGUES.length),
        detail: "Competitions prepared for 2026/27",
      },
    ],
  };
}