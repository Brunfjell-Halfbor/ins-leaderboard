import { apiResponse } from "./api";

const mockServers = [
  {
    id: 1,
    name: "TUG COOP #1",
    map: "Sinjar",
    players: 28,
    maxPlayers: 32,
    status: "online",
  },
  {
    id: 2,
    name: "TUG COOP #2",
    map: "Ministry",
    players: 22,
    maxPlayers: 32,
    status: "online",
  },
];

export const serverService = {
  async getServers() {
    return apiResponse(mockServers);
  },
};