import PageContainer from "../../components/layout/PageContainer";

export default function AdminsPage() {
  const admins = [
    "Ghost",
    "Ranger",
    "Viper",
    "MedicMike",
  ];

  return (
    <PageContainer
      title="Admins"
      subtitle="Server administration team"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {admins.map((admin) => (
          <div
            key={admin}
            className="card bg-base-100 shadow"
          >
            <div className="card-body">
              {admin}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}