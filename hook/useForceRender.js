import { useState } from "react"

export default function useForceRender() {
	const [, set] = useState();
	if (!set.forceRender)
		set.forceRender = () => set({});
	return set.forceRender;
}