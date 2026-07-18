import { useState, useEffect, useMemo } from "react";
import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/ui/SearchBar";
import { useBots } from "../../hooks/useBots";
import { FaRobot, FaSkull, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function BotsPage() {
  const { bots, loading, error, refresh } = useBots();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("kills"); // "kills" or "name"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const itemsPerPage = 12;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy, sortOrder]);

  // Normalize bot data
  const normalizedBots = useMemo(() => {
    if (!bots) return [];
    
    return bots.map(bot => ({
      name: bot.name || "Unknown Bot",
      totalKills: bot.totalKills || bot.kills || 0,
    }));
  }, [bots]);

  // Sort and filter bots
  const filteredAndSorted = useMemo(() => {
    if (!normalizedBots) return [];
    
    // First filter
    let result = normalizedBots;
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase().trim();
      result = result.filter((bot) => 
        bot.name?.toLowerCase().includes(searchLower)
      );
    }
    
    // Then sort
    result = [...result].sort((a, b) => {
      if (sortBy === "kills") {
        return sortOrder === "desc" 
          ? b.totalKills - a.totalKills
          : a.totalKills - b.totalKills;
      } else {
        // Sort by name
        return sortOrder === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }
    });
    
    return result;
  }, [normalizedBots, debouncedSearch, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAndSorted.slice(startIndex, endIndex);
  
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

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="opacity-40" />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // Get color based on kills
  const getKillColor = (kills) => {
    if (kills >= 25) return "text-error";
    if (kills >= 20) return "text-warning";
    if (kills >= 15) return "text-accent";
    return "text-base-content/60";
  };

  if (loading) {
    return (
      <PageContainer title="Bots" subtitle="Bot performance statistics">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-accent" />
            <p className="text-sm opacity-60">Loading bot data...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Bots" subtitle="Bot performance statistics">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="alert alert-error max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error loading bot data: {error}</span>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Calculate stats
  const totalBots = filteredAndSorted?.length || 0;
  const totalKills = filteredAndSorted?.reduce((sum, b) => sum + (b.totalKills || 0), 0) || 0;
  const avgKills = totalBots > 0 ? (totalKills / totalBots).toFixed(1) : 0;
  const maxKills = filteredAndSorted?.reduce((max, b) => Math.max(max, b.totalKills || 0), 0) || 0;

  return (
    <PageContainer
      title="Bots"
      subtitle="Bot performance statistics"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 border border-base-300 rounded-box p-4">
          <div className="stat-title text-xs flex items-center gap-1 opacity-60">
            <FaRobot /> Total Bots
          </div>
          <div className="stat-value text-2xl font-bold text-accent">
            {totalBots}
          </div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box p-4">
          <div className="stat-title text-xs flex items-center gap-1 opacity-60">
            <FaSkull /> Total Kills
          </div>
          <div className="stat-value text-2xl font-bold text-error">
            {totalKills.toLocaleString()}
          </div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box p-4">
          <div className="stat-title text-xs flex items-center gap-1 opacity-60">
            <FaSkull /> Average Kills
          </div>
          <div className="stat-value text-2xl font-bold text-info">
            {avgKills}
          </div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box p-4">
          <div className="stat-title text-xs flex items-center gap-1 opacity-60">
            <FaSkull /> Most Kills
          </div>
          <div className="stat-value text-2xl font-bold text-success">
            {maxKills}
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search bots by name..."
            className="w-full sm:w-64"
          />
          <div className="flex items-center gap-2 text-sm opacity-60 ml-0 sm:ml-2">
            <span>Found {filteredAndSorted.length} bot{filteredAndSorted.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="join">
            <button
              className={`join-item btn btn-sm ${sortBy === "name" ? "btn-accent" : "btn-ghost"}`}
              onClick={() => toggleSort("name")}
            >
              Name {getSortIcon("name")}
            </button>
            <button
              className={`join-item btn btn-sm ${sortBy === "kills" ? "btn-accent" : "btn-ghost"}`}
              onClick={() => toggleSort("kills")}
            >
              Kills {getSortIcon("kills")}
            </button>
          </div>
          <button 
            onClick={refresh}
            className="btn btn-ghost btn-sm"
            title="Refresh data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bots Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="alert alert-warning max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No bots found matching your search.</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {currentItems.map((bot, index) => {
              const globalIndex = startIndex + index;
              const killColor = getKillColor(bot.totalKills);
              
              return (
                <div
                  key={bot.name + globalIndex}
                  className="card bg-base-100 border border-base-300 hover:border-accent transition-all hover:shadow-lg hover:scale-[1.02] group"
                >
                  <div className="card-body p-4 text-center">
                    {/* Bot Avatar */}
                    <div className="avatar placeholder flex justify-center">
                          <FaRobot className="w-20 h-20"/>
                    </div>
                    
                    {/* Bot Name */}
                    <h3 className="font-semibold text-sm truncate mt-1 group-hover:text-accent transition-colors">
                      {bot.name}
                    </h3>
                    
                    {/* Kills */}
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <FaSkull className="text-xs opacity-40" />
                      <span className={`text-xl font-bold ${killColor}`}>
                        {bot.totalKills}
                      </span>
                      <span className="text-xs opacity-40">kills</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full mt-2">
                      <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ 
                            width: `${maxKills > 0 ? (bot.totalKills / maxKills) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    className={`join-item btn btn-sm ${page === currentPage ? 'btn-active' : ''}`}
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    disabled={page === '...'}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  className="join-item btn btn-sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}

          {filteredAndSorted.length > 0 && (
            <div className="text-center text-sm opacity-60 mt-4">
              Showing {startIndex + 1} - {Math.min(endIndex, filteredAndSorted.length)} of {filteredAndSorted.length} bots
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}