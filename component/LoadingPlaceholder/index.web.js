import React from "react"
import {View} from "react-native"
import use from "../../hook";
import "./animation.css"

export default function LoadingPlaceholder({ animated = true, ...props }) {
	props.style = use.style(props.style, animated && localStyles.layout, [animated]);

	return (
		<View {...props}/>
	);
}

const localStyles = {
	layout: {
		animationName: "loading-placeholder",
		animationIterationCount: "infinite",
		animationDuration: "4s",
	}
}