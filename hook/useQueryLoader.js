import { useQuery, gql } from "@apollo/client"

export default function useQueryLoader(query, variables) {
	return useQuery(query || EMPTY_QUERY, { variables, skip: !query });
}

const EMPTY_QUERY = gql`{_}`;