import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/ui/SearchBar";
import { useTeamKills } from "../../hooks/useTeamKills";
import { formatDate } from "../../utils/formatDate";
import tugImage from "../../assets/images/tug.png";
import { FaSkull, FaUserSlash, FaExclamationTriangle, FaCrosshairs } from "react-icons/fa";

export default function TeamKillPage() {
  const navigate = useNavigate();
  const { teamKills, loading, error, refresh } = useTeamKills();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const normalizedTeamKills = useMemo(() => {
    if (!teamKills) return [];
    
    return teamKills.map(player => ({
      steamId: player.steamId || player.steam_id || null,
      name: player.name || player.playerName || "Unknown Player",
      avatar: player.avatar || player.profile?.avatar || null,
      tkGiven: player.tkGiven || player.teamKills || player.tk || 0,
      tkTaken: player.tkTaken || player.teamKillsTaken || 0,
      kills: player.kills || 0,
      lastSeen: player.lastSeen || player.updatedAt || player.lastPlayed || null,
      tkRatio: player.tkGiven && player.tkTaken > 0 
        ? (player.tkGiven / player.tkTaken).toFixed(2) 
        : player.tkGiven > 0 
          ? player.tkGiven.toFixed(2) 
          : "0.00",
    }));
  }, [teamKills]);

  // Filter team kills
  const filtered = useMemo(() => {
    if (!normalizedTeamKills) return [];
    
    if (!debouncedSearch.trim()) {
      return normalizedTeamKills;
    }

    const searchLower = debouncedSearch.toLowerCase().trim();
    
    return normalizedTeamKills.filter((player) => {
      const nameMatch = player.name?.toLowerCase().includes(searchLower) || false;
      const steamIdMatch = player.steamId?.toLowerCase().includes(searchLower) || false;
      return nameMatch || steamIdMatch;
    });
  }, [normalizedTeamKills, debouncedSearch]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);
  
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

  const handlePlayerClick = (steamId) => {
    if (steamId) {
      navigate(`/player/${steamId}`);
    }
  };

  const getRankColor = (index) => {
    if (index === 0) return "text-yellow-500";
    if (index === 1) return "text-gray-400";
    if (index === 2) return "text-amber-600";
    return "text-base-content/40";
  };

  const getRankBadgeClass = (index) => {
    if (index === 0) return "badge-warning";
    if (index === 1) return "badge-secondary";
    if (index === 2) return "badge-primary";
    return "badge-ghost";
  };

  // Safe date formatter
  const safeFormatDate = (date) => {
    if (!date) return "Never";
    try {
      const formatted = formatDate(date);
      return formatted || "Never";
    } catch (e) {
      return "Never";
    }
  };

  if (loading) {
    return (
      <PageContainer title="Team Kill Statistics">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-accent" />
            <p className="text-sm opacity-60">Loading team kill data...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Team Kill Statistics">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="alert alert-error max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error loading team kill data: {error}</span>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Calculate stats
  const totalTKGiven = normalizedTeamKills?.reduce((sum, p) => sum + (p.tkGiven || 0), 0) || 0;
  const totalTKTaken = normalizedTeamKills?.reduce((sum, p) => sum + (p.tkTaken || 0), 0) || 0;
  const totalPlayers = normalizedTeamKills?.length || 0;
  const avgTKGiven = totalPlayers > 0 ? (totalTKGiven / totalPlayers).toFixed(1) : 0;

  return (
    <PageContainer
      title="Team Kill Statistics"
      subtitle="Players with the most team kills"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 border border-base-300 rounded-box p-4">
          <div className="stat-title text-xs flex items-center gap-1 opacity-60">
            <FaSkull /> Total TK Given
          </div>
          <div className="stat-value text-2xl font-bold text-error">
            {totalTKGiven.toLocaleString()}
          </div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box p-4">
          <div className="stat-title text-xs flex items-center gap-1 opacity-60">
            <FaUserSlash /> Total TK Taken
          </div>
          <div className="stat-value text-2xl font-bold text-warning">
            {totalTKTaken.toLocaleString()}
          </div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box p-4">
          <div className="stat-title text-xs flex items-center gap-1 opacity-60">
            <FaCrosshairs /> Players with TKs
          </div>
          <div className="stat-value text-2xl font-bold text-accent">
            {totalPlayers}
          </div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box p-4">
          <div className="stat-title text-xs flex items-center gap-1 opacity-60">
            <FaExclamationTriangle /> Avg TK Given
          </div>
          <div className="stat-value text-2xl font-bold text-info">
            {avgTKGiven}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by player name or Steam ID..."
        />
      </div>

      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-sm opacity-60">
          Found {filtered.length} player{filtered.length !== 1 ? "s" : ""}
        </div>
        <button 
          onClick={refresh}
          className="btn btn-ghost btn-sm"
          title="Refresh data"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>TK Given</th>
              <th>TK Taken</th>
              <th>TK Ratio</th>
              <th className="hidden md:table-cell">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-base-content/60">
                  No players found matching your search
                </td>
              </tr>
            ) : (
              currentItems.map((player, index) => {
                const globalIndex = startIndex + index;
                const rankColor = getRankColor(globalIndex);
                const rankBadge = getRankBadgeClass(globalIndex);
                
                return (
                  <tr 
                    key={player.steamId || index}
                    className="cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => handlePlayerClick(player.steamId)}
                  >
                    <th>
                      {globalIndex <= 2 ? (
                        <div className={`badge ${rankBadge} text-lg px-3 py-2`}>
                          #{globalIndex + 1}
                        </div>
                      ) : (
                        <span className={rankColor}>#{globalIndex + 1}</span>
                      )}
                    </th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 rounded-full">
                            <img 
                              src={player.avatar || tugImage} 
                              alt={player.name || player.steamId || "Unknown"}
                              onError={(e) => { e.target.src = tugImage; }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{player.name || "Unknown Player"}</div>
                          <div className="text-xs opacity-60">ID: {player.steamId || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-error badge-lg">
                        {player.tkGiven || 0}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-warning badge-lg">
                        {player.tkTaken || 0}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-base badge-outline">
                        {player.tkRatio || "0.00"}
                      </span>
                    </td>
                    <td className="hidden md:table-cell">
                      {safeFormatDate(player.lastSeen)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {currentItems.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            No players found matching your search
          </div>
        ) : (
          currentItems.map((player, index) => {
            const globalIndex = startIndex + index;
            const rankColor = getRankColor(globalIndex);
            
            return (
              <div
                key={player.steamId || index}
                className="card bg-base-100 border border-base-300 rounded-box cursor-pointer hover:border-accent transition-colors"
                onClick={() => handlePlayerClick(player.steamId)}
              >
                <div className="card-body p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img 
                          src={player.avatar || tugImage} 
                          alt={player.name || player.steamId || "Unknown"}
                          onError={(e) => { e.target.src = tugImage; }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${rankColor}`}>#{globalIndex + 1}</span>
                        <span className="font-bold">{player.name || "Unknown Player"}</span>
                      </div>
                      <div className="text-xs opacity-60">ID: {player.steamId || "N/A"}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">TK Given</div>
                      <div className="stat-value text-lg font-bold text-error">
                        {player.tkGiven || 0}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">TK Taken</div>
                      <div className="stat-value text-lg font-bold text-warning">
                        {player.tkTaken || 0}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">TK Ratio</div>
                      <div className="stat-value text-lg font-bold text-accent">
                        {player.tkRatio || "0.00"}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">Last Seen</div>
                      <div className="stat-value text-xs">{safeFormatDate(player.lastSeen)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
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

      {filtered.length > 0 && (
        <div className="text-center text-sm opacity-60 mt-4">
          Showing {startIndex + 1} - {Math.min(endIndex, filtered.length)} of {filtered.length} players
        </div>
      )}
    </PageContainer>
  );
}