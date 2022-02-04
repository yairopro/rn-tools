import * as React from "react"
import { View } from "react-native"
import use from "../../hook";
import "./animation.css"

export default function LoadingPlaceholder({ animated, Component = View, ...props }) {
	animated = Boolean(animated);
	props.style = use.style(props.style, animated && localStyles.layout, [animated]);

	return <Component {...props} />;
}

const localStyles = {
	layout: {
		animationName: "loading-placeholder",
		animationIterationCount: "infinite",
		animationDuration: "4s",
	}
};