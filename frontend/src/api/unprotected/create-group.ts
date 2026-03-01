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
    const error = new Error("Failed to create group. Server error");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).status = response.status;
    throw error;
  }

  const data = await response.json();
  return data as LoginResponse;
};

export default createGroup;
