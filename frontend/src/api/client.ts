const BASE_URL =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

type FetchOptions = RequestInit & {
  // Add any custom options if needed
};

export const apiClient = async <TResponse>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<TResponse> => {
  const token = localStorage.getItem("access_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Attach the response to the error so we can read status codes in feature APIs
    const error = new Error("API request failed");
    (error as any).response = response;
    throw error;
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as TResponse;
  }

  return response.json();
};
