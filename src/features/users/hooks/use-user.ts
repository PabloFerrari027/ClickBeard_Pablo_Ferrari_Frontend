"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { usersService } from "../services/users.service";

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ["users", "detail", id],
    queryFn: () => usersService.getById(id as string),
    enabled: Boolean(id),
    staleTime: CACHE_RESOURCE_STALE_TIME.userDetail,
  });
}
