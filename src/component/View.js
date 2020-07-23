import React from "react"
import { View as RNView } from "react-native"
import parallel from "js-tools/src/function/parallel"

export default function View({ responsive, ...props }) {
	if (responsive) {
		props.onLayout = parallel(
			props.onLayout,
			event => {
				if (responsive instanceof Array){
					
				}
			},
		);
	}

	return <RNView {...props} />;
}