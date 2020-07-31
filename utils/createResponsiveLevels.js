import {toPairs} from 'ramda'

export default function createResponsiveLevels(levels) {
	levels = {...levels, infinity: Infinity};

	const orderedLevels = toPairs(levels)
		.filter(([, width]) => width > 0)
		.sort(([, width1], [, width2]) => width1 < width2)
		.map(([key, width]) => { key, width });

	const getLevelOf = (layout) => {
		const level = orderedLevels.find(level => layout.width < level.width);
		return level.width;
	};

	const responsive = (layout, oldLayout) => getLevelOf(oldLayout) !== getLevelOf(layout);
	responsive.getLevelOf = getLevelOf;
	Object.assign(responsive, levels);

	return responsive;
}