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

		/* omnipresent */ function undo() {
			const undo = memory.undo;
			memory.undo = undefined; // run once only
			if (undo instanceof Function)
				undo();
		}

		if (/* first time */ !memory.dependencies || !match(dependencies, memory.dependencies)) {
			const oldDependencies = memory.dependencies;
			const newDependencies = memory.dependencies = [...dependencies];

			function runEffect() {
				undo();

				if (effect)
					memory.undo = effect(newDependencies, /* nullable */ oldDependencies);
			}

			memory.undo /* unscheduler */ = schedule(runEffect);
		}

		// undo on unmount
		React.useEffect(() => undo, []);
	};
}

export const useEffect = generateUseEffect(timeout); // async
export default useEffect; // default is async

export const useSyncEffect = generateUseEffect(call); // sync
export const useDebouncedEffect = (time, ...params) => generateUseEffect(timeout(__, time))(...params);