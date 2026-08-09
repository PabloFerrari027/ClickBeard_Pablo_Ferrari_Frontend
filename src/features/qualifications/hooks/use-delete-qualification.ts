"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { qualificationsService } from "../services/qualifications.service";

export function useDeleteQualification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => qualificationsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qualifications", "list"] });
    },
  });
}
