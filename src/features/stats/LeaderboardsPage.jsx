import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/ui/SearchBar";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { formatDate } from "../../utils/formatDate";
import tugImage from "../../assets/images/tug.png";

export default function LeaderboardsPage() {
  const navigate = useNavigate();
  const { leaderboard, loading, error, sort, setSort } = useLeaderboard();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideIntervalRef = useRef(null);
  const itemsPerPage = 10;

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return leaderboard;
    }

    const searchLower = debouncedSearch.toLowerCase().trim();
    
    return leaderboard.filter((player) => {
      const nameMatch = player.profile?.name?.toLowerCase().includes(searchLower) || 
                       player.name?.toLowerCase().includes(searchLower) || false;
      const steamIdMatch = player.steamId?.toLowerCase().includes(searchLower) || false;
      const rankMatch = player.rank?.toString().includes(searchLower) || false;
      return nameMatch || steamIdMatch || rankMatch;
    });

  }, [leaderboard, debouncedSearch]);

  const top10 = useMemo(() => leaderboard.slice(0, 10), [leaderboard]);

  // Auto-slide functionality - FIXED
  useEffect(() => {
    if (top10.length <= 1) return;

    // Clear any existing interval
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }

    slideIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % top10.length);
      }
    }, 4000);

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [top10.length, isPaused]); // Re-run when top10 length or pause state changes

  // Reset slide when top10 changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [top10]);

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

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % top10.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + top10.length) % top10.length);
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-amber-500 to-amber-700";
    return "from-base-300 to-base-400";
  };

  const getRankGlow = (rank) => {
    if (rank === 1) return "shadow-yellow-500/30";
    if (rank === 2) return "shadow-gray-400/30";
    if (rank === 3) return "shadow-amber-600/30";
    return "";
  };

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return "badge-primary text-white";
    if (rank === 2) return "badge-primary text-white";
    if (rank === 3) return "badge-primary text-white";
    return "badge-ghost";
  };

  const sortOptions = [
    { value: "score", label: "Score" },
    { value: "kills", label: "Kills" },
    { value: "kd", label: "K/D Ratio" },
    { value: "wins", label: "Wins" },
  ];

  const handlePlayerClick = (steamId) => {
    navigate(`/player/${steamId}`);
  };

  const getPlayerName = (player) => {
    return player.profile?.name || player.name || player.steamId;
  };

  const getPlayerAvatar = (player) => {
    return player.profile?.avatar || player.avatar || tugImage;
  };

  const getPlayerStats = (player) => {
    return player.stats || player;
  };

  if (loading) {
    return (
      <PageContainer title="Leaderboards">
        <span className="loading loading-spinner loading-lg" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Leaderboards">
        <div className="alert alert-error">
          <span>Error loading leaderboard: {error}</span>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Leaderboards"
      subtitle="Top ranked players"
    >
      {top10.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full"></span>
              Top 10 Tuggers
            </h3>
            <div className="flex items-center gap-1 text-xs opacity-40">
              <span>{currentSlide + 1}</span>
              <span className="w-4 h-px bg-base-300"></span>
              <span>{top10.length}</span>
            </div>
          </div>

          <div 
            className="relative rounded-xl overflow-hidden border border-base-300 bg-base-100"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slide Container */}
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {top10.map((player, index) => {
                const stats = getPlayerStats(player);
                const rankGradient = getRankColor(player.rank);
                const rankGlow = getRankGlow(player.rank);
                
                return (
                  <div
                    key={player.steamId}
                    className="min-w-full flex-shrink-0 p-6 cursor-pointer"
                    onClick={() => handlePlayerClick(player.steamId)}
                  >
                    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 max-w-5xl mx-auto">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0">
                        <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${rankGradient} p-1 shadow-lg ${rankGlow}`}>
                          <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center">
                            <span className="text-3xl font-black text-base-content">
                              #{player.rank}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="avatar flex-shrink-0">
                        <div className="w-28 rounded-full ring-4 ring-accent/20 ring-offset-2 ring-offset-base-100">
                          <img src={getPlayerAvatar(player)} alt={getPlayerName(player)} />
                        </div>
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 text-center lg:text-left">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-1 lg:gap-3">
                          <span className="text-2xl font-bold">{getPlayerName(player)}</span>
                          <span className="text-xs opacity-40 font-mono">ID: {player.steamId}</span>
                        </div>
                        
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-2 text-sm">
                          <span className="opacity-70">Wins: <strong>{stats?.wins || 0}</strong></span>
                          <span className="opacity-70">Losses: <strong>{stats?.losses || 0}</strong></span>
                          <span className="opacity-70">Headshots: <strong>{stats?.headshotsGiven?.toLocaleString() || 0}</strong></span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 mt-4 max-w-md mx-auto lg:mx-0">
                          <div className="stat bg-base-200 rounded-lg p-2 text-center">
                            <div className="stat-title text-[10px] uppercase tracking-wider opacity-60">Score</div>
                            <div className="stat-value text-base font-bold text-accent">
                              {stats?.score?.toLocaleString() || 0}
                            </div>
                          </div>
                          <div className="stat bg-base-200 rounded-lg p-2 text-center">
                            <div className="stat-title text-[10px] uppercase tracking-wider opacity-60">K/D Ratio</div>
                            <div className="stat-value text-base font-bold text-success">
                              {player.kd || (stats?.kills && stats?.deaths ? (stats.kills / stats.deaths).toFixed(2) : 0)}
                            </div>
                          </div>
                          <div className="stat bg-base-200 rounded-lg p-2 text-center">
                            <div className="stat-title text-[10px] uppercase tracking-wider opacity-60">HS %</div>
                            <div className="stat-value text-base font-bold text-info">
                              {stats?.headshotsGiven && stats?.kills > 0 
                                ? `${Math.round((stats.headshotsGiven / stats.kills) * 100)}%`
                                : '0%'}
                            </div>
                          </div>
                          <div className="stat bg-base-200 rounded-lg p-2 text-center">
                            <div className="stat-title text-[10px] uppercase tracking-wider opacity-60">Kills</div>
                            <div className="stat-value text-sm font-semibold">
                              {stats?.kills?.toLocaleString() || 0}
                            </div>
                          </div>
                          <div className="stat bg-base-200 rounded-lg p-2 text-center">
                            <div className="stat-title text-[10px] uppercase tracking-wider opacity-60">Deaths</div>
                            <div className="stat-value text-sm font-semibold">
                              {stats?.deaths?.toLocaleString() || 0}
                            </div>
                          </div>
                          <div className="stat bg-base-200 rounded-lg p-2 text-center">
                            <div className="stat-title text-[10px] uppercase tracking-wider opacity-60">Win Rate</div>
                            <div className="stat-value text-sm font-semibold text-success">
                              {(stats?.wins || 0) + (stats?.losses || 0) > 0
                                ? `${Math.round(((stats?.wins || 0) / ((stats?.wins || 0) + (stats?.losses || 0))) * 100)}%`
                                : '0%'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            {top10.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost btn-sm opacity-60 hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost btn-sm opacity-60 hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {top10.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {top10.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => goToSlide(dotIndex)}
                    className={`transition-all duration-300 rounded-full ${
                      dotIndex === currentSlide 
                        ? 'w-6 h-1.5 bg-accent' 
                        : 'w-1.5 h-1.5 bg-base-300 hover:bg-base-400'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Pause indicator */}
            {isPaused && top10.length > 1 && (
              <div className="absolute top-3 right-3 text-xs opacity-30 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Paused
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by player name, Steam ID, or rank..."
        />
      </div>

      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-sm opacity-60">
          Found {filtered.length} player{filtered.length !== 1 ? "s" : ""}
        </div>

        <div className="form-control">
          <label className="label cursor-pointer gap-2">
            <span className="label-text">Sort by:</span>
            <select
              className="select select-bordered select-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

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
              <th className="hidden lg:table-cell">Wins</th>
              <th className="hidden lg:table-cell">Losses</th>
              <th className="hidden md:table-cell">Last Played</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-base-content/60">
                  No players found matching your search
                </td>
              </tr>
            ) : (
              currentItems.map((player) => {
                const stats = getPlayerStats(player);
                
                return (
                  <tr 
                    key={player.steamId}
                    className="cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => handlePlayerClick(player.steamId)}
                  >
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
                            <img src={getPlayerAvatar(player)} alt={getPlayerName(player)} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{getPlayerName(player)}</div>
                          <div className="text-xs opacity-60">ID: {player.steamId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold">{stats?.score?.toLocaleString() || 0}</td>
                    <td>{stats?.kills?.toLocaleString() || 0}</td>
                    <td>{stats?.deaths?.toLocaleString() || 0}</td>
                    <td>
                      <span className="badge badge-base badge-outline">
                        {player.kd || (stats?.kills && stats?.deaths ? (stats.kills / stats.deaths).toFixed(2) : 0)}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell">{stats?.wins || 0}</td>
                    <td className="hidden lg:table-cell">{stats?.losses || 0}</td>
                    <td className="hidden md:table-cell">
                      {formatDate(player.updatedAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {currentItems.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            No players found matching your search
          </div>
        ) : (
          currentItems.map((player) => {
            const stats = getPlayerStats(player);
            
            return (
              <div
                key={player.steamId}
                className="card bg-base-100 border border-base-300 rounded-box cursor-pointer hover:border-accent transition-colors"
                onClick={() => handlePlayerClick(player.steamId)}
              >
                <div className="card-body p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src={getPlayerAvatar(player)} alt={getPlayerName(player)} />
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
                        <span className="font-bold">{getPlayerName(player)}</span>
                      </div>
                      <div className="text-xs opacity-60">ID: {player.steamId}</div>
                    </div>
                    <div className="badge badge-base badge-outline h-12">
                      K/D {player.kd || (stats?.kills && stats?.deaths ? (stats.kills / stats.deaths).toFixed(2) : 0)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">Score</div>
                      <div className="stat-value text-lg font-semibold text-accent">
                        {stats?.score?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">Kills</div>
                      <div className="stat-value text-lg">
                        {stats?.kills?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">Deaths</div>
                      <div className="stat-value text-lg">
                        {stats?.deaths?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">Wins</div>
                      <div className="stat-value text-lg">{stats?.wins || 0}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">Losses</div>
                      <div className="stat-value text-lg">{stats?.losses || 0}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">Last Played</div>
                      <div className="stat-value text-xs">{formatDate(player.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

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