export default function ServerStatus({
  status,
}) {
  const color =
    status === "online"
      ? "badge-success"
      : "badge-error";

  return (
    <div className={`badge ${color}`}>
      {status}
    </div>
  );
}