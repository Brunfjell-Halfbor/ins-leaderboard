import { useEffect, useState } from "react";
import { weaponService } from "../services/weaponService";

export function usePlayerWeapons(steamId) {
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!steamId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await weaponService.getPlayerWeapons(steamId);
      const sortedWeapons = data
        .sort((a, b) => b.kills - a.kills)
        .slice(0, 50);
      setWeapons(sortedWeapons);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [steamId]);

  return {
    weapons,
    loading,
    error,
    refresh: load
  };
}