"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { usersService } from "../services/users.service";

export function useUsers(page: number) {
  return useQuery({
    queryKey: ["users", "list", page],
    queryFn: () => usersService.list(page),
    staleTime: CACHE_RESOURCE_STALE_TIME.usersList,
  });
}
