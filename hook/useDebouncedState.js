import { useCallback, useRef, useState } from "react";

export default function useDebouncedState(initialState, debounceTime){
	const [state, setStateSync] = useState(initialState);
	
	const ref = useRef();
	const setStateAsync = useCallback((update) => {
		if (ref.current){
			const [, cancelTimeout] = ref.current;
			cancelTimeout();
		}

		ref.current = [
			update,
			timeout(() => {
				const [update] = ref.current;
				setStateSync(update);
			}, debounceTime),
		];
	}, []);

	return [state, setStateAsync];
}

function timeout(callback, time){
	const key = setTimeout(callback, time);
	return () => clearTimeout(key);
}