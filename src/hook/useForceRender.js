import {useState} from "react"
import useCallback from "./useCallback"

export default function useForceRender(){
	const [, set] = useState(0);
	return useCallback(() => set(i => i + 1));
}