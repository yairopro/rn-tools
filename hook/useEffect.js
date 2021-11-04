import React from "react"
import match from "js-tools/array/match";
import timeout from "js-tools/utils/timeout"
import call from "ramda/es/call"
import { __ } from "ramda";

function generateUseEffect(schedule) {
	return function effectHook(effect, dependencies) {
		if (!dependencies)
			dependencies = [];

		const memory = React.useRef({}).current;

		if (/* first time */ !memory.dependencies || !match(dependencies, memory.dependencies)) {
			memory.cancel?.();

			const oldDependencies = memory.dependencies;
			const newDependencies = memory.dependencies = [...dependencies];

			memory.cancel = schedule(() => {
				memory.undo?.();

				let undoEffect;

				if (effect instanceof Function)
					undoEffect = effect(newDependencies, /* nullable */ oldDependencies);

				memory.undo = undoEffect instanceof Function ? undoEffect : undefined;
			});
		}

		// undo on unmount
		React.useEffect(() => () => {
			memory.cancel?.();
			memory.undo?.();
		}, []);
	};
}

export const useEffect = generateUseEffect(timeout); // async
export default useEffect; // default is async

export const useSyncEffect = generateUseEffect(call); // sync
export const useDebouncedEffect = (time, ...params) => generateUseEffect(effect => timeout(effect, time))(...params);