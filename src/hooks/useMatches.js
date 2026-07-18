import {
    useEffect,
    useState
    } from "react";
    
    import {
    matchService
    } from "../services/matchService";
    
    
    export function useMatches(){
    
    const [matches,setMatches]=useState([]);
    
    const [loading,setLoading]=useState(true);
    
    const [error,setError]=useState(null);
    
    
    
    async function load(){
    
    try{
    
    setLoading(true);
    
    setMatches(
     await matchService.getMatches()
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
     matches,
     loading,
     error,
     refresh:load
    };
    
    }