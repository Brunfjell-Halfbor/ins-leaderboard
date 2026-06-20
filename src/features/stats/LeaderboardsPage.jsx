import { useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/ui/SearchBar";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import tugImage from "../../assets/images/tug.png";

export default function LeaderboardsPage() {
  const { leaderboard, loading } = useLeaderboard();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) {
    return (
      <PageContainer title="Leaderboards">
        <span className="loading loading-spinner loading-lg" />
      </PageContainer>
    );
  }

  const filtered = leaderboard.filter((player) =>
    player.player.toLowerCase().includes(search.toLowerCase())
  );

  // Get top 10 for featured carousel
  const top10 = leaderboard.slice(0, 10);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        end = 4;
      }
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Helper to get rank badge class
  const getRankBadgeClass = (rank) => {
    if (rank === 1) return "badge-primary text-white";
    if (rank === 2) return "badge-primary text-white";
    if (rank === 3) return "badge-primary text-white";
    return "badge-ghost";
  };

  return (
    <PageContainer
      title="Leaderboards"
      subtitle="Top ranked players"
    >
      {/* Featured Top 10 Carousel */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          Top 10 Tuggers
        </h3>
        <div className="carousel w-full rounded-box border border-base-300 bg-base-100 p-4">
          {top10.map((player, index) => {
            const isTop3 = index < 3;
            
            return (
              <div
                key={player.steamId}
                id={`slide-${index + 1}`}
                className="carousel-item relative w-full flex-col items-center justify-center p-6"
              >
                <div className="flex flex-col items-center gap-3 w-full max-w-md">
                  {/* Profile Picture */}
                  <div className="avatar">
                    <div className={`w-24 `}>
                      <img src={tugImage} alt={player.player} />
                    </div>
                  </div>

                  {/* Rank and Name */}
                  <div className="flex items-center gap-3">
                    <div className={`badge ${getRankBadgeClass(player.rank)} text-lg px-4 py-3`}>
                      #{player.rank}
                    </div>
                    <span className="text-2xl font-bold">{player.player}</span>
                  </div>

                  {/* Steam ID */}
                  <div className="text-xs opacity-60">{player.steamId}</div>

                  <div className="flex gap-4 text-sm opacity-70 mt-1">
                    <span>Wins: {player.wins}</span>
                    <span>Losses: {player.losses}</span>
                    <span>HS: {player.headshotGiven?.toLocaleString() || 0}</span>
                  </div>

                  {/* Stats Grid - More detailed */}
                  <div className="grid grid-cols-3 gap-2 w-full mt-2">
                    <div className="stat bg-base-200 rounded-box p-2 text-center">
                      <div className="stat-title text-xs">Score</div>
                      <div className="stat-value text-lg font-bold text-accent">
                        {player.score.toLocaleString()}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2 text-center">
                      <div className="stat-title text-xs">K/D Ratio</div>
                      <div className="stat-value text-lg font-bold text-success">
                        {player.kd}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2 text-center">
                      <div className="stat-title text-xs">HS %</div>
                      <div className="stat-value text-lg font-bold text-info">
                        {player.headshotGiven && player.kills > 0 
                          ? `${Math.round((player.headshotGiven / player.kills) * 100)}%`
                          : '0%'}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2 text-center">
                      <div className="stat-title text-xs">Kills</div>
                      <div className="stat-value text-md font-semibold">
                        {player.kills.toLocaleString()}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2 text-center">
                      <div className="stat-title text-xs">Deaths</div>
                      <div className="stat-value text-md font-semibold">
                        {player.deaths.toLocaleString()}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2 text-center">
                      <div className="stat-title text-xs">Win Rate</div>
                      <div className="stat-value text-md font-semibold text-success">
                        {player.wins + player.losses > 0
                          ? `${Math.round((player.wins / (player.wins + player.losses)) * 100)}%`
                          : '0%'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carousel Navigation */}
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <a
                    href={`#slide-${index === 0 ? top10.length : index}`}
                    className="btn btn-circle btn-ghost btn-sm"
                  >
                    ❮
                  </a>
                  <a
                    href={`#slide-${index + 2 > top10.length ? 1 : index + 2}`}
                    className="btn btn-circle btn-ghost btn-sm"
                  >
                    ❯
                  </a>
                </div>

                {/* Slide Indicator */}
                <div className="absolute bottom-2 flex gap-1">
                  {top10.map((_, dotIndex) => (
                    <a
                      key={dotIndex}
                      href={`#slide-${dotIndex + 1}`}
                      className={`h-2 w-2 rounded-full ${
                        dotIndex === index ? "bg-white" : "bg-base-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search player..."
        />
      </div>

      {/* Desktop Table - hidden on mobile */}
      <div className="hidden sm:block overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Score</th>
              <th>Kills</th>
              <th>Deaths</th>
              <th>K/D</th>
              <th className="hidden md:table-cell">HS</th>
              <th className="hidden lg:table-cell">Wins</th>
              <th className="hidden lg:table-cell">Losses</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((player) => (
              <tr key={player.steamId}>
                <th>
                  {player.rank <= 3 ? (
                    <div className={`badge ${getRankBadgeClass(player.rank)}`}>
                      #{player.rank}
                    </div>
                  ) : (
                    player.rank
                  )}
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img src={tugImage} alt={player.player} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{player.player}</div>
                      <div className="text-xs opacity-60">{player.steamId}</div>
                    </div>
                  </div>
                </td>
                <td className="font-semibold">{player.score.toLocaleString()}</td>
                <td>{player.kills.toLocaleString()}</td>
                <td>{player.deaths.toLocaleString()}</td>
                <td>
                  <span className="badge badge-base badge-outline">
                    {player.kd}
                  </span>
                </td>
                <td className="hidden md:table-cell">
                  {player.headshotGiven?.toLocaleString()}
                </td>
                <td className="hidden lg:table-cell">{player.wins}</td>
                <td className="hidden lg:table-cell">{player.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - visible only on mobile */}
      <div className="sm:hidden space-y-4">
        {currentItems.map((player) => (
          <div
            key={player.steamId}
            className="card bg-base-100 border border-base-300 rounded-box"
          >
            <div className="card-body p-4">
              {/* Rank, Avatar, and Player Name */}
              <div className="flex items-center gap-3 mb-2">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src={tugImage} alt={player.player} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {player.rank <= 3 ? (
                      <div className={`badge ${getRankBadgeClass(player.rank)}`}>
                        #{player.rank}
                      </div>
                    ) : (
                      <span className="font-bold">#{player.rank}</span>
                    )}
                    <span className="font-bold">{player.player}</span>
                  </div>
                  <div className="text-xs opacity-60">{player.steamId}</div>
                </div>
                <div className="badge badge-base badge-outline">
                  K/D {player.kd}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="stat bg-base-200 rounded-box p-2">
                  <div className="stat-title text-xs">Score</div>
                  <div className="stat-value text-lg font-semibold text-accent">
                    {player.score.toLocaleString()}
                  </div>
                </div>
                <div className="stat bg-base-200 rounded-box p-2">
                  <div className="stat-title text-xs">Kills</div>
                  <div className="stat-value text-lg">
                    {player.kills.toLocaleString()}
                  </div>
                </div>
                <div className="stat bg-base-200 rounded-box p-2">
                  <div className="stat-title text-xs">Deaths</div>
                  <div className="stat-value text-lg">
                    {player.deaths.toLocaleString()}
                  </div>
                </div>
                <div className="stat bg-base-200 rounded-box p-2">
                  <div className="stat-title text-xs">HS</div>
                  <div className="stat-value text-lg">
                    {player.headshotGiven?.toLocaleString() || "0"}
                  </div>
                </div>
                <div className="stat bg-base-200 rounded-box p-2">
                  <div className="stat-title text-xs">Wins</div>
                  <div className="stat-value text-lg">{player.wins}</div>
                </div>
                <div className="stat bg-base-200 rounded-box p-2">
                  <div className="stat-title text-xs">Losses</div>
                  <div className="stat-value text-lg">{player.losses}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                className={`join-item btn ${page === currentPage ? 'btn-active' : ''}`}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
            
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Results counter */}
      <div className="text-center text-sm opacity-60 mt-4">
        Showing {startIndex + 1} - {Math.min(endIndex, filtered.length)} of {filtered.length} players
      </div>
    </PageContainer>
  );
}