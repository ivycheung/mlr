import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FormSchemaPlayers } from "../types/schemas/player-schema";

const fetchPlayers = async (): Promise<FormSchemaPlayers> => {
  const reverseProxy = import.meta.env.VITE_APP_REVERSE_PROXY || 'https://leafy-puppy-fdb4a2.netlify.app/.netlify/functions/proxy?url=';
  const response = await axios.get(reverseProxy + 'https://www.rslashfakebaseball.com/api/players');
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
