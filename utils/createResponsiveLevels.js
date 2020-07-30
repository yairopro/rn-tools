export default function createResponsiveLevels(levels) {
	levels = levels.map(Number)
		.filter(width => width > 0)
		.sort();
	levels.push(Infinity);

	const getLevelOf = layout => levels.findIndex(separator => layout.width < separator);
	const responsive = (layout, oldLayout) => getLevelOf(oldLayout) !== getLevelOf(layout);
	responsive.getLevelOf = getLevelOf;

	return responsive;
}