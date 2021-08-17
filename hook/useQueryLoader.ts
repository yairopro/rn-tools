import { useQuery, gql, QueryResult, DocumentNode, TypedDocumentNode } from "@apollo/client"
import useMemory from "./useMemory";
import {equals} from 'ramda'

function useQueryLoader<TData, TVariables>(
	query: Query<TVariables>,
	variables: TVariables
): QueryLoader<TData, TVariables> {
	const queryResult = useQuery(query || EMPTY_QUERY, { variables, skip: !query }) as QueryLoader<TData, TVariables>;

	const varsObject = variables || {};
	const queryLoader = useMemory(([query, ...flatVars], _, old) => {
		const [oldQuery, ...oldFlatVars] = old || [];
		if (query && query === oldQuery && !equals(flatVars, oldFlatVars))
			queryResult.refetch(varsObject);

		return new QueryLoader(query, variables);
	},
		[
			query,
			...Object.entries(varsObject).flat(),
		]
	);

	Object.assign(queryLoader, queryResult);

	return queryLoader;
}

export default useQueryLoader;

const EMPTY_QUERY = gql`{_}`;

export class QueryLoader<TData, TVariables> implements QueryResult<TData, TVariables> {
	query: Query<TVariables> | undefined;
	variables: TVariables;
	_loading: boolean;
	
	constructor(query: Query<TVariables>, variables: TVariables){
		this.query = query;
		this.variables = variables;
	}

	get loading(){
		return this.query ? this._loading : undefined;
	}

	set loading(loading){
		this._loading = loading;
	}
}

type Query<TVariables> = DocumentNode | TypedDocumentNode<any, TVariables>;