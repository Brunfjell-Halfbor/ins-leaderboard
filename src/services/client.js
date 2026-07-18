const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001/api";

async function request(endpoint) {
  const response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Backend returned invalid JSON"
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
      `Request failed (${response.status})`
    );
  }

  return data.data;
}

export default request;