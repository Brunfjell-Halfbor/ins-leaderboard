import PageContainer from "../../components/layout/PageContainer";
import StatCard from "../../components/common/StatCard";

export default function HomePage() {
  return (
    <PageContainer
      title="TUG.GG"
      subtitle="Insurgency Community Statistics"
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Registered Players" value={12843} />
        <StatCard title="Servers Online" value={4} />
        <StatCard title="Total Kills" value={9876543} />
        <StatCard title="Play Hours" value={452198} />
      </div>

      <div className="hero bg-base-100 rounded-box mt-8">
        <div className="hero-content text-center py-20">
          <div>
            <h2 className="text-5xl font-bold">
              Welcome to TUG.GG
            </h2>

            <p className="mt-4 opacity-70">
              Track player statistics, leaderboards,
              servers, bans and more.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}