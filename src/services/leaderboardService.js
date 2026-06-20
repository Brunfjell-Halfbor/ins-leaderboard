import { apiResponse } from "./api";

const mockLeaderboard = [
  {
    rank: 1,
    steamId: "76561198000000001",
    player: "Ghost",
    score: 125432,
    kills: 5412,
    deaths: 1298,
    kd: 4.17,
  },
  {
    rank: 2,
    steamId: "76561198000000002",
    player: "Ranger",
    score: 118900,
    kills: 4890,
    deaths: 1342,
    kd: 3.64,
  },
  {
    rank: 3,
    steamId: "76561198000000003",
    player: "MedicMike",
    score: 101210,
    kills: 4011,
    deaths: 1110,
    kd: 3.61,
  },
];

export const leaderboardService = {
  async getLeaderboard() {
    return apiResponse(mockLeaderboard);
  },
};