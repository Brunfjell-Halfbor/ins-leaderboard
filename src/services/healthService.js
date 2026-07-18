import request from "./client";

export const healthService = {
  async getHealth() {
    return request("/health");
  },
};