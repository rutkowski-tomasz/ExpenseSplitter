import { useQuery } from "@tanstack/react-query";
import { GetAllSettlementsResponse } from "./settlements-list-models";
import { apiCall } from "~/lib/api";

async function getAllSettlements(page: number, pageSize: number): Promise<GetAllSettlementsResponse> {
  const response = await apiCall(`/api/v1/Settlements?Page=${page}&PageSize=${pageSize}`);
  return await response.json();
}

export function getAllSettlementsQuery(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['settlements', page, pageSize],
    queryFn: async () => {
      return await getAllSettlements(page, pageSize);
    },
    placeholderData: (previousData) => previousData,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
