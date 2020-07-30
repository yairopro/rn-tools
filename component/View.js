import React from "react"
import { View as RNView } from "react-native"
import parallel from "js-tools/src/function/parallel"
import use from "../hook";

export default function View({ responsive, ...props }) {
	const [layout, setLayout] = use.state(null);
	if (responsive) {
		if (!(responsive instanceof Function))
			responsive = DEFAULT_RESPONSIVE;

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

const DEFAULT_RESPONSIVE = () => true;  // always render