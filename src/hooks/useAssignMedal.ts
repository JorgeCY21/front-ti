import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";

interface AssignMedalInput {
  user_id: string;
  medal_id: number;
}

export function useAssignMedal() {
  return useMutation({
    mutationFn: (data: AssignMedalInput) =>
      api.post("/user-medals", data),
  });
}
