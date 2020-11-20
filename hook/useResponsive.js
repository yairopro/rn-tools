import { useCallback } from "react";
import useMemory from "./useMemory";

export default function useResponsive(levels) {
	const getLevelOf = useMemory(([values]) => {
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
			setLevel(level);
	}, [compareWidths]);

	return [level, onLayout];
}