import { useSyncEffect } from "./useEffect";
import useForceRender from "./useForceRender"

export default function useSubscribe(subscribe, dependencies){
	const forceRender = useForceRender();
	useSyncEffect(
		() => {
			if (subscribe instanceof Function)
				return subscribe(forceRender);
		},
		dependencies,
	);
}