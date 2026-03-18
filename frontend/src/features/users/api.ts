import { apiClient } from "@/api/client";
import type {
  AdminChangeRequest,
  UserBeerResponse,
  UserResponse,
  UserUpdateAdmin,
} from "@/types";

export const getAllUsers = async (): Promise<UserResponse[]> => {
  return await apiClient<UserResponse[]>("/admin/getall");
};

export const updateUserBeers = async (
  data: UserUpdateAdmin,
): Promise<boolean> => {
  try {
    return await apiClient<boolean>("/admin/setbeers", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    if (error.response?.status === 422)
      throw new Error("Must be between 0 and 9999 beers");
    throw new Error("Failed to update user beers");
  }
};

export const makeUserAdmin = async (
  data: AdminChangeRequest,
): Promise<UserResponse> => {
  try {
    return await apiClient<UserResponse>("/owner/make-user-admin", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    if (error.response?.status === 404)
      throw new Error("User not found in your group");
    if (error.response?.status === 422) throw new Error("Invalid phonenumber");
    if (error.response?.status === 500)
      throw new Error("Internal server error");
    throw new Error("Failed to make user admin");
  }
};

export const removeUserAdmin = async (
  data: AdminChangeRequest,
): Promise<UserResponse> => {
  try {
    return await apiClient<UserResponse>("/owner/remove-user-admin", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    if (error.response?.status === 400)
      throw new Error("Cannot remove admin status from the owner");
    if (error.response?.status === 404)
      throw new Error("User not found in your group");
    if (error.response?.status === 422) throw new Error("Invalid user ID");
    if (error.response?.status === 500)
      throw new Error("Internal server error");
    throw new Error("Failed to remove user admin");
  }
};

export const decrementBeer = async (): Promise<UserBeerResponse> => {
  try {
    return await apiClient<UserBeerResponse>("/users/decrement", {
      method: "PUT",
    });
  } catch (error) {
    throw new Error("Failed to decrement beer");
  }
};

export const deleteAccount = async (): Promise<boolean> => {
  try {
    return await apiClient<boolean>("/users/delete-account", {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};
