import { useQuery } from "@tanstack/react-query";

import type { AdminStatsResponse } from "@/types";

import { getAllStats } from "./api";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAllStats,
    // Add sorting in the select method so the component gets pre-sorted data!
    select: (data: AdminStatsResponse[]) => {
      return [...data].sort((a, b) => b.total_beers - a.total_beers);
    },
  });
};
