import { prisma } from "@/lib/prisma";

import {
  latestResults as mockLatestResults,
  leagueStats as mockLeagueStats,
  type LatestResult,
  type LeagueStat,
  type ResultStatus,
} from "@/lib/mock-results";

export type SummaryStat = {
  label: string;
  value: string;
  detail: string;
  tone: "emerald" | "red" | "amber";
};

export type StrongestPickStat = {
  accuracy: string;
  record: string;
};

export type ResultsDashboardData = {
  selectedSeason: string;
  seasons: string[];
  summaryStats: SummaryStat[];
  leagueStats: LeagueStat[];
  latestResults: LatestResult[];
  strongestPick: StrongestPickStat;
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
};

const DEFAULT_SEASON = "2025/26";

export async function getResultsDashboardData(
  season = DEFAULT_SEASON,
): Promise<ResultsDashboardData> {
  try {
    const [seasonRows, rows] = await Promise.all([
      prisma.predictionHistory.findMany({
        select: {
          season: true,
        },
        distinct: ["season"],
        orderBy: {
          season: "desc",
        },
      }),

      prisma.predictionHistory.findMany({
        where: {
          season,
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
        },
        orderBy: {
          savedAt: "desc",
        },
        take: 250,
      }),
    ]);

    const seasons = seasonRows
      .map((item) => item.season)
      .filter(Boolean);

    if (rows.length === 0) {
      return getFallbackDashboardData(seasons, season);
    }

    return {
      selectedSeason: season,
      seasons: seasons.length > 0 ? seasons : [season],
      summaryStats: buildSummaryStats(rows),
      leagueStats: buildLeagueStats(rows),
      latestResults: buildLatestResults(rows),
      strongestPick: buildStrongestPickStat(rows),
    };
  } catch (error) {
    console.error("Failed to load results dashboard data:", error);

    return getFallbackDashboardData([season], season);
  }
}

function buildSummaryStats(rows: PredictionHistoryRow[]): SummaryStat[] {
  const won = rows.filter((row) => normalizeResult(row.status) === "WON").length;
  const lost = rows.filter((row) => normalizeResult(row.status) === "LOST").length;
  const pending = rows.filter(
    (row) => normalizeResult(row.status) === "PENDING",
  ).length;

  const settled = won + lost;
  const accuracy = settled > 0 ? Math.round((won / settled) * 100) : 0;

  return [
    {
      label: "Overall Accuracy",
      value: `${accuracy}%`,
      detail: `${won} won / ${lost} lost`,
      tone: "emerald",
    },
    {
      label: "Won",
      value: String(won),
      detail: "Winning picks",
      tone: "emerald",
    },
    {
      label: "Lost",
      value: String(lost),
      detail: "Losing picks",
      tone: "red",
    },
    {
      label: "Pending",
      value: String(pending),
      detail: "Awaiting scores",
      tone: "amber",
    },
  ];
}

function buildLeagueStats(rows: PredictionHistoryRow[]): LeagueStat[] {
  const leagueMap = new Map<string, { won: number; lost: number }>();

  rows.forEach((row) => {
    const league = row.leagueName || "Unknown League";
    const result = normalizeResult(row.status);

    if (result !== "WON" && result !== "LOST") {
      return;
    }

    const current = leagueMap.get(league) ?? {
      won: 0,
      lost: 0,
    };

    if (result === "WON") {
      current.won += 1;
    }

    if (result === "LOST") {
      current.lost += 1;
    }

    leagueMap.set(league, current);
  });

  return Array.from(leagueMap.entries())
    .map(([league, record]) => {
      const settled = record.won + record.lost;
      const accuracy =
        settled > 0 ? Math.round((record.won / settled) * 100) : 0;

      return {
        league,
        accuracy: `${accuracy}%`,
        record: `${record.won}W / ${record.lost}L`,
      };
    })
    .sort((a, b) => Number.parseInt(b.accuracy) - Number.parseInt(a.accuracy))
    .slice(0, 6);
}

function buildLatestResults(rows: PredictionHistoryRow[]): LatestResult[] {
  return rows.slice(0, 8).map((row) => {
    const result = normalizeResult(row.status);
    const pick = row.firstChoice || row.strongestPick || row.secondChoice || "Pending";
    const score = row.actualResult || "Pending";

    return {
      home: row.homeTeam,
      away: row.awayTeam,
      league: row.leagueName || "Unknown League",
      pick,
      score,
      result,
    };
  });
}

function buildStrongestPickStat(rows: PredictionHistoryRow[]): StrongestPickStat {
  let won = 0;
  let lost = 0;

  rows.forEach((row) => {
    const strongestResult = getStrongestPickResult(row);

    if (strongestResult === "WON") {
      won += 1;
    }

    if (strongestResult === "LOST") {
      lost += 1;
    }
  });

  const settled = won + lost;
  const accuracy = settled > 0 ? Math.round((won / settled) * 100) : 0;

  return {
    accuracy: `${accuracy}%`,
    record: `${won}W / ${lost}L`,
  };
}

function getStrongestPickResult(row: PredictionHistoryRow): ResultStatus | null {
  const strongestPick = normalizeText(row.strongestPick);
  const firstChoice = normalizeText(row.firstChoice);
  const secondChoice = normalizeText(row.secondChoice);

  if (!strongestPick) {
    return null;
  }

  if (strongestPick === firstChoice) {
    return normalizeResult(row.firstChoiceResult);
  }

  if (strongestPick === secondChoice) {
    return normalizeResult(row.secondChoiceResult);
  }

  return null;
}

function normalizeResult(value: string | null): ResultStatus {
  const result = value?.trim().toUpperCase();

  if (result === "WON") {
    return "WON";
  }

  if (result === "LOST") {
    return "LOST";
  }

  return "PENDING";
}

function normalizeText(value: string | null): string {
  return value?.trim().toLowerCase() ?? "";
}

function getFallbackDashboardData(
  seasons: string[],
  selectedSeason: string,
): ResultsDashboardData {
  return {
    selectedSeason,
    seasons: seasons.length > 0 ? seasons : [selectedSeason],
    summaryStats: [
      {
        label: "Overall Accuracy",
        value: "68%",
        detail: "46 won / 22 lost",
        tone: "emerald",
      },
      {
        label: "Won",
        value: "46",
        detail: "Winning picks",
        tone: "emerald",
      },
      {
        label: "Lost",
        value: "22",
        detail: "Losing picks",
        tone: "red",
      },
      {
        label: "Pending",
        value: "8",
        detail: "Awaiting scores",
        tone: "amber",
      },
    ],
    leagueStats: mockLeagueStats,
    latestResults: mockLatestResults,
    strongestPick: {
      accuracy: "74%",
      record: "23W / 8L",
    },
  };
}