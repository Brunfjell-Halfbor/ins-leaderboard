import {
    useEffect,
    useState
    } from "react";
    
    import {
    weaponService
    } from "../services/weaponService";
    
    
    export function useWeapons(){
    
    const [weapons,setWeapons]=useState([]);
    
    const [loading,setLoading]=useState(true);
    
    const [error,setError]=useState(null);
    
    
    
    const load =
    async()=>{
    
    try{
    
    setLoading(true);
    
    setWeapons(
     await weaponService.getWeapons()
    );
    
    
    }catch(e){
    
    setError(e.message);
    
    }finally{
    
    setLoading(false);
    
    }
    
    };
    
    
    useEffect(()=>{
    load();
    },[]);
    
    
    
    return {
     weapons,
     loading,
     error,
     refresh:load
    };
    
    }