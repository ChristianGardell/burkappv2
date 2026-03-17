const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const deleteAccount = async (): Promise<boolean> => {
  const response = await fetch(`${apiUrl}/users/delete-account`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return true;
};

export default deleteAccount;
