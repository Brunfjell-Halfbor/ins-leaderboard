import { useEffect, useState } from "react";
import { playerService } from "../services/playerService";

export function usePlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    const response =
      await playerService.getPlayers();

    setPlayers(response.data);
    setLoading(false);
  }

  return {
    players,
    loading,
    refresh: loadPlayers,
  };
}