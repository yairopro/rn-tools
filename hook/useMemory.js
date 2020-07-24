import { useEffect, useRef } from "react"
import match from "js-tools/src/array/match"

export default function useMemory(factory, dependencies, destructor) {
	dependencies = dependencies || [];

	const memory = useRef({}).current;

	// called twice
	function destroy(){
		if (memory.destructor)
			memory.destructor();
	}

	// first time or dependencies changed
	if (!memory.dependencies || !match(dependencies, memory.dependencies)) {
		// recreate value
		const value = factory instanceof Function ? 
			factory(dependencies, memory.value, memory.dependencies)
			: factory;

		destroy(); // destroy old

		// save
		memory.value = value;
		memory.dependencies = dependencies;
		memory.destructor = destructor;
	}

	// on unmount, destroy
	useEffect(() => destroy, []);

	return memory.value;
}