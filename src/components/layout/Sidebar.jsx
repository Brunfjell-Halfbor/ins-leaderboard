export default function Sidebar({
  children,
}) {
  return (
    <aside className="w-full lg:w-64 bg-base-100 rounded-box p-4">
      {children}
    </aside>
  );
}