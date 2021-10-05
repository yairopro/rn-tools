import { useLinkProps, StackActions } from "@react-navigation/native";
import parallel from "js-tools/function/parallel";
import isDefined from "js-tools/is/defined";
import { pipe, prop } from "ramda";
import React from "react";
import useMemory from "../../hook/useMemory";
import useStyle from "../../hook/useStyle";

export default function /* Web */ Portal({ to: name, with: params, as: action, disabled, children: child, a }) {
	// keep params instance as long as it doesn't change to prevent destination path
	params = useMemory(params, params && Object.entries(params).flat(1));

	// correct action
	action = useMemory(([action, name, params]) => {
		if (!action && isDefined(name))
			action = DEFAULT_ACTION;

		if (action instanceof Function)
			action = action(name, params);

		return action;
	}, [action, name, params]);

	const linkProps = useLinkProps({ to: { screen: name, params }, action });
	
	// view doesn't handle onPress
	linkProps.onClick = parallel(
		event => event.portalHandled = true, // flag to handle once only
		linkProps.onPress
	);
	// touchable & Pressable don't handle onClick
	linkProps.onPress = pipe(prop('nativeEvent'), event => {
		if (!event.portalHandled) // check if already handled
			linkProps.onClick(event);
	});

	// accessibilityRole must not change overwise the html element change and all event listeners are lost (like onLayout)
	// nested links are forbiden
	const isInLink = false; // TODO https://stackoverflow.com/questions/63801457/react-how-to-know-if-a-component-is-in-a-link-element
	const accessibilityRoleProp = { accessibilityRole: isInLink ? undefined : 'link' };

	// check if disabled
	disabled = (disabled !== undefined) ?
		Boolean(disabled)
		: !(name || typeof name === 'string');

	const disablingProps = {
		style: useStyle(child?.props?.style, { cursor: 'default' }),
	};


	// apply link props if not disabled
	const props = Object.assign({}, accessibilityRoleProp, disabled ? disablingProps : linkProps);

	return React.cloneElement(child, props);
}

const DEFAULT_ACTION = StackActions.push;