import * as React from "react";
import { NavigationAction, StackActions, useLinkProps } from "@react-navigation/native";
import { Dictionary, isNil } from "ramda";
import useMemory from "../../hook/useMemory";
import useStyle from "../../hook/useStyle";

export default function /* Web */ Portal({ to: name, with: params, as: action, disabled, children: child }: PortalProps) {
	// keep params instance as long as it doesn't change to prevent destination path
	params = useMemory(params, params && Object.entries(params).flat(1));

	// correct action
	action = useMemory(([action, name, params]) => {
		if (!action && !isNil(name))
			action = DEFAULT_ACTION;

		if (action instanceof Function)
			action = action(name, params);

		return action;
	}, [action, name, params]);

	const { accessibilityRole, onPress: navigate, ...linkProps } = useLinkProps({ to: { screen: name, params }, action });
	const navigationProps = {
		...linkProps,
		onClick: navigate, // View doesn't handle onPress
		onPress: navigate, // Touchable & Pressable don't handle onClick
	};


	// check if disabled
	disabled = (disabled !== undefined) ?
		Boolean(disabled)
		: !(name || typeof name === 'string');

	const disablingProps = {
		style: useStyle(child?.props?.style, { cursor: 'default' }),
	};

	// nested links are forbiden
	const isInLink = false; // TODO https://stackoverflow.com/questions/63801457/react-how-to-know-if-a-component-is-in-a-link-element

	const props = Object.assign({},
		// always keep same accessibility role overwise the html element change and all event listeners are lost (like onLayout)
		isInLink ? { accessibilityRole } : undefined,
		disabled ? disablingProps : navigationProps
	);

	return React.cloneElement(child, props);
}

export interface PortalProps {
	to?: Maybe<string>,
	with?: Maybe<Dictionary<any>>,
	as?: Maybe<NavigationAction>,
	disabled?: Maybe<boolean>,
	children?: Maybe<React.ReactElement>,
}

type Maybe<T> = T | undefined;

const DEFAULT_ACTION = StackActions.push;