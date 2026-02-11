import type { UserResponse } from "../../types";

const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const valditateToken = async (): Promise<UserResponse> => {
  try {
    const response = await fetch(`${apiUrl}/users/me`, {
      method: "Get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      const error = new Error("Failed to validate token") as any;
      error.status = response.status;
      throw error;
    }

    const data = await response.json();

    console.log("Server response:", data);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default valditateToken;
