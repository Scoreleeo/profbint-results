import type { ResultStatus } from "@/lib/mock-results";

type ResultBadgeProps = {
  result: ResultStatus;
};

export default function ResultBadge({
  result,
}: ResultBadgeProps) {
  const className =
    result === "WON"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : result === "LOST"
        ? "border-red-400/20 bg-red-400/10 text-red-300"
        : "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${className}`}
    >
      {result}
    </span>
  );
}