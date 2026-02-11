import type { UserResponse } from "../../types";

const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const decrementBeer = async (): Promise<UserResponse> => {
  const response = await fetch(`${apiUrl}/users/decrement`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!response.ok) throw new Error("Failed to decrement beer");

  const data = await response.json();
  return data;
};

export default decrementBeer;
