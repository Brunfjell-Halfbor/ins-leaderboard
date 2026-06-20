import PageContainer from "../../components/layout/PageContainer";

export default function RulesPage() {
  return (
    <PageContainer
      title="Rules"
      subtitle="Community rules"
    >
      <div className="prose max-w-none">
        <ol>
          <li>Respect all players.</li>
          <li>No cheating.</li>
          <li>No griefing.</li>
          <li>Follow admin instructions.</li>
        </ol>
      </div>
    </PageContainer>
  );
}