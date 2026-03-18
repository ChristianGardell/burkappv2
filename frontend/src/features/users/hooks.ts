import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { AdminChangeRequest, UserUpdateAdmin } from "@/types";

import {
  decrementBeer,
  deleteAccount,
  getAllUsers,
  makeUserAdmin,
  removeUserAdmin,
  updateUserBeers,
} from "./api";

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
};

export const useUpdateUserBeers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserUpdateAdmin) => updateUserBeers(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useMakeUserAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminChangeRequest) => makeUserAdmin(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useRemoveUserAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminChangeRequest) => removeUserAdmin(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useDecrementBeer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: decrementBeer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });

    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccount,
  });
};
