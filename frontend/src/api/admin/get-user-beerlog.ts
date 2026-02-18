import type { UserResponse } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const getUserBeerlog = async (): Promise<UserResponse[]> => {
  const response = await fetch(`${apiUrl}/admin/getall`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users. Server error");
  }

  const data = await response.json();

  return data;
};

export default getUserBeerlog;
