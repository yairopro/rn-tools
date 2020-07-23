import { useLazyQuery } from "@apollo/client"
import { useSyncEffect } from "./useEffect";

export default function useQueryLoader(query, variables){
	const [load, loader] = useLazyQuery(query, {variables});
	useSyncEffect(() => {
		if (query){
			load();
			loader.loading = true;
		}
	}, [query]);

	loader.load = (query && load) || null;

	return loader;
}