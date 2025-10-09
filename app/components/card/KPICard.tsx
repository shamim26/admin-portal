import React from "react";
import { TrendingUp, TrendingDown, Minus, Users } from "lucide-react";

type Trend = "positive" | "negative" | "neutral";

type KpiCardProps = {
  title?: string;
  value?: number | string;
  icon?: React.ReactNode;
  percentage?: number | null; 
  trend?: Trend; // explicitly set trend, otherwise inferred from percentage
  timeframe?: string; // e.g. "this month", "last 7 days"
  className?: string; 
  sparklineData?: number[]; // optional tiny inline sparkline
  locale?: string; // for number formatting
  onClick?: () => void;
};

export default function KpiCard({
  title = "Total Users",
  icon = <Users />,
  value = 100,
  percentage = null,
  trend,
  timeframe = "This month",
  className = "",
  sparklineData,
  locale = "en-US",
  onClick,
}: KpiCardProps) {
  // determine trend if not explicitly provided
  const inferredTrend: Trend =
    trend ??
    (percentage == null
      ? "neutral"
      : percentage > 0
      ? "positive"
      : percentage < 0
      ? "negative"
      : "neutral");

  const trendIcon =
    inferredTrend === "positive" ? (
      <TrendingUp size={16} />
    ) : inferredTrend === "negative" ? (
      <TrendingDown size={16} />
    ) : (
      <Minus size={16} />
    );

  const trendColorClass =
    inferredTrend === "positive"
      ? "text-success"
      : inferredTrend === "negative"
      ? "text-red-500"
      : "text-gray-400";

  // friendly number formatting (preserve non-numeric values)
  function formatValue(v: number | string) {
    if (typeof v === "number") {
      // choose compact notation for large numbers (e.g. 1.2K)
      return Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(v);
    }
    return v;
  }

  // small inline sparkline SVG generator (keeps bundle free of libs)
  function Sparkline({ data = [] }: { data?: number[] }) {
    if (!data || data.length < 2) return null;
    const width = 80;
    const height = 24;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    const last = data[data.length - 1];
    const first = data[0];
    const lastTrend =
      last > first ? "positive" : last < first ? "negative" : "neutral";

    return (
      <svg
        className="inline-block"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden
      >
        <polyline
          points={points}
          fill="none"
          strokeWidth={2}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={width} cy={height} r={0} />
        <style>{`:root { --spark-color: ${
          lastTrend === "positive"
            ? "#00a650"
            : lastTrend === "negative"
            ? "#ef4444"
            : "#9ca3af"
        }; }`}</style>
      </svg>
    );
  }

  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={`bg-white rounded p-5 ${className} select-none`}
      aria-label={`${title} — ${
        typeof value === "number"
          ? new Intl.NumberFormat(locale).format(value)
          : value
      }`}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg text-gray-500 truncate" title={title}>
          {title}
        </h3>

        <span className="block p-4 rounded bg-secondary/50" aria-hidden>
          {icon}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <p className="text-3xl font-bold leading-none">{formatValue(value)}</p>
        {sparklineData ? <Sparkline data={sparklineData} /> : null}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span
          className={`${trendColorClass} flex items-center gap-1`}
          aria-hidden
        >
          {trendIcon}
          {percentage != null ? (
            <span className="text-sm font-medium">{Math.abs(percentage)}%</span>
          ) : (
            <span className="text-sm font-medium">—</span>
          )}
        </span>

        <p className="text-gray-500 text-sm">
          {percentage == null ? (
            `${timeframe}`
          ) : (
            <>
              <span className="sr-only">Change:</span>
              {inferredTrend === "positive"
                ? "increase"
                : inferredTrend === "negative"
                ? "decrease"
                : "no change"}{" "}
              from last period
            </>
          )}
        </p>
      </div>
    </div>
  );
}
