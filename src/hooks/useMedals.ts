// hooks/useMedals.ts
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export type Medal = {
  id: number;
  name: string;
  url_img: string;
};

export const useMedals = () =>
  useQuery<Medal[]>({
    queryKey: ["medals"],
    queryFn: async () => {
      const res = await api.get("/medals");
      return res.data;
    },
  });
