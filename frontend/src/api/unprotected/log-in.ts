import type { LoginResponse, UserLoginRequest } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const loginUser = async (user: UserLoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (response.status === 401) {
    throw new Error("Incorrect PIN");
  }
  if (response.status === 404) {
    throw new Error("Incorrect phone number");
  }
  if (response.status === 429) {
    throw new Error("Too many requests, try again later");
  }
  if (!response.ok) {
    const error = new Error("Server error");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).status = response.status;
    throw error;
  }
  const data = await response.json();
  return data;
};

export default loginUser;
