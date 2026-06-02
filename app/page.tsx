import {
  getResultsDashboardData,
  type LeagueStat,
  type SeasonInsight,
  type SummaryStat,
} from "@/lib/results-data";

import type { ResultStatus } from "@/lib/mock-results";

type PageProps = {
  searchParams?: Promise<{
    season?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getResultsDashboardData(params?.season);

  const overallAccuracy =
    data.summaryStats.find((item) => item.label === "Overall Accuracy")?.value ??
    "0%";

  const winningPicks =
    data.summaryStats.find((item) => item.label === "Won")?.value ?? "0";

  const losingPicks =
    data.summaryStats.find((item) => item.label === "Lost")?.value ?? "0";

  const pendingPicks =
    data.summaryStats.find((item) => item.label === "Pending")?.value ?? "0";

  const settledPicks = data.seasonInsights[0]?.value ?? "0";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_24rem),radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_30rem),radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.16),transparent_36rem),linear-gradient(180deg,#071827_0%,#06111f_42%,#020617_100%)] text-white">
      <section className="mx-auto flex w-full max-w-[430px] flex-col gap-4 px-3 pb-32 pt-4 sm:max-w-7xl sm:gap-6 sm:px-8 sm:pb-16 sm:pt-6 lg:px-10">
        <header className="relative overflow-hidden rounded-[24px] border border-emerald-400/15 bg-[linear-gradient(135deg,rgba(15,38,66,0.97),rgba(7,20,36,0.98)_48%,rgba(3,7,18,0.98))] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.45)] sm:rounded-3xl sm:p-6 lg:p-7">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(16,185,129,0.22),transparent_18rem)]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-8 h-48 w-48 rounded-full bg-blue-500/14 blur-3xl" />

          <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-end">
            <div className="min-w-0">
              <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-emerald-400 sm:text-xs sm:tracking-[0.28em]">
                Pro Football Intel Results
              </p>

              <h1 className="max-w-none text-[1.72rem] font-black leading-[1.06] tracking-[-0.04em] text-white sm:text-[2.1rem] md:text-[2.35rem] lg:text-[2.55rem] xl:whitespace-nowrap">
                Prediction results dashboard.
              </h1>

              <p className="mt-2.5 max-w-3xl text-sm leading-6 text-slate-300/85 sm:mt-3 sm:text-base sm:leading-7">
                Public read-only dashboard tracking saved predictions, settled
                outcomes, league performance and verified Pro Football Intel
                accuracy.
              </p>
            </div>

            <form
              method="GET"
              className="rounded-2xl border border-emerald-400/15 bg-white/[0.07] p-3 shadow-inner shadow-white/5 backdrop-blur xl:max-w-[300px]"
            >
              <label
                htmlFor="season"
                className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-emerald-300 sm:text-xs"
              >
                Season
              </label>

              <div className="grid grid-cols-[1fr_auto] gap-2">
                <select
                  id="season"
                  name="season"
                  defaultValue={data.selectedSeason}
                  className="min-w-0 rounded-xl border border-emerald-400/20 bg-[#06111f] px-3 py-2.5 text-sm font-semibold text-white outline-none ring-0 transition focus:border-emerald-400/50"
                >
                  {data.seasons.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="rounded-xl border border-emerald-300/25 bg-emerald-400/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-emerald-200 transition hover:border-emerald-300/50 hover:bg-emerald-400/25"
                >
                  View
                </button>
              </div>

              <p className="mt-3 text-xs font-medium text-slate-400">
                Auto-updated from verified admin results
              </p>
            </form>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {data.summaryStats.map((stat) => (
            <MetricCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              detail={stat.detail}
              tone={stat.tone}
            />
          ))}
        </section>

        <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="rounded-[26px] border border-white/10 bg-[#0a1b2e]/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-3xl sm:p-6 lg:col-span-2">
            <SectionHeader
              eyebrow="League Rankings"
              title="Performance by league"
              note={data.selectedSeason}
            />

            <LeagueRankingTable leagues={data.leagueStats} />
          </div>

          <div className="relative overflow-hidden rounded-[26px] border border-emerald-400/25 bg-[linear-gradient(135deg,rgba(7,47,37,0.98),rgba(7,28,45,0.98))] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.34)] sm:rounded-3xl sm:p-6">
            <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-emerald-300/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-14 left-2 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-emerald-300 sm:text-sm sm:tracking-[0.25em]">
                Strongest Pick
              </p>

              <div className="mt-3 grid grid-cols-[1fr_auto] items-start gap-4 sm:mt-4 sm:block">
                <div>
                  <h2 className="text-[1.65rem] font-black leading-[1.08] tracking-tight sm:text-2xl">
                    Highest-confidence picks
                  </h2>

                  <p className="mt-2 max-w-[13rem] text-sm leading-6 text-slate-300 sm:mt-3 sm:max-w-none">
                    {data.strongestPick.note}
                  </p>
                </div>

                <p className="text-[2.85rem] font-black leading-none tracking-tight text-emerald-300 sm:mt-6 sm:text-5xl">
                  {data.strongestPick.accuracy}
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-[#05111d]/75 px-3.5 py-3 shadow-inner shadow-white/5 sm:mt-6 sm:p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-slate-400">Record</p>
                  <p className="text-lg font-black text-white sm:text-xl">
                    {data.strongestPick.record}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[26px] border border-white/10 bg-[#0a1b2e]/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-3xl sm:p-6">
          <SectionHeader
            eyebrow="Season Summary"
            title="Public transparency metrics"
            note="Read-only performance view"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.seasonInsights.map((insight, index) => (
              <SeasonInsightCard
                key={insight.label}
                insight={insight}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className="rounded-[26px] border border-white/10 bg-[#0a1b2e]/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-3xl sm:p-6">
          <SectionHeader
            eyebrow="Visual Analytics"
            title="Season performance graphics"
            note="Automatic result tracking"
          />

          <div className="grid gap-3 lg:grid-cols-4">
            <TrendStat
              label="Settled Picks"
              value={settledPicks}
              detail="Verified completed results"
              tone="emerald"
            />

            <TrendStat
              label="Winning Picks"
              value={winningPicks}
              detail="First-choice wins"
              tone="emerald"
            />

            <TrendStat
              label="Losing Picks"
              value={losingPicks}
              detail="First-choice losses"
              tone="red"
            />

            <TrendStat
              label="Overall Accuracy"
              value={overallAccuracy}
              detail="Current verified rate"
              tone="blue"
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-white/10 bg-[#061320]/90 p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Result Balance
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Won / Lost split
                </p>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                  style={{ width: overallAccuracy }}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <MiniGraphCard
                  label="Won"
                  value={winningPicks}
                  tone="emerald"
                />

                <MiniGraphCard label="Lost" value={losingPicks} tone="red" />
              </div>
            </div>

            <div className="rounded-2xl border border-blue-400/20 bg-blue-400/[0.08] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                Coming Season Ready
              </p>

              <p className="mt-3 text-2xl font-black text-white">
                Auto-updating dashboard
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                When the new season begins, saved and settled predictions in
                Admin will automatically feed this public results dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[26px] border border-white/10 bg-[#0a1b2e]/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-3xl sm:p-6">
          <SectionHeader
            eyebrow="Latest Results"
            title="Verified settled picks"
            note="Updated from admin results"
          />

          <div className="space-y-2.5 md:hidden">
            {data.latestResults.map((match) => (
              <article
                key={`${match.home}-${match.away}-${match.pick}-mobile`}
                className="rounded-2xl border border-white/10 bg-[#061320]/95 p-3.5 shadow-[0_10px_32px_rgba(0,0,0,0.24)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[1.03rem] font-black leading-snug text-white">
                      {match.home} vs {match.away}
                    </p>

                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                      {match.league}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <ResultPill result={match.result} />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-500">
                      Pick
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-slate-100">
                      {match.pick}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-500">
                      Result
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-100">
                      {match.score}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-[0.7rem] font-medium text-slate-600">
                  Verified after match settlement
                </p>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
            <div className="grid grid-cols-6 bg-white/[0.055] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <span>Match</span>
              <span>League</span>
              <span>Pick</span>
              <span>Result</span>
              <span>Status</span>
              <span>Verified</span>
            </div>

            {data.latestResults.map((match) => (
              <div
                key={`${match.home}-${match.away}-${match.pick}`}
                className="grid grid-cols-6 items-center gap-3 border-t border-white/10 px-5 py-5 text-sm transition hover:bg-white/[0.035]"
              >
                <div className="font-semibold">
                  {match.home} vs {match.away}
                </div>

                <div className="text-slate-400">{match.league}</div>

                <div className="text-slate-300">{match.pick}</div>

                <div className="text-slate-400">{match.score}</div>

                <div>
                  <ResultPill result={match.result} />
                </div>

                <div className="text-slate-500">Admin verified</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="rounded-[26px] border border-white/10 bg-[#061320]/80 p-4 text-center shadow-[0_18px_60px_rgba(0,0,0,0.25)] sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
            Pro Football Intel Results
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Public read-only performance reporting. Results update
            automatically from verified admin-settled predictions.
          </p>
        </footer>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: SummaryStat) {
  const config =
    tone === "emerald"
      ? {
          icon: "✓",
          border: "border-emerald-400/20",
          glow: "from-emerald-400/20",
          iconClass: "bg-emerald-400/15 text-emerald-300",
          wave: "from-emerald-400/40",
        }
      : tone === "red"
        ? {
            icon: "×",
            border: "border-red-400/20",
            glow: "from-red-400/16",
            iconClass: "bg-red-400/15 text-red-300",
            wave: "from-red-400/40",
          }
        : {
            icon: "!",
            border: "border-amber-400/20",
            glow: "from-amber-400/16",
            iconClass: "bg-amber-400/15 text-amber-300",
            wave: "from-amber-400/40",
          };

  return (
    <div
      className={`group relative overflow-hidden rounded-[22px] border ${config.border} bg-[linear-gradient(135deg,rgba(10,27,46,0.98),rgba(6,19,32,0.96))] p-3.5 shadow-[0_14px_42px_rgba(0,0,0,0.25)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/30 sm:rounded-3xl sm:p-6`}
    >
      <div
        className={`pointer-events-none absolute -bottom-8 left-0 h-14 w-full bg-gradient-to-r ${config.wave} to-transparent opacity-30 blur-2xl`}
      />

      <div className="relative flex items-start gap-3">
        <span
          className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-black sm:flex ${config.iconClass}`}
        >
          {config.icon}
        </span>

        <div>
          <div
            className={`pointer-events-none mb-3 h-1 w-10 rounded-full bg-gradient-to-r ${config.glow} to-transparent`}
          />

          <p className="text-xs font-semibold text-slate-400 sm:text-sm">
            {label}
          </p>

          <p className="mt-2 text-[2.2rem] font-black leading-none tracking-tight text-white sm:mt-4 sm:text-4xl">
            {value}
          </p>

          <p className="mt-1.5 text-xs font-medium text-slate-500 sm:mt-2 sm:text-sm">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

function LeagueRankingTable({ leagues }: { leagues: LeagueStat[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="hidden grid-cols-[0.6fr_1.5fr_0.7fr_0.7fr_0.9fr] bg-white/[0.055] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500 md:grid">
        <span>Rank</span>
        <span>League</span>
        <span>Won</span>
        <span>Lost</span>
        <span>Accuracy</span>
      </div>

      <div className="divide-y divide-white/10">
        {leagues.map((league) => (
          <div
            key={league.league}
            className="grid gap-3 bg-[#061320]/90 px-4 py-4 text-sm transition hover:bg-[#071b2d] md:grid-cols-[0.6fr_1.5fr_0.7fr_0.7fr_0.9fr] md:items-center"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-sm font-black text-emerald-300">
                #{league.rank}
              </span>

              <div className="md:hidden">
                <p className="font-black text-white">{league.league}</p>
                <p className="text-xs font-semibold text-slate-500">
                  {league.record}
                </p>
              </div>
            </div>

            <p className="hidden font-black text-white md:block">
              {league.league}
            </p>

            <p className="hidden font-bold text-emerald-300 md:block">
              {league.wins}
            </p>

            <p className="hidden font-bold text-red-300 md:block">
              {league.losses}
            </p>

            <div className="flex items-center justify-between gap-3 md:block">
              <p className="text-3xl font-black leading-none text-white md:text-xl md:text-emerald-300">
                {league.accuracy}
              </p>

              <p className="text-xs font-semibold text-slate-500 md:mt-1">
                {league.settled} settled
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeasonInsightCard({
  insight,
  index,
}: {
  insight: SeasonInsight;
  index: number;
}) {
  const tones = [
    "border-emerald-400/20 bg-emerald-400/[0.08]",
    "border-blue-400/20 bg-blue-400/[0.08]",
    "border-cyan-400/20 bg-cyan-400/[0.08]",
    "border-red-400/20 bg-red-400/[0.08]",
    "border-purple-400/20 bg-purple-400/[0.08]",
    "border-amber-400/20 bg-amber-400/[0.08]",
  ];

  return (
    <div
      className={`rounded-2xl border ${tones[index % tones.length]} p-4 shadow-[0_12px_34px_rgba(0,0,0,0.22)]`}
    >
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {insight.label}
      </p>

      <p className="mt-3 text-2xl font-black tracking-tight text-white">
        {insight.value}
      </p>

      <p className="mt-2 text-sm font-medium leading-5 text-slate-400">
        {insight.detail}
      </p>
    </div>
  );
}

function TrendStat({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "emerald" | "red" | "blue";
}) {
  const className =
    tone === "emerald"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : tone === "red"
        ? "border-red-400/20 bg-red-400/10 text-red-300"
        : "border-blue-400/20 bg-blue-400/10 text-blue-300";

  return (
    <div className={`rounded-2xl border p-4 ${className}`}>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-black">{label}</p>
      <p className="mt-1 text-xs font-medium text-slate-400">{detail}</p>
    </div>
  );
}

function MiniGraphCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "red";
}) {
  const className =
    tone === "emerald"
      ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
      : "border-red-400/20 bg-red-400/[0.08] text-red-300";

  return (
    <div className={`rounded-xl border p-3 ${className}`}>
      <p className="text-xl font-black text-white">{value}</p>
      <p className="text-xs font-black uppercase tracking-[0.16em]">
        {label}
      </p>
    </div>
  );
}

function ResultPill({ result }: { result: ResultStatus }) {
  const className =
    result === "WON"
      ? "border-emerald-400/25 bg-emerald-400/12 text-emerald-300"
      : result === "LOST"
        ? "border-red-400/25 bg-red-400/12 text-red-300"
        : "border-amber-400/25 bg-amber-400/12 text-amber-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[0.7rem] font-black tracking-wide ${className}`}
    >
      {result}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-emerald-400 sm:text-sm sm:tracking-[0.25em]">
          {eyebrow}
        </p>

        <h2 className="mt-1.5 text-[1.55rem] font-black leading-tight tracking-tight text-white sm:mt-2 sm:text-2xl">
          {title}
        </h2>
      </div>

      {note ? (
        <p className="text-xs font-medium text-slate-500 sm:text-sm">{note}</p>
      ) : null}
    </div>
  );
}