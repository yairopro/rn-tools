import { useEffect, useRef } from "react"
import match from "js-tools/array/match"

export default function useMemory(factory, dependencies, destructor) {
	dependencies = dependencies || [];

	const memory = useRef({}).current;

	/* omnipresent */ function destroy(...params) {
		const { destructor } = memory;
		memory.destructor = undefined; // run once only
		if (destructor instanceof Function)
			destructor(...params);
	}

	if (/* first time */ !memory.dependencies || !match(dependencies, memory.dependencies)) {
		const newDependencies = [...dependencies];
		const oldValue = memory.value;
		const oldDependencies = memory.dependencies;


		// recreate value
		const newValue = factory instanceof Function ?
			factory(newDependencies, oldValue, /* null on mount */ oldDependencies)
			: factory;

		destroy(oldDependencies, /* nullable on mount */ newDependencies, newValue);

		// save
		memory.value = newValue;
		memory.dependencies = newDependencies;
		memory.destructor = destructor;
	}

	// on unmount, destroy
	useEffect(() => destroy(memory.dependencies), []);

	return memory.value;
}