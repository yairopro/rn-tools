import useMemory from "./useMemory";

export default function useStyle(userStyle, defaultStyles, dependencies) {
	return useMemory(([, ...dependenciesParams]) => {
		if (defaultStyles instanceof Function)
			defaultStyles = defaultStyles(...dependenciesParams);

		return [defaultStyles, userStyle].flat().filter(Boolean);
	},
		[userStyle].concat(dependencies),
	);
}