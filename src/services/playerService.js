import { apiResponse } from "./api";

const mockPlayers = [
  {
    steamId: "76561198000000001",
    username: "Ghost",
    level: 128,
    kills: 5412,
    deaths: 1298,
    playtime: 802,
    lastSeen: "2026-06-20T04:00:00Z",
  },
  {
    steamId: "76561198000000002",
    username: "Ranger",
    level: 117,
    kills: 4890,
    deaths: 1342,
    playtime: 691,
    lastSeen: "2026-06-19T16:30:00Z",
  },
];

export const playerService = {
  async getPlayers() {
    return apiResponse(mockPlayers);
  },

  async getPlayer(steamId) {
    const player = mockPlayers.find(
      (p) => p.steamId === steamId
    );

    return apiResponse(player);
  },
};