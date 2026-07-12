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

const footerLinks = [
  { label: "Home", href: "https://profbint.com" },
  { label: "Predictions", href: "https://predictions.profbint.com" },
  { label: "Privacy Policy", href: "https://profbint.com/privacy" },
  { label: "Terms of Service", href: "https://profbint.com/terms" },
  { label: "Refund Policy", href: "https://profbint.com/refunds" },
  {
    label: "Responsible Gambling",
    href: "https://profbint.com/responsible-gambling",
  },
  {
    label: "Legal & Disclaimer",
    href: "https://profbint.com/legal",
  },
];

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getResultsDashboardData(params?.season);

  const accuracy =
    data.summaryStats.find((item) => item.label === "Overall Accuracy")?.value ??
    "0%";

  const wins =
    data.summaryStats.find((item) => item.label === "Won")?.value ?? "0";

  const losses =
    data.summaryStats.find((item) => item.label === "Lost")?.value ?? "0";

  const settled = data.seasonInsights[0]?.value ?? "0";
  const accuracyNumber = getPercentageNumber(accuracy);
  const lossPercentage = Math.max(0, 100 - accuracyNumber);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020713] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,190,45,0.2),transparent_28rem),radial-gradient(circle_at_top_right,rgba(214,173,85,0.18),transparent_32rem),radial-gradient(circle_at_50%_55%,rgba(37,99,235,0.09),transparent_34rem),linear-gradient(180deg,#09162a_0%,#050d1a_46%,#020611_100%)]" />

      <section className="relative mx-auto flex w-full max-w-[430px] flex-col gap-4 px-3 pb-28 pt-4 sm:max-w-7xl sm:gap-6 sm:px-8 sm:pb-16 sm:pt-6 lg:px-10">
        <nav className="flex flex-wrap items-center justify-end gap-2">
          <a
            href="https://results.profbint.com"
            className="rounded-full border border-[#f0c75e]/50 bg-[#d6ad55]/20 px-4 py-2 text-xs font-black text-[#ffe39a] shadow-[0_0_20px_rgba(214,173,85,0.12)] transition hover:bg-[#d6ad55]/30"
          >
            Home
          </a>

          <a
            href="https://predictions.profbint.com"
            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-slate-300 transition hover:border-[#d6ad55]/50 hover:bg-[#d6ad55]/10 hover:text-[#ffe39a]"
          >
            Predictions
          </a>

          <a
            href="https://results.profbint.com"
            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-slate-300 transition hover:border-[#d6ad55]/50 hover:bg-[#d6ad55]/10 hover:text-[#ffe39a]"
          >
            Results
          </a>

          <a
            href="https://players.profbint.com"
            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-slate-300 transition hover:border-[#d6ad55]/50 hover:bg-[#d6ad55]/10 hover:text-[#ffe39a]"
          >
            Players
          </a>

          <a
            href="https://profbint.com"
            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-slate-300 transition hover:border-[#d6ad55]/50 hover:bg-[#d6ad55]/10 hover:text-[#ffe39a]"
          >
            Pro Football Intel
          </a>
        </nav>

        <header className="relative overflow-hidden rounded-[24px] border border-[#d6ad55]/45 bg-[linear-gradient(135deg,rgba(18,42,72,0.99),rgba(7,20,39,0.99)_54%,rgba(3,8,20,0.99))] p-4 shadow-[0_24px_85px_rgba(0,0,0,0.52),0_0_45px_rgba(214,173,85,0.08)] sm:rounded-[30px] sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,rgba(245,190,45,0.28),transparent_19rem),radial-gradient(circle_at_94%_4%,rgba(59,130,246,0.19),transparent_25rem),linear-gradient(90deg,rgba(214,173,85,0.04),transparent_42%)]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#f0c75e]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-8 h-44 w-44 rounded-full bg-[#d6ad55]/10 blur-3xl" />

          <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_290px] xl:items-end">
            <div className="min-w-0">
              <p className="mb-2 text-[0.65rem] font-black uppercase tracking-[0.27em] text-[#f5c94e] drop-shadow-[0_0_12px_rgba(245,201,78,0.22)] sm:text-xs">
                Pro Football Intel Results
              </p>

              <h1 className="text-[1.55rem] font-black leading-[1.08] tracking-[-0.035em] text-white sm:text-[2rem] md:text-[2.25rem] lg:text-[2.4rem] xl:whitespace-nowrap">
                Verified football prediction results.
              </h1>

              <p className="mt-2.5 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                Public read-only performance tracking for the 2026/27 season,
                updated automatically from settled Pro Football Intel results.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <HeroPill label="Accuracy" value={accuracy} />
                <HeroPill label="Settled" value={settled} />
                <HeroPill label="Won" value={wins} />
                <HeroPill label="Lost" value={losses} />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#f0c75e]/45 bg-[linear-gradient(145deg,rgba(214,173,85,0.16),rgba(3,10,23,0.82)_62%)] p-4 shadow-[0_0_30px_rgba(214,173,85,0.1)] backdrop-blur">
              <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#f0c75e]/15 blur-2xl" />

              <div className="relative">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-[#f5c94e]">
                  Current Season
                </p>

                <p className="mt-2 text-2xl font-black text-white">
                  {data.selectedSeason}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-300">
                  Results populate automatically as predictions are settled.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {data.summaryStats.map((stat) => (
            <MetricCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <DashboardPanel className="lg:col-span-2">
            <SectionHeader
              eyebrow="League Rankings"
              title="Performance by league"
              note={data.selectedSeason}
            />

            <LeagueRankingTable leagues={data.leagueStats} />
          </DashboardPanel>

          <StrongestPickPanel
            accuracy={data.strongestPick.accuracy}
            record={data.strongestPick.record}
            note={data.strongestPick.note}
          />
        </section>

        <DashboardPanel>
          <SectionHeader
            eyebrow="Season Summary"
            title="Public transparency metrics"
            note="Read-only performance view"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.seasonInsights.map((insight, index) => (
              <InsightCard
                key={insight.label}
                insight={insight}
                index={index}
              />
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel>
          <SectionHeader
            eyebrow="Performance Analytics"
            title="Season result balance"
            note="Automatic result tracking"
          />

          <div className="grid gap-3 lg:grid-cols-4">
            <TrendCard
              label="Settled Picks"
              value={settled}
              detail="Verified completed results"
              tone="gold"
            />
            <TrendCard
              label="Winning Picks"
              value={wins}
              detail="First-choice wins"
              tone="green"
            />
            <TrendCard
              label="Losing Picks"
              value={losses}
              detail="First-choice losses"
              tone="red"
            />
            <TrendCard
              label="Overall Accuracy"
              value={accuracy}
              detail="Current verified rate"
              tone="blue"
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-[#d6ad55]/20 bg-[#061225] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.17em] text-[#d6ad55]">
                  Won / Lost Split
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  Settled results
                </p>
              </div>

              <div className="relative h-4 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                  style={{ width: `${accuracyNumber}%` }}
                />

                <div
                  className="absolute right-0 top-0 h-full bg-gradient-to-r from-red-500/70 to-red-400"
                  style={{ width: `${lossPercentage}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs font-black">
                <span className="text-emerald-300">{accuracy} won</span>
                <span className="text-red-300">{lossPercentage}% lost</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#f0c75e]/40 bg-[linear-gradient(145deg,rgba(214,173,85,0.16),rgba(8,20,38,0.94)_65%)] p-4 shadow-[0_0_28px_rgba(214,173,85,0.08)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#f0c75e]/15 blur-2xl" />

              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f5c94e]">
                  2026/27 Ready
                </p>

                <p className="mt-2 text-xl font-black text-white">
                  Seven tracked leagues
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  New settled predictions will feed this dashboard automatically.
                </p>
              </div>
            </div>
          </div>
        </DashboardPanel>

        <DashboardPanel>
          <SectionHeader
            eyebrow="Latest Results"
            title="Verified settled picks"
            note="Updated automatically"
          />

          {data.latestResults.length === 0 ? (
            <EmptyResults />
          ) : (
            <>
              <div className="space-y-2.5 md:hidden">
                {data.latestResults.map((match) => (
                  <article
                    key={`${match.home}-${match.away}-${match.pick}-mobile`}
                    className="rounded-2xl border border-[#d6ad55]/15 bg-[#061225] p-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-black leading-snug text-white">
                          {match.home} vs {match.away}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {match.league}
                        </p>
                      </div>

                      <ResultPill result={match.result} />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-white/[0.04] bg-white/[0.04] p-3">
                      <ResultDetail label="Pick" value={match.pick} />
                      <ResultDetail label="Result" value={match.score} right />
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-2xl border border-[#d6ad55]/18 md:block">
                <div className="grid grid-cols-6 bg-[#d6ad55]/[0.08] px-5 py-3 text-xs font-black uppercase tracking-widest text-[#d6ad55]">
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
                    className="grid grid-cols-6 items-center gap-3 border-t border-white/10 bg-[#061225] px-5 py-5 text-sm transition hover:bg-[#d6ad55]/[0.045]"
                  >
                    <p className="font-semibold text-white">
                      {match.home} vs {match.away}
                    </p>
                    <p className="text-slate-400">{match.league}</p>
                    <p className="text-slate-300">{match.pick}</p>
                    <p className="text-slate-400">{match.score}</p>
                    <ResultPill result={match.result} />
                    <p className="text-slate-500">Admin verified</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </DashboardPanel>

        <footer className="rounded-[24px] border border-[#d6ad55]/30 bg-[linear-gradient(180deg,rgba(9,25,45,0.96),rgba(5,15,29,0.98))] p-5 text-center shadow-[0_0_34px_rgba(214,173,85,0.06)]">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f5c94e]">
            Pro Football Intel Results
          </p>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Public read-only reporting for verified settled predictions.
          </p>

          <nav className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-3 border-t border-[#d6ad55]/20 pt-5">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-400 transition hover:text-[#ffe39a]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </footer>
      </section>
    </main>
  );
}

function DashboardPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[24px] border border-[#d6ad55]/18 bg-[linear-gradient(155deg,rgba(11,29,50,0.96),rgba(6,17,32,0.97))] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.025)] sm:rounded-[28px] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function HeroPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-[#d6ad55]/30 bg-[#d6ad55]/[0.09] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
      <p className="text-[0.6rem] font-black uppercase tracking-[0.15em] text-[#d6ad55]">
        {label}
      </p>
      <p className="text-sm font-black text-white">{value}</p>
    </div>
  );
}

function MetricCard({ label, value, detail, tone }: SummaryStat) {
  const styles =
    tone === "emerald"
      ? "border-emerald-400/35 bg-[linear-gradient(145deg,rgba(16,185,129,0.12),rgba(5,18,27,0.94))] shadow-[0_0_24px_rgba(16,185,129,0.05)]"
      : tone === "red"
        ? "border-red-400/35 bg-[linear-gradient(145deg,rgba(239,68,68,0.11),rgba(16,11,22,0.94))] shadow-[0_0_24px_rgba(239,68,68,0.04)]"
        : "border-[#f0c75e]/45 bg-[linear-gradient(145deg,rgba(214,173,85,0.18),rgba(10,18,30,0.95))] shadow-[0_0_28px_rgba(214,173,85,0.07)]";

  return (
    <article
      className={`rounded-[22px] border p-3.5 sm:p-5 ${styles}`}
    >
      <p className="text-xs font-bold text-slate-300 sm:text-sm">{label}</p>
      <p className="mt-2 text-[2rem] font-black leading-none text-white sm:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
        {detail}
      </p>
    </article>
  );
}

function LeagueRankingTable({ leagues }: { leagues: LeagueStat[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#d6ad55]/18">
      <div className="hidden grid-cols-[0.6fr_1.5fr_0.7fr_0.7fr_0.9fr] bg-[#d6ad55]/[0.075] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad55] md:grid">
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
            className="grid gap-3 bg-[#061225] px-4 py-4 text-sm transition hover:bg-[#d6ad55]/[0.05] md:grid-cols-[0.6fr_1.5fr_0.7fr_0.7fr_0.9fr] md:items-center"
          >
            <div className="flex items-center gap-3">
              <span className={getRankClassName(league.rank)}>
                #{league.rank}
              </span>

              <div className="md:hidden">
                <p className="font-black text-white">{league.league}</p>
                <p className="text-xs text-slate-500">{league.record}</p>
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
              <p className={getAccuracyClassName(league.accuracy)}>
                {league.accuracy}
              </p>
              <p className="text-xs text-slate-500 md:mt-1">
                {league.settled} settled
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StrongestPickPanel({
  accuracy,
  record,
  note,
}: {
  accuracy: string;
  record: string;
  note: string;
}) {
  const percentage = getPercentageNumber(accuracy);

  return (
    <section className="relative overflow-hidden rounded-[24px] border border-[#f0c75e]/45 bg-[linear-gradient(145deg,rgba(74,51,12,0.88),rgba(9,24,43,0.99)_58%)] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.4),0_0_34px_rgba(214,173,85,0.08)] sm:rounded-[28px] sm:p-6">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#f0c75e]/28 blur-3xl" />

      <div className="relative">
        <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#f5c94e]">
          Strongest Pick
        </p>

        <h2 className="mt-2 text-[1.45rem] font-black leading-tight text-white sm:text-2xl">
          Highest-confidence picks
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-300">{note}</p>

        <div
          className="mx-auto mt-5 flex h-28 w-28 items-center justify-center rounded-full shadow-[0_0_30px_rgba(214,173,85,0.14)]"
          style={{
            background: `conic-gradient(#f0c75e ${percentage}%, rgba(255,255,255,0.1) 0)`,
          }}
        >
          <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#061225]">
            <span className="text-2xl font-black text-white">{accuracy}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#f0c75e]/30 bg-black/25 p-4">
          <p className="text-sm text-slate-300">Record</p>
          <p className="text-xl font-black text-[#ffe39a]">{record}</p>
        </div>
      </div>
    </section>
  );
}

function InsightCard({
  insight,
  index,
}: {
  insight: SeasonInsight;
  index: number;
}) {
  const styles = [
    "border-[#f0c75e]/40 bg-[linear-gradient(145deg,rgba(214,173,85,0.15),rgba(7,18,32,0.94))]",
    "border-blue-400/30 bg-[linear-gradient(145deg,rgba(59,130,246,0.1),rgba(7,18,32,0.94))]",
    "border-sky-400/30 bg-[linear-gradient(145deg,rgba(56,189,248,0.1),rgba(7,18,32,0.94))]",
    "border-red-400/30 bg-[linear-gradient(145deg,rgba(239,68,68,0.1),rgba(7,18,32,0.94))]",
    "border-violet-400/30 bg-[linear-gradient(145deg,rgba(139,92,246,0.1),rgba(7,18,32,0.94))]",
    "border-[#f0c75e]/40 bg-[linear-gradient(145deg,rgba(214,173,85,0.15),rgba(7,18,32,0.94))]",
  ];

  return (
    <article
      className={`rounded-2xl border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] ${
        styles[index % styles.length]
      }`}
    >
      <p className="text-xs font-black uppercase tracking-[0.17em] text-slate-400">
        {insight.label}
      </p>
      <p className="mt-3 text-xl font-black text-white sm:text-2xl">
        {insight.value}
      </p>
      <p className="mt-2 text-sm leading-5 text-slate-400">
        {insight.detail}
      </p>
    </article>
  );
}

function TrendCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "gold" | "green" | "red" | "blue";
}) {
  const styles = {
    gold: "border-[#f0c75e]/40 bg-[linear-gradient(145deg,rgba(214,173,85,0.15),rgba(7,18,32,0.94))] text-[#ffe39a]",
    green:
      "border-emerald-400/30 bg-[linear-gradient(145deg,rgba(16,185,129,0.11),rgba(7,18,32,0.94))] text-emerald-300",
    red: "border-red-400/30 bg-[linear-gradient(145deg,rgba(239,68,68,0.1),rgba(7,18,32,0.94))] text-red-300",
    blue: "border-blue-400/30 bg-[linear-gradient(145deg,rgba(59,130,246,0.11),rgba(7,18,32,0.94))] text-blue-300",
  };

  return (
    <article
      className={`rounded-2xl border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] ${styles[tone]}`}
    >
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-black">{label}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </article>
  );
}

function EmptyResults() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#f0c75e]/40 bg-[linear-gradient(145deg,rgba(214,173,85,0.15),rgba(7,18,32,0.94))] p-6 text-center shadow-[0_0_30px_rgba(214,173,85,0.06)]">
      <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[#f0c75e]/15 blur-2xl" />

      <div className="relative">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#f0c75e]/35 bg-[#d6ad55]/15 text-lg">
          ✓
        </div>

        <p className="mt-3 text-lg font-black text-white">
          2026/27 results will appear here
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Verified results will populate automatically after predictions are
          settled.
        </p>
      </div>
    </div>
  );
}

function ResultDetail({
  label,
  value,
  right = false,
}: {
  label: string;
  value: string;
  right?: boolean;
}) {
  return (
    <div className={right ? "text-right" : ""}>
      <p className="text-[0.6rem] font-black uppercase tracking-[0.16em] text-[#d6ad55]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-100">{value}</p>
    </div>
  );
}

function ResultPill({ result }: { result: ResultStatus }) {
  const styles =
    result === "WON"
      ? "border-emerald-400/35 bg-emerald-400/12 text-emerald-300"
      : result === "LOST"
        ? "border-red-400/35 bg-red-400/12 text-red-300"
        : "border-[#f0c75e]/40 bg-[#d6ad55]/15 text-[#ffe39a]";

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-[0.68rem] font-black tracking-wide ${styles}`}
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
        <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#f5c94e] drop-shadow-[0_0_10px_rgba(245,201,78,0.15)] sm:text-sm">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-[1.4rem] font-black leading-tight text-white sm:text-2xl">
          {title}
        </h2>
      </div>

      {note ? (
        <p className="text-xs font-medium text-slate-500 sm:text-sm">{note}</p>
      ) : null}
    </div>
  );
}

function getPercentageNumber(value: string): number {
  const parsed = Number.parseInt(value.replace("%", ""), 10);

  return Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
}

function getRankClassName(rank: number): string {
  if (rank === 1) {
    return "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f0cf7a]/55 bg-[#d6ad55]/20 text-sm font-black text-[#ffe39a] shadow-[0_0_18px_rgba(214,173,85,0.1)]";
  }

  if (rank === 2) {
    return "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/30 bg-slate-300/10 text-sm font-black text-slate-200";
  }

  if (rank === 3) {
    return "inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-300/30 bg-orange-300/10 text-sm font-black text-orange-200";
  }

  return "inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/25 bg-blue-400/10 text-sm font-black text-blue-200";
}

function getAccuracyClassName(accuracy: string): string {
  const value = getPercentageNumber(accuracy);

  if (value >= 70) {
    return "text-3xl font-black leading-none text-emerald-300 md:text-xl";
  }

  if (value >= 50) {
    return "text-3xl font-black leading-none text-[#ffe39a] md:text-xl";
  }

  return "text-3xl font-black leading-none text-red-300 md:text-xl";
}