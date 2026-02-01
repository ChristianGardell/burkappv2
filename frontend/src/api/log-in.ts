import type { LoginResponse, UserLogin, UserResponse } from "../types";
import { useAuth } from "../context/AuthContext";

const loginUser = async (user: UserLogin): Promise<LoginResponse> => {
  try {
    const response = await fetch(`http://192.168.0.208:8000/users/login`, {
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
