import {
    useEffect,
    useState
    } from "react";
    
    import {
    botService
    } from "../services/botService";
    
    
    export function useBots(){
    
    const [bots,setBots]=useState([]);
    
    const [loading,setLoading]=useState(true);
    
    const [error,setError]=useState(null);
    
    
    async function load(){
    
    try{
    
    setLoading(true);
    
    setBots(
     await botService.getBots()
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
     bots,
     loading,
     error,
     refresh:load
    };
    
    }