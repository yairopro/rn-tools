import { useLazyQuery } from "@apollo/client"
import { useSyncEffect } from "./useEffect";

export default function useQueryLoader(query, variables) {
	const [load, loader] = useLazyQuery(query, { variables });
	useSyncEffect(() => {
		if (query) {
			load();
			loader.loading = true;
		}
	}, [query]);

	loader.load = (query && load) || null;

	return loader;
}

/**
 * @typedef Loader
 * @property data {* | undefined}
 * @property load {Function | undefined} Function to load next page or reload in case of error. load() is undefined once all data is loaded
 * @property loading {boolean}
 * @property error {* | undefined}
 */