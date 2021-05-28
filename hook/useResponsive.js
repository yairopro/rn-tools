import { useState } from "react";
import useMemory from "./useMemory";
import useCallback from "./useCallback";

export default function useResponsive(levels) {
	const getLevelOf = useMemory((values) => {
		const orderedLevels = values.filter(width => width >= 0).sort();

		if (orderedLevels[orderedLevels.length - 1] !== Infinity)
			orderedLevels.push(Infinity);

		return event => orderedLevels.find(level => event.nativeEvent.layout.width < level);
	},
		Object.values(levels || {}),
	);

	const [level, setLevel] = useState(undefined);

	const onLayout = useCallback(event => {
		const newLevel = getLevelOf(event);
		if (newLevel !== level)
			setLevel(newLevel);
	}, [getLevelOf, level]);
	
	const key = Object.entries(levels).find(([, width]) => width == level)?.[0];
	function select(options){
		return options?.[key] || options?.default;
	}

	function run(options){
		return select(options)?.();
	}

	return [level, onLayout, {select, run, key}];
}