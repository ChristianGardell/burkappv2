import type { GroupCreateRequest, LoginResponse } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const createGroup = async (
  user: GroupCreateRequest,
): Promise<LoginResponse> => {
  const response = await fetch(`${apiUrl}/users/create-group`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (response.status === 409) {
    throw new Error("User already exists. Please log in.");
  }
  if (response.status === 400) {
    throw new Error("Group already exists. Please log in.");
  }

  if (response.status === 429) {
    throw new Error("Too many requests. Please try again later.");
  }
  if (!response.ok) {
    throw new Error("Failed to create group. Server error");

  }

  const data = await response.json();
  return data as LoginResponse;
};

export default createGroup;
