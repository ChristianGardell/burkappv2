const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const deleteGroup = async (): Promise<boolean> => {
  const response = await fetch(`${apiUrl}/owner/delete-group`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete group");
  }

  return true;
};

export default deleteGroup;
