"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  qualificationsService,
  type UpdateQualificationPayload,
} from "../services/qualifications.service";

export function useUpdateQualification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateQualificationPayload }) =>
      qualificationsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qualifications", "list"] });
    },
  });
}
