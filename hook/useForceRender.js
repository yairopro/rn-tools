import { useState } from "react"

export default function useForceRender() {
	const [, set] = useState(0);
	if (!set.forceRender)
		set.forceRender = () => set(i => i + 1);
	return set.forceRender;
}