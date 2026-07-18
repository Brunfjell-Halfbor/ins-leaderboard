import { useState, useMemo } from "react";
import { useMatches } from "../../hooks/useMatches";

export default function PlayerHistory({ playerId }) {
  const { matches, loading, error } = useMatches();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const playerMatches = useMemo(() => {
    if (!matches || matches.length === 0) return [];
    
    const filtered = matches.filter(match => {
      if (match.players) {
        return match.players.some(p => p.steamId === playerId || p.id === playerId);
      }
      if (match.playerId) {
        return match.playerId === playerId;
      }
      if (match.steamId) {
        return match.steamId === playerId;
      }
      return true;
    });
    
    return filtered.map((match, index) => ({
      id: match.id || `match-${index}`,
      date: match.playedAt,
      map: match.map,
      result: match.win ? "Win" : "Loss",
    }));
  }, [matches, playerId]);

  const totalPages = Math.ceil(playerMatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = playerMatches.slice(startIndex, endIndex);

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

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body p-4">
          <div className="flex items-center justify-center py-8">
            <span className="loading loading-spinner loading-md text-accent" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body p-4">
          <div className="text-center py-8 text-error">
            Error loading match history: {error}
          </div>
        </div>
      </div>
    );
  }

  if (playerMatches.length === 0) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body p-4">
          <div className="text-center py-8 opacity-60">
            No match history available for this player
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body p-0">
          <div className="hidden sm:block overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Map</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((match) => (
                  <tr key={match.id}>
                    <td>
                      <div className="text-sm">
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs opacity-60">
                        {new Date(match.date).toLocaleTimeString()}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm">
                        {match.map}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-sm ${
                        match.result === "Win" 
                          ? "badge-success" 
                          : "badge-error"
                      }`}>
                        {match.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3 p-4">
            {currentItems.map((match) => (
              <div
                key={match.id}
                className="card bg-base-200 border border-base-300 rounded-box"
              >
                <div className="card-body p-3">
                  <div className="flex items-center justify-between">
                    <div className={`badge ${
                      match.result === "Win" 
                        ? "badge-success" 
                        : "badge-error"
                    }`}>
                      {match.result}
                    </div>
                    <div>
                      <div className="text-xs opacity-60">
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="stat bg-base-100 rounded-box p-2">
                      <div className="stat-title text-xs">Map</div>
                      <div className="stat-value text-sm font-semibold">
                        {match.map}
                      </div>
                    </div>
                    <div className="stat bg-base-100 rounded-box p-2">
                      <div className="stat-title text-xs">Result</div>
                      <div className={`stat-value text-sm font-semibold ${
                        match.result === "Win" 
                          ? "text-success" 
                          : "text-error"
                      }`}>
                        {match.result}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
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

      <div className="text-center text-sm opacity-60">
        Showing {startIndex + 1} - {Math.min(endIndex, playerMatches.length)} of {playerMatches.length} matches
      </div>
    </div>
  );
}