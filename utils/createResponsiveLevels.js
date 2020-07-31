import {values} from 'ramda'

export default function createResponsiveLevels(levels) {
	levels = {...levels, infinity: Infinity};

	const orderedLevels = values(levels)
		.filter(width => width >= 0)
		.sort();

	const getLevelOf = layout => orderedLevels.find(level => layout.width < level);
	const responsive = (layout, oldLayout) => getLevelOf(oldLayout) !== getLevelOf(layout);
	responsive.getLevelOf = getLevelOf;
	Object.assign(responsive, levels);

	return responsive;
}