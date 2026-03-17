import type { ValidateGroupRequest, GroupResponse } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const validateGroup = async (
  user: ValidateGroupRequest,
): Promise<GroupResponse> => {
  const response = await fetch(`${apiUrl}/users/validate-group`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (response.status === 404) {
    throw new Error("Incorrect invite code");
  }
  if (response.status === 429) {
    throw new Error("Too many requests, try again later");
  }
  if (!response.ok) {
    throw new Error("Server error");
  }

  const data = await response.json();
  return data;
};

export default validateGroup;
