import type { UserUpdateAdmin } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const updateUserBeers = async (
  userUpdateAdmin: UserUpdateAdmin,
): Promise<boolean> => {
    const response = await fetch(`${apiUrl}/admin/setbeers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(userUpdateAdmin),
    });

    if (!response.ok) {
      throw new Error("Failed to update user beers");
    }

    return true;
};

export default updateUserBeers;
