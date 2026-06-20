import { useEffect, useState } from "react";
import { leaderboardService } from "../services/leaderboardService";

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    try {
      setLoading(true);

      const response =
        await leaderboardService.getLeaderboard();

      setLeaderboard(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    leaderboard,
    loading,
    error,
    refresh: loadLeaderboard,
  };
}