import useMemory from "./useMemory";

export default function useStyle(userStyle: Style, defaultStyles: DefaultStyle, dependencies: any[]) {
	return useMemory(([, ...dependenciesParams]) => {
		if (defaultStyles instanceof Function)
			defaultStyles = defaultStyles(...dependenciesParams);

		return [defaultStyles, userStyle].flat().filter(Boolean);
	},
		[userStyle].concat(dependencies),
	);
}

type Style = object | any[];
type DefaultStyle =
	| Style
	| Style[]
	| ((...params: any[]) => Style);