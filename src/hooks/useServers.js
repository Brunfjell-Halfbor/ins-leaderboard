import { useEffect, useState } from "react";
import { serverService } from "../services/serverService";

export function useServers() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServers();
  }, []);

  async function loadServers() {
    const response =
      await serverService.getServers();

    setServers(response.data);
    setLoading(false);
  }

  return {
    servers,
    loading,
    refresh: loadServers,
  };
}