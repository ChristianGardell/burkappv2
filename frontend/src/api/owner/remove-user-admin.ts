import type { AdminChangeRequest, UserResponse } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const removeUserAdmin = async (
  userUpdateAdmin: AdminChangeRequest,
): Promise<UserResponse> => {
  const response = await fetch(`${apiUrl}/owner/remove-user-admin`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(userUpdateAdmin),
  });
  if (response.status === 400) {
    throw new Error("Cannot remove admin status from the owner");
  }
  if (response.status === 404) {
    throw new Error("User not found in your group");
  }
  if (response.status === 422) {
    throw new Error("Invalid user ID");
  }
  if (response.status === 500) {
    throw new Error("Internal server error");
  }
  if (!response.ok) {
    throw new Error("Failed to remove user admin");
  }

  const data: UserResponse = await response.json();
  return data;
};

export default removeUserAdmin;
