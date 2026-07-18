import {
    useEffect,
    useState
    } from "react";
    
    import {
    medicService
    } from "../services/medicService";
    
    
    export function useMedics(){
    
    const [medics,setMedics]=useState([]);
    
    const [loading,setLoading]=useState(true);
    
    const [error,setError]=useState(null);
    
    
    async function load(){
    
    try{
    
    setLoading(true);
    
    setMedics(
     await medicService.getLeaderboard()
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
     medics,
     loading,
     error,
     refresh:load
    };
    
    }