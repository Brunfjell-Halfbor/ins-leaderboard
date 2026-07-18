import { useCallback, useEffect, useState, } from "react";
import { playerService } from "../services/playerService";
  
export function usePlayers() {

    const [players, setPlayers] = useState([]);
    const [loading, setLoading] =useState(true);
    const [error, setError] = useState(null);
    const loadPlayers = useCallback(async () => {

        try {
            setLoading(true);
            setError(null);

            const data = await playerService.getPlayers();

            setPlayers(data);
        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }, []);

    useEffect(() => {
        loadPlayers();
    }, [loadPlayers]);

    return {
        players,
        loading,
        error,
        refresh: loadPlayers,
    };
}