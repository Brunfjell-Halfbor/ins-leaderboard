import { useState, useEffect, useMemo } from "react";
import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/ui/SearchBar";
import { useWeapons } from "../../hooks/useWeapons";
import { formatDate } from "../../utils/formatDate";
import { 
  FaCrosshairs, 
  FaSkull, 
  FaHeartbeat,
  FaFire,
  FaBullseye,
  FaTrophy
} from "react-icons/fa";
import { GiCrossedSwords, GiHeadshot } from "react-icons/gi";

export default function WeaponsPage() {
  const { weapons, loading, error, refresh } = useWeapons();
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

  // Normalize weapon data
  const normalizedWeapons = useMemo(() => {
    if (!weapons) return [];
    
    return weapons.map(weapon => ({
      name: weapon.name || weapon.weaponName || "Unknown Weapon",
      kills: weapon.kills || 0,
      deaths: weapon.deaths || 0,
      headshots: weapon.headshots || weapon.headshotGiven || 0,
      shots: weapon.shots || weapon.shotsFired || 0,
      hits: weapon.hits || weapon.shotsHit || 0,
      playTime: weapon.playTime || weapon.timeUsed || 0,
      killstreak: weapon.killstreak || weapon.bestKillstreak || 0,
      lastUsed: weapon.lastUsed || weapon.lastSeen || null,
      // Calculate derived stats
      accuracy: weapon.shots && weapon.shots > 0 
        ? Math.round(((weapon.hits || 0) / weapon.shots) * 100) 
        : 0,
      headshotPercentage: weapon.kills && weapon.kills > 0 
        ? Math.round(((weapon.headshots || 0) / weapon.kills) * 100) 
        : 0,
      kdRatio: weapon.deaths && weapon.deaths > 0 
        ? (weapon.kills / weapon.deaths).toFixed(2) 
        : weapon.kills > 0 
          ? weapon.kills.toFixed(2) 
          : "0.00",
    }));
  }, [weapons]);

  // Filter weapons
  const filtered = useMemo(() => {
    if (!normalizedWeapons) return [];
    
    if (!debouncedSearch.trim()) {
      return normalizedWeapons;
    }

    const searchLower = debouncedSearch.toLowerCase().trim();
    
    return normalizedWeapons.filter((weapon) => {
      const nameMatch = weapon.name?.toLowerCase().includes(searchLower) || false;
      return nameMatch;
    });
  }, [normalizedWeapons, debouncedSearch]);

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
      <PageContainer title="Weapons" subtitle="Weapon performance statistics">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-accent" />
            <p className="text-sm opacity-60">Loading weapon data...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Weapons" subtitle="Weapon performance statistics">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="alert alert-error max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error loading weapon data: {error}</span>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Calculate stats
  const totalKills = normalizedWeapons?.reduce((sum, w) => sum + (w.kills || 0), 0) || 0;
  const totalHeadshots = normalizedWeapons?.reduce((sum, w) => sum + (w.headshots || 0), 0) || 0;
  const totalWeapons = normalizedWeapons?.length || 0;
  const avgAccuracy = normalizedWeapons?.reduce((sum, w) => sum + (w.accuracy || 0), 0) / (totalWeapons || 1);

  console.log("WeaponsPage Rendered: ", {
    totalKills,
    totalHeadshots,
    totalWeapons,
    avgAccuracy
  });
  return (
    <PageContainer
      title="Weapons"
      subtitle="Weapon performance statistics"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 border border-base-300 rounded-box p-4">
          <div className="stat-title text-xs flex items-center gap-1 opacity-60">
            <GiCrossedSwords /> Total Weapons
          </div>
          <div className="stat-value text-2xl font-bold text-accent">
            {totalWeapons}
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
            <GiHeadshot /> Total Headshots
          </div>
          <div className="stat-value text-2xl font-bold text-info">
            {totalHeadshots.toLocaleString()}
          </div>
        </div>
        <div className="stat bg-base-100 border border-base-300 rounded-box p-4">
          <div className="stat-title text-xs flex items-center gap-1 opacity-60">
            <FaBullseye /> Avg Accuracy
          </div>
          <div className="stat-value text-2xl font-bold text-success">
            {Math.round(avgAccuracy)}%
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search weapons by name..."
        />
      </div>

      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-sm opacity-60">
          Found {filtered.length} weapon{filtered.length !== 1 ? "s" : ""}
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
              <th>Weapon</th>
              <th>Kills</th>
              <th>Headshots</th>
              <th>HS %</th>
              <th>Accuracy</th>
              <th className="hidden lg:table-cell">K/D</th>
              <th className="hidden md:table-cell">Last Used</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-base-content/60">
                  No weapons found matching your search
                </td>
              </tr>
            ) : (
              currentItems.map((weapon, index) => {
                const globalIndex = startIndex + index;
                const rankColor = getRankColor(globalIndex);
                const rankBadge = getRankBadgeClass(globalIndex);
                
                return (
                  <tr 
                    key={weapon.name || index}
                    className="hover:bg-base-200 transition-colors"
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
                        <div>
                          <div className="font-bold">{weapon.name}</div>
                          <div className="text-xs opacity-60">
                            {weapon.shots || 0} shots
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-error badge-lg">
                        {weapon.kills || 0}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info badge-lg">
                        {weapon.headshots || 0}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-base badge-outline">
                        {weapon.headshotPercentage || 0}%
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{weapon.accuracy || 0}%</span>
                        <progress 
                          className="progress progress-accent w-16" 
                          value={weapon.accuracy || 0} 
                          max="100"
                        />
                      </div>
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className="badge badge-base badge-outline">
                        {weapon.kdRatio || "0.00"}
                      </span>
                    </td>
                    <td className="hidden md:table-cell">
                      {safeFormatDate(weapon.lastUsed)}
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
            No weapons found matching your search
          </div>
        ) : (
          currentItems.map((weapon, index) => {
            const globalIndex = startIndex + index;
            const rankColor = getRankColor(globalIndex);
            
            return (
              <div
                key={weapon.name || index}
                className="card bg-base-100 border border-base-300 rounded-box hover:border-accent transition-colors"
              >
                <div className="card-body p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="avatar placeholder">
                      <div className="w-12 rounded-full bg-accent/20 ring ring-accent/30 ring-offset-2 ring-offset-base-100">
                        <span className="text-xl">
                          <FaCrosshairs />
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${rankColor}`}>#{globalIndex + 1}</span>
                        <span className="font-bold">{weapon.name}</span>
                      </div>
                      <div className="text-xs opacity-60">{weapon.shots || 0} shots fired</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">Kills</div>
                      <div className="stat-value text-lg font-bold text-error">
                        {weapon.kills || 0}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">Headshots</div>
                      <div className="stat-value text-lg font-bold text-info">
                        {weapon.headshots || 0}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">HS %</div>
                      <div className="stat-value text-lg font-bold text-accent">
                        {weapon.headshotPercentage || 0}%
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">Accuracy</div>
                      <div className="stat-value text-lg font-bold text-success">
                        {weapon.accuracy || 0}%
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">K/D</div>
                      <div className="stat-value text-lg">
                        {weapon.kdRatio || "0.00"}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box p-2">
                      <div className="stat-title text-xs">Last Used</div>
                      <div className="stat-value text-xs">{safeFormatDate(weapon.lastUsed)}</div>
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
          Showing {startIndex + 1} - {Math.min(endIndex, filtered.length)} of {filtered.length} weapons
        </div>
      )}
    </PageContainer>
  );
}