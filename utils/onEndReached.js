export default function onEndReached(callback, threshold = 1) {
	return (callback instanceof Function) ? (event) => {
		const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
		const isBelowThreshold = layoutMeasurement.height + contentOffset.y >= contentSize.height - threshold;
		if (isBelowThreshold)
			callback(event);
	} : undefined;
}