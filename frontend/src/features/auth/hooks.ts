import { useMutation, useQuery } from "@tanstack/react-query";

import type {
  GroupCreateRequest,
  UserCreateRequest,
  UserLoginRequest,
} from "@/types";

import { createGroup, createUser, loginUser, validateToken } from "./api";

export const useCreateGroup = () => {
  return useMutation({
    mutationFn: (data: GroupCreateRequest) => createGroup(data),
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: UserCreateRequest) => createUser(data),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: UserLoginRequest) => loginUser(data),
  });
};

export const useAuthUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: validateToken,
    enabled, // only run if we have a token
    retry: false, // Don't retry if token is invalid
  });
};
