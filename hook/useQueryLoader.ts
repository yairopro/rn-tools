import { useQuery, gql, QueryResult, DocumentNode, TypedDocumentNode } from "@apollo/client"

function useQueryLoader<TData, TVariables>(
	query: DocumentNode | TypedDocumentNode<any, TVariables>,
	variables: TVariables
): QueryLoader<TData, TVariables> {
	const loader = useQuery(query || EMPTY_QUERY, { variables, skip: !query }) as QueryLoader<TData, TVariables>;
	loader.variables = variables; // used by the query iterator
	loader.loading = !query ? undefined /* <-- loading must =undefined if no query. 
				It allows components to set their default value when deconstructing the loader */
		: loader.loading;
	return loader;
}

export default useQueryLoader;

const EMPTY_QUERY = gql`{_}`;

export interface QueryLoader<TData, TVariables> extends QueryResult<TData, TVariables> {
	variables: TVariables,
}