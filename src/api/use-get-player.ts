import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FormSchemaPitches } from "../types/schemas/pitches-schema";


const fetchPlayer = async (type: string, league: string, playerId: number): Promise<FormSchemaPitches> => {
  const reverseProxy = import.meta.env.VITE_APP_REVERSE_PROXY || 'https://leafy-puppy-fdb4a2.netlify.app/.netlify/functions/proxy?url=';
  const url = `https://www.rslashfakebaseball.com/api/plateappearances/${type}/${league}/${playerId}`;
  
  const response = await axios.get(reverseProxy + url);
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
    enabled: playerOption !== 0,
    staleTime: 60 * (60 * 1000), // 60 mins ,
  });

  return {
    data: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error
  };
}