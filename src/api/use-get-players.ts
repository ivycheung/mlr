import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FormSchemaPlayers } from "../types/schemas/player-schema";

const fetchPlayers = async (): Promise<FormSchemaPlayers> => {
  const response = await axios.get('https://api.mlr.gg/legacy/api/players');
  return response.data;
}

export function useGetPlayers() {
  const result = useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
    staleTime: Infinity
  });

  return {
    data: result.data || [],
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error
  }

}
