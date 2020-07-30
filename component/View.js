import React from "react"
import { View as RNView } from "react-native"
import parallel from "js-tools/src/function/parallel"
import use from "../hook";

export default function View({ responsive, ...props }) {
	const [layout, setLayout] = use.state(null);
	if (responsive) {
		if (responsive instanceof Array) {
			const levelsSeparators = responsive.map(Number)
				.filter(width => width > 0);

			if (levelsSeparators.length > 0) // render only when level change
				responsive = ({ width }, { width: oldWidth }) => {
					const oldIndex = levelsSeparators.findIndex(separator => oldWidth < separator);
					const newIndex = levelsSeparators.findIndex(separator => width < separator);
					return oldIndex !== newIndex;
				};

			else // no valid levels
				responsive = () => false;
		}

		if (!(responsive instanceof Function))
			responsive = () => true; // always render

		props.onLayout = parallel(
			props.onLayout,
			event => {
				const newLayout = event.nativeEvent.layout;
				if (!layout || responsive(newLayout, layout))
					setLayout(newLayout);
			},
		);
	}

	if (props.children instanceof Function)
		props.children = props.children({ layout });

	return <RNView {...props} />;
}