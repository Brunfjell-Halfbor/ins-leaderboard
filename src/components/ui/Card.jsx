export default function Card({
  title,
  children,
}) {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        {title && (
          <h2 className="card-title">
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
}