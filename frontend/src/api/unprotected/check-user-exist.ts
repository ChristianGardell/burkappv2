import type { UserUpdate } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const checkUser = async (user: UserUpdate): Promise<boolean> => {
  const response = await fetch(`${apiUrl}/users/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok)
    throw new Error("Server error while checking user existence");

  const data = await response.json();
  return data;
};

export default checkUser;
