import { latestResults, leagueStats, type ResultStatus } from "@/lib/mock-results";

const summaryStats = [
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
];

export default function Home() {
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
                Public read-only performance dashboard tracking accuracy,
                settled picks and latest Pro Football Intel results.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-inner shadow-white/5 backdrop-blur xl:max-w-[280px]">
              <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-slate-400 sm:text-xs">
                Season
              </label>

              <select className="w-full rounded-xl border border-white/10 bg-[#06111f] px-3 py-2.5 text-sm font-semibold text-white outline-none ring-0 transition focus:border-emerald-400/40">
                <option>2026/27 Mock Season</option>
                <option>2025/26 Archive</option>
              </select>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {summaryStats.map((stat) => (
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
              eyebrow="League Accuracy"
              title="Breakdown by league"
              note="Mock data preview"
            />

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {leagueStats.map((item) => (
                <div
                  key={item.league}
                  className="group rounded-2xl border border-white/10 bg-[#061320]/90 p-3.5 shadow-[0_12px_34px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-[#071b2d] sm:p-5"
                >
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
                    Mock accuracy for strongest confidence picks.
                  </p>
                </div>

                <p className="text-[2.85rem] font-black leading-none tracking-tight text-emerald-300 sm:mt-6 sm:text-5xl">
                  74%
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#05111d]/70 px-3.5 py-3 shadow-inner shadow-white/5 sm:mt-6 sm:p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-slate-400">Record</p>
                  <p className="text-lg font-black text-white sm:text-xl">
                    23W / 8L
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[26px] border border-white/10 bg-[#0a1b2e]/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-3xl sm:p-6">
          <SectionHeader eyebrow="Latest Results" title="Recent settled picks" />

          <div className="space-y-2.5 md:hidden">
            {latestResults.map((match) => (
              <article
                key={`${match.home}-${match.away}-mobile`}
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
                      Score
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-100">
                      {match.score}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-[0.7rem] font-medium text-slate-600">
                  Verified by manual review
                </p>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
            <div className="grid grid-cols-6 bg-white/[0.055] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <span>Match</span>
              <span>League</span>
              <span>Pick</span>
              <span>Score</span>
              <span>Status</span>
              <span>Verified</span>
            </div>

            {latestResults.map((match) => (
              <div
                key={`${match.home}-${match.away}`}
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

                <div className="text-slate-500">Manual review</div>
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
}: {
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
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