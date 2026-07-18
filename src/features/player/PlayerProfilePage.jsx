import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import {FaSteam,FaIdBadge,FaCalendarAlt,FaClock,FaCrosshairs,FaSkull,FaHeartbeat,FaFire,FaShieldAlt,FaTrophy,FaStar,FaGamepad,FaFlag,FaUserSlash} from "react-icons/fa";
import {GiCrossedSwords,GiHeadshot} from "react-icons/gi";
import {MdScoreboard} from "react-icons/md";
import PlayerHistory from "./PlayerHistory";
import { playerService } from "../../services/playerService";
import { weaponService } from "../../services/weaponService";
import { teamkillService } from "../../services/teamkillService";
import tugImage from "../../assets/images/tug.png";

export default function PlayerProfilePage() {
  const { steamId } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weapons, setWeapons] = useState([]);
  const [weaponsLoading, setWeaponsLoading] = useState(true);
  const [weaponsError, setWeaponsError] = useState(null);
  const [weaponsPage, setWeaponsPage] = useState(1);
  const [teamKills, setTeamKills] = useState([]);
  const [teamKillsLoading, setTeamKillsLoading] = useState(true);
  const [teamKillsError, setTeamKillsError] = useState(null);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    async function loadPlayer() {
      try {
        setLoading(true);
        const data = await playerService.getPlayer(steamId);
        setPlayer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPlayer();
  }, [steamId]);

  useEffect(() => {
    async function loadPlayerWeapons() {
      try {
        setWeaponsLoading(true);
        const data = await playerService.getWeapons(steamId);
        const sortedWeapons = data
          .sort((a, b) => b.kill_count - a.kill_count);
        setWeapons(sortedWeapons);
        setWeaponsPage(1);
      } catch (err) {
        setWeaponsError(err.message);
      } finally {
        setWeaponsLoading(false);
      }
    }
    
    if (steamId) {
      loadPlayerWeapons();
    }
  }, [steamId]);

  useEffect(() => {
    async function loadTeamKills() {
      try {
        setTeamKillsLoading(true);
        const data = await teamkillService.getLeaderboard();
        const playerTeamKills = data.find(item => item.steam_id === steamId);
        setTeamKills(playerTeamKills || { team_kills: 0 });
      } catch (err) {
        setTeamKillsError(err.message);
      } finally {
        setTeamKillsLoading(false);
      }
    }
    
    if (steamId) {
      loadTeamKills();
    }
  }, [steamId]);

  // Pagination calculations
  const totalPages = Math.ceil(weapons.length / ITEMS_PER_PAGE);
  const startIndex = (weaponsPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentWeapons = weapons.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setWeaponsPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-accent" />
          <p className="text-sm opacity-60">Loading player profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="alert alert-warning max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Player not found</span>
        </div>
      </div>
    );
  }

  const profile = player.profile || {};
  const stats = player.stats || {};
  
  const totalGames = (stats.wins || 0) + (stats.losses || 0);
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;
  const kdRatio = stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : (stats.kills || 0).toFixed(2);
  
  const hsPercentage = stats.headshotsGiven && stats.kills > 0
    ? Math.round((stats.headshotsGiven / stats.kills) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden relative">
        <div 
          className="absolute inset-0 opacity-90 pointer-events-none"
          style={{
            backgroundImage: `url(${profile.avatar || tugImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center left',
            maskImage: 'linear-gradient(to right, black 0%, black 30%, transparent 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 0%, black 30%, transparent 70%, transparent 100%)',
          }}
        />
        
        <div className="absolute inset-0 bg-base-100/90 pointer-events-none" />
        
        <div className="card-body p-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="avatar">
              <div className="w-20 sm:w-24 rounded-full ring ring-accent ring-offset-2 ring-offset-base-100">
                <img 
                  src={profile.avatar || tugImage} 
                  alt={profile.name || player.steamId} 
                  onError={(e) => { e.target.src = tugImage; }}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold truncate text-white">
                  {profile.name || player.steamId}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <FaIdBadge className="text-xs text-white" />
                <span className="text-sm text-white">Steam ID:</span>
                <a href={`https://steamcommunity.com/profiles/${player.steamId}`} target="_blank" rel="noopener noreferrer">
                  <code className="text-xs bg-base-200 px-2 py-1 rounded font-mono break-all text-white">
                    <FaSteam className="inline-block mr-1 text-white" />
                    {player.steamId}
                  </code>
                </a>
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-white" />
                  <span className="text-white">Joined:</span>
                  <span className="text-white">{formatDate(player.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClock className="text-white" />
                  <span className="text-white">Last active:</span>
                  <span className="text-white">{formatDate(player.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 sm:ml-auto w-full sm:w-auto">
              <div className="stat bg-base-200 rounded-box p-3 flex-1 sm:flex-none min-w-20">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <MdScoreboard /> Score
                </div>
                <div className="stat-value text-lg font-bold text-white">
                  {stats.score?.toLocaleString() || 0}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-box p-3 flex-1 sm:flex-none min-w-20">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <FaCrosshairs /> K/D
                </div>
                <div className="stat-value text-lg font-bold text-white">
                  {kdRatio}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-box p-3 flex-1 sm:flex-none min-w-20">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <FaTrophy /> Win Rate
                </div>
                <div className="stat-value text-lg font-bold text-white">
                  {winRate}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body p-4">
            <h3 className="card-title text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              Combat Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="stat bg-base-200 rounded-box p-2">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <FaCrosshairs /> Kills
                </div>
                <div className="stat-value text-lg text-white">{stats.kills?.toLocaleString() || 0}</div>
              </div>
              <div className="stat bg-base-200 rounded-box p-2">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <FaSkull /> Deaths
                </div>
                <div className="stat-value text-lg text-white">{stats.deaths?.toLocaleString() || 0}</div>
              </div>
              <div className="stat bg-base-200 rounded-box p-2">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <FaHeartbeat /> Suicides
                </div>
                <div className="stat-value text-lg text-white">{stats.suicides?.toLocaleString() || 0}</div>
              </div>
              <div className="stat bg-base-200 rounded-box p-2">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <FaFire /> Killstreak
                </div>
                <div className="stat-value text-lg text-white">{stats.killstreak || 0}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body p-4">
            <h3 className="card-title text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              Accuracy Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="stat bg-base-200 rounded-box p-2">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <GiHeadshot /> Headshots
                </div>
                <div className="stat-value text-lg text-white">{stats.headshotsGiven?.toLocaleString() || 0}</div>
              </div>
              <div className="stat bg-base-200 rounded-box p-2">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <FaShieldAlt /> HS Taken
                </div>
                <div className="stat-value text-lg text-white">{stats.headshotsTaken?.toLocaleString() || 0}</div>
              </div>
              <div className="stat bg-base-200 rounded-box p-2 col-span-2">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <GiCrossedSwords /> Headshot Percentage
                </div>
                <div className="stat-value text-lg text-white">{hsPercentage}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body p-4">
            <h3 className="card-title text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              Match Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="stat bg-base-200 rounded-box p-2">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <FaStar /> Wins
                </div>
                <div className="stat-value text-lg text-white">{stats.wins || 0}</div>
              </div>
              <div className="stat bg-base-200 rounded-box p-2">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <FaSkull /> Losses
                </div>
                <div className="stat-value text-lg text-white">{stats.losses || 0}</div>
              </div>
              <div className="stat bg-base-200 rounded-box p-2 col-span-2">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <FaGamepad /> Total Games
                </div>
                <div className="stat-value text-lg text-white">{totalGames}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body p-4">
            <h3 className="card-title text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              TK Stats
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="stat bg-base-200 rounded-box p-2">
                <div className="stat-title text-xs flex items-center gap-1 text-white">
                  <FaUserSlash /> Team Kills
                </div>
                {teamKillsLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <span className="loading loading-spinner loading-sm text-accent" />
                  </div>
                ) : teamKillsError ? (
                  <div className="text-error text-sm">{teamKillsError}</div>
                ) : (
                  <div className="stat-value text-lg text-white">{teamKills.tk_given || 0}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-md border border-base-300 hover:border-accent transition-colors">
          <div className="card-body p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white flex items-center gap-2">
                <FaFlag /> Suppressions
              </span>
              <span className="text-lg font-bold text-white">{stats.suppressions?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-md border border-base-300 hover:border-accent transition-colors">
          <div className="card-body p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white flex items-center gap-2">
                <FaFlag /> Captures
              </span>
              <span className="text-lg font-bold text-white">{stats.caps?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-md border border-base-300 hover:border-accent transition-colors">
          <div className="card-body p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white flex items-center gap-2">
                <FaFire /> Killstreak Best
              </span>
              <span className="text-lg font-bold text-white">{stats.killstreak || 0}</span>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-md border border-base-300 hover:border-accent transition-colors">
          <div className="card-body p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white flex items-center gap-2">
                <MdScoreboard /> Total Score
              </span>
              <span className="text-lg font-bold text-white">{stats.score?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weapons and Player History in a row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Weapons Section - 1/3 */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-md border border-base-300 h-full">
            <div className="card-body p-4">
              <h3 className="card-title text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                <FaFire /> Top Weapons
              </h3>
              
              {weaponsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <span className="loading loading-spinner loading-sm text-accent" />
                </div>
              ) : weaponsError ? (
                <div className="text-error text-sm py-2">{weaponsError}</div>
              ) : weapons.length === 0 ? (
                <div className="text-sm text-white py-2">No weapon data available</div>
              ) : (
                <>
                  <div className="space-y-2">
                    {currentWeapons.map((weapon, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between bg-base-200 rounded-lg p-3 hover:bg-base-300 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="badge badge-accent badge-sm">{startIndex + index + 1}</span>
                          <span className="text-sm font-medium text-white">{weapon.weaponName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCrosshairs className="text-xs text-white" />
                          <span className="text-sm font-bold text-white">{weapon.kill_count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <button
                        onClick={() => handlePageChange(weaponsPage - 1)}
                        disabled={weaponsPage === 1}
                        className="btn btn-ghost btn-xs text-white disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-white">
                        Page {weaponsPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(weaponsPage + 1)}
                        disabled={weaponsPage === totalPages}
                        className="btn btn-ghost btn-xs text-white disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Player History Section - 2/3 */}
        <div className="lg:col-span-2">
          <PlayerHistory playerId={steamId} />
        </div>
      </div>
    </div>
  );
}