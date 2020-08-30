import * as React from "react"
import match from "js-tools/array/match";

function generateUseEffect(launch){
	return function effectHook(effect, dependencies) {
		if (!dependencies)
			dependencies = [];
	
		const memory = React.useRef({}).current;
	
		function undo() {
			if (memory.undo)
				memory.undo();
		}
	
		if (!memory.dependencies || !match(dependencies, memory.dependencies)) {
			memory.dependencies = [...dependencies];
	
			function runEffect() {
				undo();
				memory.undo = null;
	
				if (effect) {
					const undo = effect(...dependencies);
					if (undo instanceof Function)
						memory.undo = undo;
				}
			}

			// run (a)sync effect
			launch(runEffect);
		}
	
		// undo on unmount
		React.useEffect(() => undo, []);
	};
}

export const useEffect = generateUseEffect(setTimeout); // async
export const useSyncEffect = generateUseEffect(run => run()); // sync
export default useEffect; // default is async


