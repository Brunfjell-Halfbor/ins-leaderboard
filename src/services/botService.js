import request from "./client";

export const botService = {
  async getBots() {
    return request("/bots");
  },
};