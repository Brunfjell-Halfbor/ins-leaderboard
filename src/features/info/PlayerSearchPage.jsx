import { useState } from "react";

import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/ui/SearchBar";

import { usePlayers } from "../../hooks/usePlayers";

export default function PlayerSearchPage() {
  const { players } = usePlayers();

  const [query, setQuery] = useState("");

  const filtered = players.filter((player) =>
    player.username?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <PageContainer
      title="Player Search"
      subtitle="Search registered players"
    >
      <SearchBar
        value={query}
        onChange={setQuery}
      />

      <div className="mt-6 space-y-4">
        {filtered.map((player) => (
          <div
            key={player.steamId}
            className="card bg-base-100 shadow"
          >
            <div className="card-body">
              <h3 className="font-bold">
                {player.username}
              </h3>

              <p>
                Level {player.level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}