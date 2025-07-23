import { useQuery } from "@tanstack/react-query";
import { GetAllSettlementsResponse } from "./settlements-list-models";
import { apiCall } from "~/lib/api";

async function getAllSettlements(page: number, pageSize: number): Promise<GetAllSettlementsResponse> {
  await new Promise(resolve => setTimeout(resolve, 700))
  const response = await apiCall(`/api/v1/Settlements?Page=${page}&PageSize=${pageSize}`);
  return await response.json();
}

export function getAllSettlementsQuery(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['settlements'],
    queryFn: async () => {
      return await getAllSettlements(page, pageSize);
    },
    placeholderData: (previousData) => previousData,
  })
}
