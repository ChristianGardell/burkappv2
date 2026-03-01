import type {
  PricePerBeerSetRequest,
  PricePerBeerSetResponse,
} from "../../types";
const apiUrl =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:8000";

const setGroupPricePerBeer = async (
  pricePerBeerSetRequest: PricePerBeerSetRequest,
): Promise<PricePerBeerSetResponse> => {
  const response = await fetch(`${apiUrl}/owner/set-group-price-per-beer`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(pricePerBeerSetRequest),
  });
  if (response.status === 422) {
    throw new Error("Invalid price per beer value");
  }
  if (response.status === 500) {
    throw new Error("Internal server error");
  }
  if (!response.ok) {
    throw new Error("Failed to update price per beer");
  }

  const data: PricePerBeerSetResponse = await response.json();
  return data;
};

export default setGroupPricePerBeer;
