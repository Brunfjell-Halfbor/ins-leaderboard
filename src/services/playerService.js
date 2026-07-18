import request from "./client";


function normalizePlayer(player) {
  return {
    steamId:
      player.steamId ??
      player.steam_id ??
      null,

    profile: {
      name:
        player.profile?.name ??
        "Unknown",

      avatar:
        player.profile?.avatar ??
        null,

      profileUrl:
        player.profile?.profileUrl ??
        null,
    },

    stats: {
      kills:
        player.stats?.kills ??
        0,

      deaths:
        player.stats?.deaths ??
        0,

      wins:
        player.stats?.wins ??
        0,

      losses:
        player.stats?.losses ??
        0,

      score:
        player.stats?.score ??
        0,

      killstreak:
        player.stats?.killstreak ??
        0,

      caps:
        player.stats?.caps ??
        0,

      suicides:
        player.stats?.suicides ??
        0,

      suppressions:
        player.stats?.suppressions ??
        0,

      headshotsGiven:
        player.stats?.headshotsGiven ??
        player.stats?.headshot_given ??
        0,

      headshotsTaken:
        player.stats?.headshotsTaken ??
        player.stats?.headshot_taken ??
        0,
    },

    createdAt:
      player.createdAt ??
      player.created_at ??
      null,

    updatedAt:
      player.updatedAt ??
      player.updated_at ??
      null,
  };
}

function normalizeWeapon(weapon) {
  return {
    weaponName: weapon.weaponName ?? weapon.weapon_name,
    kills: weapon.kills ?? weapon.kill_count ?? 0,
  };
}

export const playerService = {

  async getPlayers() {
    const players =
      await request("/players");

    return players.map(normalizePlayer);
  },


  async getPlayer(steamId) {
    const player =
      await request(
        `/players/${steamId}`
      );

    return normalizePlayer(player);
  },
  
  async getWeapons(steamId) {
    const weapons = await request(
      `/players/${steamId}/weapons`
    );
  
    return weapons.map(normalizeWeapon);
  }

};