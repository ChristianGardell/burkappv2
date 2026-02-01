import type { UserLogin, UserResponse } from "../types";

const decrementBeer = async (): Promise<UserResponse> => {
  try {
    const response = await fetch(`http://192.168.0.208:8000/users/decrement`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to decrement beer");

    const data = await response.json();
    console.log("Server response:", data);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default decrementBeer;
