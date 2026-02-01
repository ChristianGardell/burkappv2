import type { LogOptions } from "vite";
import type { LoginResponse, UserCreate, UserResponse } from "../types";

const createUser = async (user: UserCreate): Promise<LoginResponse> => {
  try {
    const response = await fetch(`http://192.168.0.208:8000/users/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const error = new Error("Failed to create user") as any;
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

export default createUser;
