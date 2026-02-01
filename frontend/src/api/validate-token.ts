import type { UserResponse } from "../types";

const valditateToken = async (): Promise<UserResponse> => {
  try {
    const response = await fetch(`http://192.168.0.208:8000/users/me`, {
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
