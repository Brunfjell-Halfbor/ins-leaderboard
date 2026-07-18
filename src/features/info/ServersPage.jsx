import { useState, useMemo } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Card from "../../components/ui/Card";
import { useMatches } from "../../hooks/useMatches";
import { 
  FaServer, 
  FaUsers, 
  FaGamepad, 
  FaMapMarkedAlt,
  FaClock,
  FaTrophy,
  FaSearch,
  FaGlobe
} from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import tugImage from "../../assets/images/tug.png";

const ITEMS_PER_PAGE = 10;

export default function ServersPage() {
  const { matches, loading, error, refresh } = useMatches();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate server stats from matches data
  const serverStats = useMemo(() => {
    if (!matches || matches.length === 0) {
      return {
        name: "TUG Server",
        status: "online",
        players: 0,
        maxPlayers: 32,
        map: "Unknown",
        gameMode: "Unknown",
        region: "Unknown",
        totalMatches: 0
      };
    }

    // Get the most recent match for current server info
    const latestMatch = matches[0];
    const uniqueMaps = new Set(matches.map(m => m.map).filter(Boolean));
    const uniqueModes = new Set(matches.map(m => m.gameMode).filter(Boolean));

    return {
      name: latestMatch.serverName || "TUG Server",
      status: "online",
      players: latestMatch.playerCount || 0,
      maxPlayers: latestMatch.maxPlayers || 32,
      map: latestMatch.map || "Unknown",
      gameMode: latestMatch.gameMode || "Unknown",
      region: latestMatch.region || "Unknown",
      totalMatches: matches.length,
      uniqueMaps: uniqueMaps.size,
      uniqueModes: uniqueModes.size
    };
  }, [matches]);

  // Filter matches based on search
  const filteredMatches = useMemo(() => {
    if (!matches) return [];
    return matches.filter((match) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        match.map?.toLowerCase().includes(searchLower) ||
        match.gameMode?.toLowerCase().includes(searchLower) ||
        match.serverName?.toLowerCase().includes(searchLower) ||
        match.win?.toString().toLowerCase().includes(searchLower)
      );
    });
  }, [matches, searchTerm]);

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate pagination
  const totalItems = filteredMatches.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentMatches = filteredMatches.slice(startIndex, endIndex);

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

  // Calculate win/loss stats
  const winLossStats = useMemo(() => {
    if (!matches || matches.length === 0) return { wins: 0, losses: 0, winRate: 0 };
    const wins = matches.filter(m => m.win === true).length;
    const losses = matches.filter(m => m.win === false).length;
    const total = wins + losses;
    return {
      wins,
      losses,
      winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
      total
    };
  }, [matches]);

  if (loading) {
    return (
      <PageContainer title="Server">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-accent" />
            <p className="text-sm opacity-60">Loading matches...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Server">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="alert alert-error max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Server">
      
      {/* Server Stats Card - using real data */}
      {matches && matches.length > 0 && (
        <div className="mb-8">
          <div className="card bg-gradient-to-r from-base-200 to-base-100 border border-accent/20 shadow-xl overflow-hidden">
            <div className="card-body p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full ring ring-accent/30 ring-offset-2 ring-offset-base-100">
                      <img src={tugImage} alt="Server Icon" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {serverStats.name}
                      <span className="badge badge-success badge-sm gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        Live
                      </span>
                    </h2>
                    <div className="flex items-center gap-3 text-sm opacity-60">
                      <span className="flex items-center gap-1">
                        <FaGlobe className="text-xs" />
                        {serverStats.region}
                      </span>
                      <span>•</span>
                      <span>{serverStats.totalMatches} matches</span>
                      <span>•</span>
                      <span>{serverStats.uniqueMaps} maps</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="stat bg-base-300/30 rounded-box p-2.5 min-w-[80px]">
                    <div className="stat-title text-xs flex items-center gap-1">
                      <FaUsers /> Players
                    </div>
                    <div className="stat-value text-base">
                      {serverStats.players}/{serverStats.maxPlayers}
                    </div>
                  </div>
                  <div className="stat bg-base-300/30 rounded-box p-2.5 min-w-[80px]">
                    <div className="stat-title text-xs flex items-center gap-1">
                      <FaMapMarkedAlt /> Map
                    </div>
                    <div className="stat-value text-base truncate max-w-[100px]">
                      {serverStats.map}
                    </div>
                  </div>
                  <div className="stat bg-base-300/30 rounded-box p-2.5 min-w-[80px]">
                    <div className="stat-title text-xs flex items-center gap-1">
                      <FaGamepad /> Mode
                    </div>
                    <div className="stat-value text-base truncate max-w-[100px]">
                      {serverStats.gameMode}
                    </div>
                  </div>
                  <div className="stat bg-base-300/30 rounded-box p-2.5 min-w-[80px]">
                    <div className="stat-title text-xs flex items-center gap-1">
                      <FaTrophy /> Win Rate
                    </div>
                    <div className="stat-value text-base">
                      {winLossStats.winRate}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matches Section */}
      <div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 opacity-60">
              <FaServer className="text-xs" />
              <span>Total Matches:</span>
              <span className="font-bold text-accent">{filteredMatches.length}</span>
            </div>
            {filteredMatches.length > 0 && (
              <>
                <div className="divider divider-horizontal" />
                <div className="flex items-center gap-2 opacity-60">
                  <span>Showing:</span>
                  <span className="font-bold text-accent">
                    {`${startIndex + 1}-${endIndex}`}
                  </span>
                  <span>of {totalItems}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <div className="flex-1 sm:w-64">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input
                  type="text"
                  placeholder="Search matches..."
                  className="input input-bordered w-full bg-base-200 text-sm pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={refresh}
              className="btn btn-ghost btn-sm"
              title="Refresh matches"
            >
              <MdRefresh className="text-lg" />
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="alert alert-warning max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{matches.length === 0 ? 'No matches available.' : 'No matches found matching your search.'}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {currentMatches.map((match, index) => {
                const globalIndex = startIndex + index;
                return (
                  <Card key={match.id || globalIndex} className="hover:border-accent/50 transition-all hover:shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold truncate">
                            {match.map || "Unknown Map"}
                          </h3>
                          {match.win !== undefined && (
                            <span className={`badge badge-sm ${match.win ? 'badge-success' : 'badge-error'}`}>
                              {match.win ? 'Victory' : 'Defeat'}
                            </span>
                          )}
                        </div>
                        {match.gameMode && (
                          <p className="text-sm opacity-60 flex items-center gap-1 mt-0.5">
                            <FaGamepad className="text-xs" />
                            {match.gameMode}
                          </p>
                        )}
                        {match.serverName && (
                          <p className="text-xs opacity-40 flex items-center gap-1 mt-0.5">
                            <FaServer className="text-[10px]" />
                            {match.serverName}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {match.score !== undefined && match.score !== null && (
                          <div className="flex items-center gap-1">
                            <FaTrophy className="text-accent text-xs" />
                            <span>{match.score}</span>
                          </div>
                        )}
                        {match.kills !== undefined && match.deaths !== undefined && (
                          <div className="flex items-center gap-1">
                            <span className="text-success">{match.kills}</span>
                            <span className="opacity-40">/</span>
                            <span className="text-error">{match.deaths}</span>
                          </div>
                        )}
                        {match.playedAt && (
                          <div className="flex items-center gap-1 opacity-40 text-xs">
                            <FaClock />
                            <span>
                              {new Date(match.playedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Match duration if available */}
                    {match.duration && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs opacity-40 mb-0.5">
                          <span>Duration</span>
                          <span>{match.duration}m</span>
                        </div>
                        <progress 
                          className="progress progress-accent w-full h-1.5" 
                          value={Math.min(match.duration, 60)} 
                          max="60"
                        />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Pagination - Updated to match LeaderboardsPage style */}
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

            {/* Showing info - matching LeaderboardsPage style */}
            {filteredMatches.length > 0 && (
              <div className="text-center text-sm opacity-60 mt-4">
                Showing {startIndex + 1} - {Math.min(endIndex, filteredMatches.length)} of {filteredMatches.length} matches
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}