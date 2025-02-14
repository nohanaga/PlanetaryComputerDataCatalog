import axios from "axios";
import { ISearchIdMetadata } from "pages/Explore/types";
import { QueryFunctionContext, useQuery } from "react-query";
import { DATA_URL } from "utils/constants";

export const useSearchIdMetadata = (searchId: string | null) => {
  return useQuery(["searchId", searchId], getSearchIdMetadata, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(searchId),
  });
};

const getSearchIdMetadata = async (
  queryParam: QueryFunctionContext<["searchId", string | null]>
): Promise<ISearchIdMetadata> => {
  const [, searchId] = queryParam.queryKey;
  return await fetchSearchIdMetadata(searchId);
};

export const fetchSearchIdMetadata = async (
  searchId: string | null
): Promise<ISearchIdMetadata> => {
  return await (
    await axios.get(`${DATA_URL}/mosaic/${searchId}/info`)
  ).data;
};
