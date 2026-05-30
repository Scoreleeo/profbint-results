import { prisma } from "@/lib/prisma";

import type {
  LatestResult,
  LeagueStat,
  ResultStatus,
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
  note: string;
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

const FALLBACK_SEASON = "2025/26";

export async function getResultsDashboardData(
  requestedSeason?: string,
): Promise<ResultsDashboardData> {
  try {
    const seasonRows = await prisma.predictionHistory.findMany({
      select: {
        season: true,
      },
      distinct: ["season"],
      orderBy: {
        season: "desc",
      },
    });

    const seasons = seasonRows.map((item) => item.season).filter(Boolean);

    const selectedSeason =
      requestedSeason && seasons.includes(requestedSeason)
        ? requestedSeason
        : seasons[0] ?? FALLBACK_SEASON;

    const rows = await prisma.predictionHistory.findMany({
      where: {
        season: selectedSeason,
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
    });

    return {
      selectedSeason,
      seasons: seasons.length > 0 ? seasons : [selectedSeason],
      summaryStats: buildSummaryStats(rows),
      leagueStats: buildLeagueStats(rows),
      latestResults: buildLatestPredictions(rows),
      strongestPick: buildStrongestPickStat(rows),
    };
  } catch (error) {
    console.error("Failed to load results dashboard data:", error);

    return getEmptyDashboardData();
  }
}

function buildSummaryStats(rows: PredictionHistoryRow[]): SummaryStat[] {
  const total = rows.length;
  const won = rows.filter((row) => normalizeResult(row.status) === "WON").length;
  const lost = rows.filter((row) => normalizeResult(row.status) === "LOST").length;
  const pending = rows.filter(
    (row) => normalizeResult(row.status) === "PENDING",
  ).length;

  const settled = won + lost;

  return [
    {
      label: "Total Predictions",
      value: String(total),
      detail: "Saved live picks",
      tone: "emerald",
    },
    {
      label: "Pending",
      value: String(pending),
      detail: "Awaiting results",
      tone: "amber",
    },
    {
      label: "Settled",
      value: String(settled),
      detail: `${won} won / ${lost} lost`,
      tone: "emerald",
    },
    {
      label: "Leagues",
      value: String(countLeagues(rows)),
      detail: "Tracked competitions",
      tone: "emerald",
    },
  ];
}

function buildLeagueStats(rows: PredictionHistoryRow[]): LeagueStat[] {
  const leagueMap = new Map<
    string,
    {
      won: number;
      lost: number;
      pending: number;
      total: number;
    }
  >();

  rows.forEach((row) => {
    const league = row.leagueName || "Unknown League";
    const result = normalizeResult(row.status);

    const current = leagueMap.get(league) ?? {
      won: 0,
      lost: 0,
      pending: 0,
      total: 0,
    };

    current.total += 1;

    if (result === "WON") {
      current.won += 1;
    }

    if (result === "LOST") {
      current.lost += 1;
    }

    if (result === "PENDING") {
      current.pending += 1;
    }

    leagueMap.set(league, current);
  });

  return Array.from(leagueMap.entries())
    .map(([league, record]) => {
      const settled = record.won + record.lost;
      const accuracy =
        settled > 0 ? Math.round((record.won / settled) * 100) : 0;

      const recordText =
        settled > 0
          ? `${record.won}W / ${record.lost}L • ${record.pending} pending`
          : `${record.total} predictions pending`;

      return {
        league,
        accuracy: settled > 0 ? `${accuracy}%` : String(record.total),
        record: recordText,
      };
    })
    .sort((a, b) => Number.parseInt(b.accuracy) - Number.parseInt(a.accuracy))
    .slice(0, 6);
}

function buildLatestPredictions(rows: PredictionHistoryRow[]): LatestResult[] {
  return rows.slice(0, 10).map((row) => {
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
  let pending = 0;

  rows.forEach((row) => {
    if (!row.strongestPick) {
      return;
    }

    const strongestResult = getStrongestPickResult(row);

    if (strongestResult === "WON") {
      won += 1;
      return;
    }

    if (strongestResult === "LOST") {
      lost += 1;
      return;
    }

    pending += 1;
  });

  const settled = won + lost;
  const accuracy = settled > 0 ? Math.round((won / settled) * 100) : 0;

  return {
    accuracy: settled > 0 ? `${accuracy}%` : String(pending),
    record: settled > 0 ? `${won}W / ${lost}L` : `${pending} pending`,
    note:
      settled > 0
        ? "Live accuracy for strongest confidence picks."
        : "Strongest pick results will calculate once matches are settled.",
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

  return normalizeResult(row.status);
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

function countLeagues(rows: PredictionHistoryRow[]): number {
  return new Set(rows.map((row) => row.leagueName || "Unknown League")).size;
}

function getEmptyDashboardData(): ResultsDashboardData {
  return {
    selectedSeason: FALLBACK_SEASON,
    seasons: [FALLBACK_SEASON],
    summaryStats: [
      {
        label: "Total Predictions",
        value: "0",
        detail: "Saved live picks",
        tone: "emerald",
      },
      {
        label: "Pending",
        value: "0",
        detail: "Awaiting results",
        tone: "amber",
      },
      {
        label: "Settled",
        value: "0",
        detail: "0 won / 0 lost",
        tone: "emerald",
      },
      {
        label: "Leagues",
        value: "0",
        detail: "Tracked competitions",
        tone: "emerald",
      },
    ],
    leagueStats: [],
    latestResults: [],
    strongestPick: {
      accuracy: "0",
      record: "0 pending",
      note: "Strongest pick results will calculate once matches are settled.",
    },
  };
}