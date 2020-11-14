import React from "react"
import useMemory from "../../hook/useMemory"
import { CommonActions, getPathFromState, StackActions } from "@react-navigation/core";
import { useLinkProps } from "@react-navigation/native";
import LinkingContext from "@react-navigation/native/lib/module/LinkingContext";
import isDefined from "js-tools/is/defined"
import { Platform } from "react-native";

export default function /* Web */ Portal({ to: name, with: params, as: action, enabled = true, children: child, a }) {
	// keep params instance as long as it doesn't change to prevent destination path
	params = useMemory(params, params && Object.entries(params).flat(1));

	// define destination
	const config = React.useContext(LinkingContext)?.options?.config;
	const to = useMemory(() =>
		getPathFromState({ routes: [{ name, params }] }, config),
		[name, params, config],
	);

	// correct action
	action = useMemory(([action, name, params]) => {
		if (!action && isDefined(name))
			action = DEFAULT_ACTION;

		if (action instanceof Function)
			action = action(name, params);

		return action;
	}, [action, name, params]);

	// create props
	const props = useLinkProps({ to, action });

	// check if enabled
	enabled = enabled && (name || typeof name === 'string');

	// correct props (if enabled)
	if (enabled) {
		props.onClick = props.onPress;
		delete props.onPress;

		// nested links are forbiden
		const isInLink = false; // TODO https://stackoverflow.com/questions/63801457/react-how-to-know-if-a-component-is-in-a-link-element
		if (isInLink)
			delete props.accessibilityRole;
	}

	// apply props (if enabled)
	return enabled ? React.cloneElement(child, props) : child;
}

const DEFAULT_ACTION = Platform.select({
	web: StackActions.push,
	default: CommonActions.navigate,
});