import { useState } from "react";

import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/ui/SearchBar";
import Table from "../../components/ui/Table";

import { useLeaderboard } from "../../hooks/useLeaderboard";

export default function LeaderboardsPage() {
  const { leaderboard, loading } =
    useLeaderboard();

  const [search, setSearch] = useState("");

  if (loading) {
    return <div>Loading...</div>;
  }

  const filtered = leaderboard.filter((player) =>
    player.player
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    { key: "rank", label: "#" },
    { key: "player", label: "Player" },
    { key: "score", label: "Score" },
    { key: "kills", label: "Kills" },
    { key: "deaths", label: "Deaths" },
    { key: "kd", label: "K/D" },
  ];

  return (
    <PageContainer
      title="Leaderboards"
      subtitle="Top ranked players"
    >
      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search player..."
        />
      </div>

      <Table
        columns={columns}
        data={filtered}
      />
    </PageContainer>
  );
}