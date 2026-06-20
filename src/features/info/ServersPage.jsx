import PageContainer from "../../components/layout/PageContainer";
import Card from "../../components/ui/Card";
import ServerStatus from "../../components/common/ServerStatus";
import { useServers } from "../../hooks/useServers";

export default function ServersPage() {
  const { servers } = useServers();

  return (
    <PageContainer
      title="Servers"
      subtitle="Current game servers"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {servers.map((server) => (
          <Card key={server.id}>
            <div className="flex justify-between">
              <h3 className="font-bold">
                {server.name}
              </h3>

              <ServerStatus
                status={server.status}
              />
            </div>

            <p>Map: {server.map}</p>

            <p>
              Players: {server.players}/
              {server.maxPlayers}
            </p>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}