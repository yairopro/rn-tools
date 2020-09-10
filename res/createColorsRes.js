const {map} = require('ramda');
const getLastIndexOf = require('js-tools/Arrays/getLastIndexOf');

export default map(rawColors => {
	const getColor = index => {
		if (!(index >= 0))
			index = 0;
		else if (index >= rawColors.length)
			index = getLastIndexOf(rawColors);

		return getColor[index];
	};

	Object.assign(getColor, rawColors);

	return getColor;
});