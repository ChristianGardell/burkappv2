import type { AdminChangeRequest, GroupNameChangeRequest, GroupResponse, UserResponse } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const changeGroupName = async (
  newName: GroupNameChangeRequest,
): Promise<GroupResponse> => {
  const response = await fetch(`${apiUrl}/owner/change-group-name`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(newName),
  });

  if (response.status === 404) {
    throw new Error("Group not found");
  }
  if (response.status === 422) {
    throw new Error("Invalid group name");
  }
  if (response.status === 500) {
    throw new Error("Internal server error");
  }
  if (!response.ok) {
    throw new Error("Failed to change group name");
  }

  const data: GroupResponse = await response.json();
  return data;
};

export default changeGroupName;
