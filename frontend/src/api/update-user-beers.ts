import type { UserUpdateAdmin } from "../types";

const updateUserBeers = async (
  userUpdateAdmin: UserUpdateAdmin,
): Promise<boolean> => {
  try {
    const response = await fetch(
      `http://192.168.0.208:8000/users/admin/setbeers`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(userUpdateAdmin),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update user beers");
    }

    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default updateUserBeers;
