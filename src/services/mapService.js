import request from "./client";

export const mapService = {
  async getMaps() {
    return request("/maps");
  },
};