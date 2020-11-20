import createResponsiveLevels from "../utils/createResponsiveLevels";
import { useState } from "react"
import useMemory from "./useMemory"

/**
 * @deprecated use useResponsive instead
 */
export default function useResponsiveLevels(levels) {
	const [level, setLevel] = useState(undefined);

	const handler = useMemory(() => {
		const compareLayouts = createResponsiveLevels(levels);

		return function (layout, oldLayout) {
			const levelChanged = compareLayouts(layout, oldLayout);

			if (levelChanged) {
				const level = compareLayouts.getLevelOf(layout);
				setLevel(level);
			}

			return levelChanged;
		};
	});

	return [level, handler];
}