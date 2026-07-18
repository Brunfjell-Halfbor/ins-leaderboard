import { useEffect, useState, } from "react";
import { playerService } from "../services/playerService";


export function usePlayer( steamId ){

    const [player,setPlayer] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(()=>{

        if(!steamId) return;

        async function load(){
            try{
                setLoading(true);
                const data = await playerService.getPlayer( steamId );

                setPlayer(data);
            }catch(err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        }

        load();
    },[steamId]);

    return { player, loading, error };
}