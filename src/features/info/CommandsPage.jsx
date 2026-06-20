import PageContainer from "../../components/layout/PageContainer";
import Table from "../../components/ui/Table";

export default function CommandsPage() {
  const commands = [
    {
      command: "!rtv",
      description: "Vote map change",
    },
    {
      command: "!nextmap",
      description: "View next map",
    },
  ];

  return (
    <PageContainer
      title="Game Commands"
      subtitle="Available commands"
    >
      <Table
        columns={[
          {
            key: "command",
            label: "Command",
          },
          {
            key: "description",
            label: "Description",
          },
        ]}
        data={commands}
      />
    </PageContainer>
  );
}