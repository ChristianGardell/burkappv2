import type { UserUpdate } from "../types";

const checkUser = async (user: UserUpdate): Promise<boolean> => {
  try {
    const response = await fetch(`http://192.168.0.208:8000/users/check`, {
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
