import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import { useMedics } from "../../hooks/useMedics";
import { FaCross, FaHeartbeat, FaClock } from "react-icons/fa";
import { MdMedication } from "react-icons/md";
import tugImage from "../../assets/images/tug.png";

const ITEMS_PER_PAGE = 10;

export default function MedicsPage() {
  const navigate = useNavigate();
  const { medics, loading, error, refresh } = useMedics();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMedics = useMemo(() => {
    if (!medics) return [];
    return medics.filter((medic) =>
      medic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medic.steamId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [medics, searchTerm]);

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate pagination
  const totalItems = filteredMedics.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentMedics = filteredMedics.slice(startIndex, endIndex);

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

  const formatTime = (seconds) => {
    if (!seconds) return "0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getRankColor = (index) => {
    if (index === 0) return "text-yellow-500";
    if (index === 1) return "text-gray-400";
    if (index === 2) return "text-amber-600";
    return "text-base-content/40";
  };

  const getRankBadge = (index) => {
    if (index === 0) return "bg-yellow-500/10 border-yellow-500/30";
    if (index === 1) return "bg-gray-400/10 border-gray-400/30";
    if (index === 2) return "bg-amber-600/10 border-amber-600/30";
    return "bg-base-300/30 border-base-300/30";
  };

  const handlePlayerClick = (steamId) => {
    navigate(`/player/${steamId}`);
  };

  if (loading) {
    return (
      <PageContainer title="Top Medics" subtitle="Players with most revives">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-accent" />
            <p className="text-sm opacity-60">Loading medics...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Top Medics" subtitle="Players with most revives">
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
    <PageContainer 
      title="Top Medics" 
      subtitle="Players with most revives"
    >
      {/* Stats and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
          <div className="flex items-center gap-1 sm:gap-2 opacity-60">
            <MdMedication className="text-base sm:text-lg" />
            <span className="hidden xs:inline">Total Medics:</span>
            <span className="font-bold text-accent">{filteredMedics.length}</span>
          </div>
          <div className="hidden sm:block divider divider-horizontal" />
          <div className="flex items-center gap-1 sm:gap-2 opacity-60">
            <span className="hidden xs:inline">Showing:</span>
            <span className="font-bold text-accent">
              {totalItems > 0 ? `${startIndex + 1}-${endIndex}` : '0'}
            </span>
            <span className="hidden xs:inline">of {totalItems}</span>
          </div>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search medics..."
            className="input input-bordered w-full bg-base-200 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Medics Grid */}
      {filteredMedics.length === 0 ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="alert alert-warning max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No medics found matching your search.</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentMedics.map((medic, index) => {
              const globalIndex = startIndex + index;
              const rankColor = getRankColor(globalIndex);
              const rankBadge = getRankBadge(globalIndex);
              
              return (
                <div
                  key={medic.steamId}
                  onClick={() => handlePlayerClick(medic.steamId)}
                  className="card bg-base-100 shadow-md border border-base-300 hover:border-accent transition-all hover:shadow-xl hover:scale-[1.01] cursor-pointer group"
                >
                  <div className="card-body p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-5">
                      {/* Rank */}
                      <div className="flex flex-col items-center min-w-[30px] sm:min-w-[45px]">
                        <div className={`text-lg sm:text-2xl font-bold ${rankColor}`}>
                          #{globalIndex + 1}
                        </div>
                        <div className={`w-6 sm:w-8 h-0.5 rounded-full mt-0.5 sm:mt-1 ${rankBadge.replace('border', 'bg').replace('/30', '')}`} />
                      </div>

                      {/* Avatar */}
                      <div className="avatar">
                        <div className="w-12 sm:w-16 rounded-full ring ring-accent/30 ring-offset-2 ring-offset-base-100 group-hover:ring-accent/50 transition-all">
                          <img
                            src={medic.avatar || tugImage}
                            alt={medic.name || medic.steamId}
                            onError={(e) => { e.target.src = tugImage; }}
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate text-base sm:text-lg group-hover:text-accent transition-colors">
                          {medic.name || "Unknown Player"}
                        </h3>
                        <p className="text-xs opacity-40 truncate font-mono">
                          {medic.steamId}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1.5 sm:mt-2.5">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <FaHeartbeat className="text-error text-xs sm:text-sm" />
                            <span className="font-mono font-bold text-base sm:text-lg text-accent">
                              {medic.medicTime || 0}
                            </span>
                            <span className="text-[10px] sm:text-xs opacity-50">revives</span>
                          </div>
                          <div className="hidden xs:block divider divider-horizontal" />
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <FaClock className="text-info text-xs sm:text-sm" />
                            <span className="text-xs sm:text-sm opacity-70">
                              {formatTime((medic.medicTime || 0) * 30)}
                            </span>
                            <span className="text-[10px] sm:text-xs opacity-40">avg</span>
                          </div>
                        </div>
                      </div>

                      {/* Medic Icon - Hidden on mobile */}
                      <div className="hidden sm:block text-3xl opacity-10 group-hover:opacity-20 transition-all">
                        <FaCross />
                      </div>
                    </div>
                  </div>
                </div>
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
          {filteredMedics.length > 0 && (
            <div className="text-center text-sm opacity-60 mt-4">
              Showing {startIndex + 1} - {Math.min(endIndex, filteredMedics.length)} of {filteredMedics.length} medics
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}