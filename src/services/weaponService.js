import request from "./client";

export const weaponService = {
  async getWeapons() {
    return request("/weapons");
  },

  async getPlayerWeapons(steamId) {
    return request(`/players/${steamId}/weapons`);
  },
};