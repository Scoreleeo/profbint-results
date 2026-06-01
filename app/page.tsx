import {
  getResultsDashboardData,
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

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_24rem),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_26rem),linear-gradient(180deg,#071827_0%,#06111f_44%,#030712_100%)] text-white">
      <section className="mx-auto flex w-full max-w-[430px] flex-col gap-4 px-3 pb-32 pt-4 sm:max-w-7xl sm:gap-6 sm:px-8 sm:pb-16 sm:pt-6 lg:px-10">
        <header className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,38,66,0.96),rgba(7,20,36,0.98)_48%,rgba(3,7,18,0.98))] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.38)] sm:rounded-3xl sm:p-6 lg:p-7">
          <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-emerald-400/14 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-8 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end">
            <div className="min-w-0">
              <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-emerald-400 sm:text-xs sm:tracking-[0.28em]">
                Pro Football Intel Results
              </p>

              <h1 className="max-w-none text-[1.72rem] font-black leading-[1.06] tracking-[-0.04em] text-white sm:text-[2.1rem] md:text-[2.35rem] lg:text-[2.55rem] xl:whitespace-nowrap">
                Prediction results dashboard.
              </h1>

              <p className="mt-2.5 max-w-3xl text-sm leading-6 text-slate-300/85 sm:mt-3 sm:text-base sm:leading-7">
                Public read-only dashboard tracking saved predictions, settled
                outcomes and verified Pro Football Intel performance.
              </p>
            </div>

            <form
              method="GET"
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-inner shadow-white/5 backdrop-blur xl:max-w-[280px]"
            >
              <label
                htmlFor="season"
                className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-slate-400 sm:text-xs"
              >
                Season
              </label>

              <div className="grid grid-cols-[1fr_auto] gap-2">
                <select
                  id="season"
                  name="season"
                  defaultValue={data.selectedSeason}
                  className="min-w-0 rounded-xl border border-white/10 bg-[#06111f] px-3 py-2.5 text-sm font-semibold text-white outline-none ring-0 transition focus:border-emerald-400/40"
                >
                  {data.seasons.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-emerald-300 transition hover:border-emerald-300/40 hover:bg-emerald-400/15"
                >
                  View
                </button>
              </div>
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

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {data.leagueStats.map((item, index) => (
                <div
                  key={item.league}
                  className="group rounded-2xl border border-white/10 bg-[#061320]/90 p-3.5 shadow-[0_12px_34px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-[#071b2d] sm:p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-sm font-black text-emerald-300">
                      #{index + 1}
                    </span>

                    <span className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-500">
                      Rank
                    </span>
                  </div>

                  <p className="truncate text-xs font-semibold text-slate-400 sm:text-sm">
                    {item.league}
                  </p>

                  <p className="mt-2 text-[2rem] font-black leading-none tracking-tight text-white sm:mt-3 sm:text-3xl">
                    {item.accuracy}
                  </p>

                  <p className="mt-1.5 text-xs font-semibold text-slate-500 sm:mt-2 sm:text-sm">
                    {item.record}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[26px] border border-emerald-400/20 bg-[linear-gradient(135deg,rgba(7,47,37,0.96),rgba(7,28,45,0.96))] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.34)] sm:rounded-3xl sm:p-6">
            <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />

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

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#05111d]/70 px-3.5 py-3 shadow-inner shadow-white/5 sm:mt-6 sm:p-4">
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
  const glow =
    tone === "emerald"
      ? "from-emerald-400/14"
      : tone === "red"
        ? "from-red-400/12"
        : "from-amber-400/12";

  return (
    <div className="group rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(10,27,46,0.98),rgba(6,19,32,0.96))] p-3.5 shadow-[0_14px_42px_rgba(0,0,0,0.25)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/20 sm:rounded-3xl sm:p-6">
      <div
        className={`pointer-events-none mb-3 h-1 w-10 rounded-full bg-gradient-to-r ${glow} to-transparent`}
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