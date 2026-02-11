import type { LoginResponse, UserLogin } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const loginUser = async (user: UserLogin): Promise<LoginResponse> => {
  const response = await fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (response.status === 401) {
    throw new Error("Incorrect PIN");
  }
  if (response.status === 404) {
    throw new Error("Should not be possible through UI");
  }
  if (!response.ok) {
    const error = new Error("Server error") as any;
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  return data;
};

export default loginUser;
