import {
    useEffect,
    useState
   } from "react";
   
   import {
    mapService
   } from "../services/mapService";
   
   
   export function useMaps(){
   
    const [maps,setMaps]=useState([]);
   
    const [loading,setLoading]=useState(true);
   
    const [error,setError]=useState(null);
   
   
    async function load(){
   
      try{
   
       setLoading(true);
   
       setMaps(
         await mapService.getMaps()
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
      maps,
      loading,
      error,
      refresh:load
    };
   
   }