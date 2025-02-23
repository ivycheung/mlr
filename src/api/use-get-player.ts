import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FormSchemaPitches } from "../types/schemas/pitches-schema";

const fetchPlayer = async (type: string, league: string, playerId: number): Promise<FormSchemaPitches> => {
  const url = `https://api.mlr.gg/legacy/api/plateappearances/${type}/${league}/${playerId}`;
  const response = await axios.get(url);
  return response.data;
}

export function useGetPlayer(type: string, league: string, playerOption: number) {
  const validLeagues = ['milr', 'mlr'];
  const validPositionTypes = ['pitching', 'batting'];
  if (!validLeagues.includes(league) || !validPositionTypes.includes(type)) {
    throw new Error('Invalid league or position type');
  }

  const result = useQuery({
    queryKey: ['player', playerOption, league],
    queryFn: () => fetchPlayer(type, league, playerOption),
    staleTime: Infinity,
  });

  return {
    data: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error
  };
}