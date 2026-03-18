import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  GroupNameChangeRequest,
  PricePerBeerSetRequest,
  SwishSetRequest,
  ValidateGroupRequest,
} from "@/types";

import {
  changeGroupName,
  deleteGroup,
  setGroupPricePerBeer,
  setGroupSwishNumber,
  validateGroup,
} from "./api";

export const useChangeGroupName = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GroupNameChangeRequest) => changeGroupName(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth"] }),
  });
};

export const useDeleteGroup = () => {
  return useMutation({ mutationFn: deleteGroup });
};

export const useSetSwishNumber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SwishSetRequest) => setGroupSwishNumber(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth"] }),
  });
};

export const useSetPricePerBeer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PricePerBeerSetRequest) => setGroupPricePerBeer(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth"] }),
  });
};

export const useValidateGroup = () => {
  return useMutation({
    mutationFn: (data: ValidateGroupRequest) => validateGroup(data),
  });
};
