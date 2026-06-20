import PlayerStatsCard from "./PlayerStatsCard";
import PlayerHistory from "./PlayerHistory";

const player = {
  username: "Ghost",
  level: 128,
  kills: 5412,
  deaths: 1298,
  playtime: 802,
};

export default function PlayerProfilePage() {
  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h1 className="text-4xl font-bold">
            {player.username}
          </h1>
        </div>
      </div>

      <PlayerStatsCard player={player} />

      <PlayerHistory />
    </div>
  );
}