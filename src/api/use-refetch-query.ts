import { useQueryClient } from "@tanstack/react-query";

const useRefetchQuery = (queryKey: Array<string> | unknown[]) => {
  const queryClient = useQueryClient();

  const refetchQuery = async () => {
    await queryClient.refetchQueries({ queryKey });
  };

  return refetchQuery;
};

export default useRefetchQuery;