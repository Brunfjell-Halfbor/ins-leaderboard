import PageContainer from "../../components/layout/PageContainer";

export default function HelpPage() {
  return (
    <PageContainer title="Help">
      <div className="space-y-4">
        <div className="collapse collapse-arrow bg-base-100">
          <input type="radio" />
          <div className="collapse-title">
            How do I join?
          </div>
          <div className="collapse-content">
            Search for TUG servers in-game.
          </div>
        </div>
      </div>
    </PageContainer>
  );
}