import type { LoginResponse, GroupCreate } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const createGroup = async (user: GroupCreate): Promise<LoginResponse> => {
  const response = await fetch(`${apiUrl}/users/create-group`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (response.status === 400) {
    throw new Error("Group already exists. Please log in.");
  }

  if (!response.ok) {
    const error = new Error("Failed to create group. Server error") as any;
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data;
};

export default createGroup;
