import type { LoginResponse, UserLogin, UserResponse } from "../types";
const apiUrl = import.meta.env.VITE_BACKEND_SERVER_URL || 'http://localhost:8000';

import { useAuth } from "../context/AuthContext";

const loginUser = async (user: UserLogin): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${apiUrl}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const error = new Error("Failed to log in user") as any;
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

export default loginUser;
