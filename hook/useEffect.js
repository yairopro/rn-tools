import React from "react"
import match from "js-tools/array/match";
import timeout from "js-tools/utils/timeout"
import call from "ramda/es/call"

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
			const oldDependencies = memory.dependencies || [];
			const newDependencies = memory.dependencies = [...dependencies];

			function runEffect() {
				undo();

				if (effect)
					memory.undo = effect(newDependencies, oldDependencies);
			}

			memory.undo /* unscheduler */ = schedule(runEffect);
		}

		// undo on unmount
		React.useEffect(() => undo, []);
	};
}

export const useEffect = generateUseEffect(timeout); // async
export const useSyncEffect = generateUseEffect(call); // sync
export default useEffect; // default is async


