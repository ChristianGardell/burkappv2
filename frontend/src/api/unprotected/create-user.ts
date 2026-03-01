import type { LoginResponse, UserCreateRequest } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const createUser = async (user: UserCreateRequest): Promise<LoginResponse> => {
  const response = await fetch(`${apiUrl}/users/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (response.status === 409) {
    throw new Error("User already exists. Please log in.");
  }
  if (response.status === 404) {
    throw new Error("Group with invite code does not exist. ");
  }
  if (response.status === 429) {
    throw new Error("Too many requests. Please try again later.");
  }

  if (!response.ok) {
    throw new Error("Failed to create user. Server error");
  }

  const data = await response.json();
  return data;
};

export default createUser;
