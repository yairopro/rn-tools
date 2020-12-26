import parallel from "js-tools/function/parallel";
import React, { useEffect, useState } from "react"

export default function Hoverable({ children: child, disabled, onHoverChanged }) {
	const [hovered, setHovered] = useState(undefined);
	useEffect(() => {
		if (hovered !== undefined && !disabled && onHoverChanged instanceof Function)
			onHoverChanged(hovered);
	}, [hovered, disabled]);

	if (child instanceof Function)
		child = child(!disabled && hovered);

	if (!disabled && child?.$$typeof && child.props) {
		const originals = {
			onMouseEnter: child.props.onMouseEnter,
			onMouseLeave: child.props.onMouseLeave,
		};

		const overrides = {
			onMouseEnter: parallel(() => setHovered(true), originals.onMouseEnter),
			onMouseLeave: parallel(() => setHovered(false), originals.onMouseLeave),
		};

		child = React.cloneElement(child, overrides);
	}

	return child;
}