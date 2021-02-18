import { Subject } from "rxjs";
import { useSyncEffect } from "./useEffect";
import useMemory from "./useMemory";
import { QueryLoader } from './useQueryLoader';
import useSubscribe from "./useSubscribe";

export default function useQueryIterator<TData, TVariables extends object>(
	loader: QueryLoader<TData, TVariables>,
	config: QueryIteratorConfig<TData>,
): QueryIterator<TData, TVariables> {

	const iterator = useMemory(() => new QueryIterator(loader, config), [loader]);
	useSubscribe(iterator?.subscribe, [iterator]);

	// check page loaded by the loader 
	useSyncEffect(([data]) => {
		if (data && iterator.items?.length < config.range)
			iterator.end = true;
	},
		[loader?.data],
	);

	return iterator;

}

export interface QueryIteratorConfig<TData> {
	retrieveItems: (data: TData) => any[] | undefined,
	range?: number,
}

export class QueryIterator<TData, TVariables> {
	loader: QueryLoader<TData, TVariables>;
	config: QueryIteratorConfig<TData>;

	fetching = false;
	end = false;
	observable = new Subject();

	constructor(
		loader: QueryLoader<TData, TVariables>,
		config: QueryIteratorConfig<TData>,
	) {
		this.loader = loader;
		this.config = config;
	}

	get loading() {
		return this.fetching || this.loader.loading;
	}

	get items() {
		const data = this.loader?.data;
		if (data)
			return this.config.retrieveItems(data);
	}

	willLoadNext(variables: object): () => Promise<any[]> | undefined {
		if (!this.end && !this.loading)
			return () => this.next(variables);
	}

	next(variables: object): Promise<any> | undefined {
		if (this.loading || this.end)
			return;

		this.fetching = true;
		this.observable.next(this);

		const { loader, config } = this;
		const promise = loader.fetchMore({
			variables: Object.assign({ ...loader.variables }, variables),
		}).then(result => {
			if (result.data)
				return config.retrieveItems(result.data);

			const graphQLError = result.error || result.errors?.[0];
			if (graphQLError)
				throw Object.assign(new Error(graphQLError.message), graphQLError);

			const error = new Error("QueryIterator.next: Unknown error, see error.result");
			// @ts-ignore
			error.result = result;
			throw result;
		});

		// check if end is reached
		promise.then(addedItems => {
			const addedLength = addedItems?.length;
			this.end = Number(config?.range) >= 0 ?
				addedLength < config.range
				: !(addedLength >= 0);
		})
			// clean state
			.finally(() => {
				this.fetching = false;
				this.observable.next(this);
			});

		return promise;
	}

	subscribe = (callback) => {
		const subscription = this.observable.subscribe(callback);
		return () => subscription.unsubscribe();
	}
}