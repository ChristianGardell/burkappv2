import { apiClient } from "@/api/client";
import type { AdminStatsResponse } from "@/types";

export const getAllStats = async (): Promise<AdminStatsResponse[]> => {
  return await apiClient<AdminStatsResponse[]>("/admin/stats");
};
