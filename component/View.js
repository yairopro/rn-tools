import React from "react"
import { TouchableOpacity } from "react-native"
import parallel from "js-tools/function/parallel"
import use from "../hook";

export default function View({ responsive, onPress, ...props }) {
	const [layout, setLayout] = use.state(null);
	if (responsive) {
		if (!(responsive instanceof Function))
			responsive = DEFAULT_RESPONSIVE;

		props.onLayout = parallel(
			props.onLayout,
			event => {
				const newLayout = event.nativeEvent.layout;
				if (responsive(newLayout, layout))
					setLayout(newLayout);
			},
		);
	}

	if (props.children instanceof Function)
		props.children = props.children({ layout });

	props.disabled = (props.disabled !== undefined) ? Boolean(disabled)
		: !(props.onPress || props.onClick || props.onLongPress);

	return <TouchableOpacity {...props} />;
}

const DEFAULT_RESPONSIVE = () => true;  // always render