import request from "./client";

export const teamkillService = {
  async getLeaderboard() {
    return request(
      "/leaderboards/teamkills"
    );
  },
};