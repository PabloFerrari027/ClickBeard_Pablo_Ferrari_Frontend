"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  qualificationsService,
  type CreateQualificationPayload,
} from "../services/qualifications.service";

export function useCreateQualification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQualificationPayload) => qualificationsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qualifications", "list"] });
    },
  });
}
