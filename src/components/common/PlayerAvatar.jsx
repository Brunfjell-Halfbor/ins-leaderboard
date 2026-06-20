export default function PlayerAvatar({
  player,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="avatar placeholder">
        <div className="bg-primary text-primary-content rounded-full w-12">
          <span>
            {player?.username?.[0] || "P"}
          </span>
        </div>
      </div>

      <span>{player.username}</span>
    </div>
  );
}