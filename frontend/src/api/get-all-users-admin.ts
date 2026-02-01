import type { UserResponse } from "@/types";
  

const getAllUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await fetch(`http://localhost:8000/users/admin/getall`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default getAllUsers;
