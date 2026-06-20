import { API_DELAY } from "../utils/constants";

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function apiResponse(data) {
  await sleep(API_DELAY);

  return {
    success: true,
    data,
    timestamp: Date.now(),
  };
}