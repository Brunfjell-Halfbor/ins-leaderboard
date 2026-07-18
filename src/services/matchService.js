import request from "./client";

export const matchService = {
  async getMatches() {
    return request("/matches");
  },
};