import {
    useEffect,
    useState
    } from "react";
    
    import {
    teamkillService
    } from "../services/teamkillService";
    
    
    export function useTeamKills(){
    
    const [teamKills,setTeamKills]=useState([]);
    
    const [loading,setLoading]=useState(true);
    
    const [error,setError]=useState(null);
    
    
    async function load(){
    
    try{
    
    setLoading(true);
    
    setTeamKills(
     await teamkillService.getLeaderboard()
    );
    
    
    }catch(e){
    
    setError(e.message);
    
    }finally{
    
    setLoading(false);
    
    }
    
    }
    
    
    useEffect(()=>{
    load();
    },[]);
    
    
    
    return {
     teamKills,
     loading,
     error,
     refresh:load
    };
    
    }