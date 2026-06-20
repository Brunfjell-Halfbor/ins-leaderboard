import { formatNumber } from "../../utils/formatNumber";

export default function StatCard({
  title,
  value,
}) {
  return (
    <div className="stats shadow bg-base-100 w-full">
      <div className="stat">
        <div className="stat-title">
          {title}
        </div>

        <div className="stat-value text-primary">
          {typeof value === "number"
            ? formatNumber(value)
            : value}
        </div>
      </div>
    </div>
  );
}