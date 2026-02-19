import type { SwishSetRequest, SwishSetResponse } from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const setGroupSwishNumber = async (
  swishSetRequest: SwishSetRequest,
): Promise<SwishSetResponse> => {

    const response = await fetch(`${apiUrl}/owner/set-group-swish-number`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(swishSetRequest),
    });
    if (response.status === 422) {
      throw new Error("Invalid swish number");
    }
    if (response.status === 500) {  
      throw new Error("Internal server error");
    }
    if (!response.ok) {
      throw new Error("Failed to update swish number");
    }

    const data: SwishSetResponse = await response.json();
    return data;
};

export default setGroupSwishNumber;
