import { nth } from "ramda";
import { useState } from "react";
import useCallback from "./useCallback";

export default function useResponsive(levels) {
	const entries = Object.entries(levels)
		.filter(([, width]) => width > 0)
		.sort(([, a], [, b]) => a - b);
	entries.push(['Infinity', Infinity]);

	const orderedLevels = entries.map(nth(1));
	const getLevelOf = useCallback(event =>
		orderedLevels.find(level => event.nativeEvent.layout.width < level),
		orderedLevels
	);

	const [level, setLevel] = useState(undefined);

	const onLayout = useCallback(event => {
		const newLevel = getLevelOf(event);
		if (newLevel !== level)
			setLevel(newLevel);
	}, [getLevelOf, level]);

	const key = entries.find(([, width]) => width == level)?.[0];
	function select(options) {
		return options?.[key] || options?.default;
	}

	function run(options) {
		return select(options)?.();
	}

	return [level, onLayout, { select, run, key }];
}