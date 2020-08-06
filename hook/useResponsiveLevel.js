import createResponsiveLevels from "../utils/createResponsiveLevels";
import { useState } from "react"
import useMemory from "./useMemory"

export default function useResponsiveLevels(levels) {
	const [level, setLevel] = useState(undefined);

	const responsive = useMemory(() => {
		const compareLayouts = createResponsiveLevels(levels);

		function handler(layout, oldLayout) {
			const levelChanged = compareLayouts(layout, oldLayout);
			
			if (levelChanged) {
				const level = compareLayouts.getLevelOf(layout);
				setLevel(level);
			}

			return levelChanged;
		}

		Object.assign(handler, compareLayouts);

		return handler;
	});

	return [level, responsive];
}

