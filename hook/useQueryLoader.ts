import { useQuery, gql, QueryResult, DocumentNode, TypedDocumentNode } from "@apollo/client"

function useQueryLoader<TData, TVariables>(
	query: DocumentNode | TypedDocumentNode<any, TVariables>,
	variables: TVariables
): QueryResult<TData, TVariables> {
	const loader = useQuery(query || EMPTY_QUERY, { variables, skip: !query });
	loader.loading = query /* undefined-able */ && loader.loading;
	return loader;
}

export default useQueryLoader;

const EMPTY_QUERY = gql`{_}`;