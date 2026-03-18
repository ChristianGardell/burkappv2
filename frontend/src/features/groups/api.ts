import { apiClient } from "@/api/client";
import type {
  GroupNameChangeRequest,
  GroupResponse,
  PricePerBeerSetRequest,
  PricePerBeerSetResponse,
  SwishSetRequest,
  SwishSetResponse,
  ValidateGroupRequest,
} from "@/types";

export const changeGroupName = async (
  data: GroupNameChangeRequest,
): Promise<GroupResponse> => {
  try {
    return await apiClient<GroupResponse>("/owner/change-group-name", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    if (error.response?.status === 404) throw new Error("Group not found");
    if (error.response?.status === 422) throw new Error("Invalid group name");
    if (error.response?.status === 500)
      throw new Error("Internal server error");
    throw new Error("Failed to change group name");
  }
};

export const deleteGroup = async (): Promise<boolean> => {
  try {
    return await apiClient<boolean>("/owner/delete-group", {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error("Failed to delete group");
  }
};

export const setGroupSwishNumber = async (
  data: SwishSetRequest,
): Promise<SwishSetResponse> => {
  try {
    return await apiClient<SwishSetResponse>("/owner/set-group-swish-number", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    if (error.response?.status === 422) throw new Error("Invalid swish number");
    if (error.response?.status === 500)
      throw new Error("Internal server error");
    throw new Error("Failed to update swish number");
  }
};

export const setGroupPricePerBeer = async (
  data: PricePerBeerSetRequest,
): Promise<PricePerBeerSetResponse> => {
  try {
    return await apiClient<PricePerBeerSetResponse>(
      "/owner/set-group-price-per-beer",
      { method: "PUT", body: JSON.stringify(data) },
    );
  } catch (error: any) {
    if (error.response?.status === 422)
      throw new Error("Invalid price per beer value");
    if (error.response?.status === 500)
      throw new Error("Internal server error");
    throw new Error("Failed to update price per beer");
  }
};

export const validateGroup = async (
  data: ValidateGroupRequest,
): Promise<GroupResponse> => {
  try {
    return await apiClient<GroupResponse>("/users/validate-group", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    if (error.response?.status === 404)
      throw new Error("Incorrect invite code");
    if (error.response?.status === 422)
      throw new Error("Invalid invite code format");
    if (error.response?.status === 429)
      throw new Error("Too many requests, try again later");
    throw new Error("Server error");
  }
};
