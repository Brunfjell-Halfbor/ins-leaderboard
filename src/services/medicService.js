import request from "./client";

export const medicService = {
  async getLeaderboard() {
    return request(
      "/leaderboards/medics"
    );
  },
};