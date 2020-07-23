import React from "react"
import { View as RNView } from "react-native"
import parallel from "js-tools/src/function/parallel"
import use from "../hook";

export default function View({ responsive, ...props }) {
	const [layout, setLayout] = use.state(null);
	if (responsive)
		props.onLayout = parallel(
			props.onLayout,
			event => setLayout(event.nativeEvent.layout),
		);

	if (props.children instanceof Function)
			props.children = props.children({layout});

	return <RNView {...props} />;
}