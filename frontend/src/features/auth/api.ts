import { apiClient } from "@/api/client";
import type {
  GroupCreateRequest,
  LoginResponse,
  UserCreateRequest,
  UserLoginRequest,
  UserResponse,
} from "@/types";

export const createGroup = async (
  data: GroupCreateRequest,
): Promise<LoginResponse> => {
  try {
    return await apiClient<LoginResponse>("/users/create-group", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    if (error.response?.status === 409)
      throw new Error("User already exists. Please log in.");
    if (error.response?.status === 400)
      throw new Error("Group already exists. Please log in.");
    if (error.response?.status === 429)
      throw new Error("Too many requests. Please try again later.");
    throw new Error("Failed to create group. Server error");
  }
};

export const createUser = async (
  data: UserCreateRequest,
): Promise<LoginResponse> => {
  try {
    return await apiClient<LoginResponse>("/users/create-user", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    if (error.response?.status === 409)
      throw new Error("User already exists. Please log in.");
    if (error.response?.status === 404)
      throw new Error("Group with invite code does not exist. ");
    if (error.response?.status === 429)
      throw new Error("Too many requests. Please try again later.");
    throw new Error("Failed to create user. Server error");
  }
};

export const loginUser = async (
  data: UserLoginRequest,
): Promise<LoginResponse> => {
  try {
    return await apiClient<LoginResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    if (error.response?.status === 401) throw new Error("Incorrect PIN");
    if (error.response?.status === 404)
      throw new Error("Incorrect phone number");
    if (error.response?.status === 429)
      throw new Error("Too many requests, try again later");
    throw new Error("Server error");
  }
};

export const validateToken = async (): Promise<UserResponse> => {
  // It handles its own ok checks inside client
  return await apiClient<UserResponse>("/users/me", { method: "GET" });
};
