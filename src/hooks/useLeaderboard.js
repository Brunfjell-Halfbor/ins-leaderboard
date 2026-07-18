import { useMemo, useState } from "react";
import { usePlayers } from "./usePlayers";
   
   
export function useLeaderboard(initialSort="score"){
   
    const {
      players,
      loading,
      error,
      refresh
    } = usePlayers();
   
    const [sort,setSort] =
      useState(initialSort);
   
    const leaderboard =
      useMemo(()=>{
   
   
       const sorted =
         [...players].sort(
           (a,b)=>{
   
             return (
               b[sort] -
               a[sort]
             );
   
           }
         );
   
   
       return sorted.map(
         (player,index)=>({
   
           ...player,
   
           rank:index+1,
   
           kd:
             player.deaths > 0
             ?
             Number(
               (
                player.kills /
                player.deaths
               ).toFixed(2)
             )
             :
             player.kills
   
         })
       );
   
   
      },[
       players,
       sort
      ]);
   
   
   
    return {
      leaderboard,
   
      loading,
      error,
   
      sort,
      setSort,
   
      refresh
    };
   
   }