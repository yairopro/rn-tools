import { Dictionary, nth } from "ramda";
import { useState } from "react";
import useCallback from "./useCallback";

export default function useResponsive<T extends Dictionary<number>>(levels: T, defaultWidth?: number): [number | undefined, Function, ResponsiveHelper<T>] {
	const entries = Object.entries(levels)
		.filter(([, width]) => width > 0)
		.sort(([, a], [, b]) => a - b);
	entries.push(['Infinity', Infinity]);

	const orderedLevels = entries.map(nth(1)) as number[];
	const getLevelOf = (width: number | undefined) => width !== undefined ? orderedLevels.find(level => width < level) : undefined;
	const getLevelFromEvent = useCallback(event => getLevelOf(event.nativeEvent.layout.width),
		orderedLevels
	);

	const [level, setLevel] = useState(() => getLevelOf(defaultWidth));

	const onLayout = useCallback(event => {
		const newLevel = getLevelFromEvent(event);
		if (newLevel !== level)
			setLevel(newLevel);
	}, [getLevelFromEvent, level]);

	const key = entries.find(([, width]) => width == level)?.[0];
	function select(options) {
		return options?.[key] || options?.default;
	}

	function run(options) {
		return select(options)?.();
	}

	return [level, onLayout, { select, run, key }];
}

interface ResponsiveHelper<Levels> {
	key: string | undefined,
	select(levels: Levels & { default: any }): any,
	run(levels: Levels & { default: Function }): any,
}

