import StatCard from "../../components/common/StatCard";

export default function PlayerStatsCard({
  player,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard
        title="Kills"
        value={player.kills}
      />

      <StatCard
        title="Deaths"
        value={player.deaths}
      />

      <StatCard
        title="Playtime"
        value={`${player.playtime}h`}
      />

      <StatCard
        title="Level"
        value={player.level}
      />
    </div>
  );
}