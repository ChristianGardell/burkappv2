import type { UserUpdate } from "../types";
const apiUrl = import.meta.env.VITE_BACKEND_SERVER_URL || 'http://localhost:8000';


const checkUser = async (user: UserUpdate): Promise<boolean> => {
  try {
    const response = await fetch(`${apiUrl}/users/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error("User does not exist");

    const data = await response.json();
    console.log("Server response:", data);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default checkUser;
