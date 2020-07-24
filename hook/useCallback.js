import useMemory from "./useMemory"

export default function useCallback(callback, dependencies){
	return useMemory(() => callback || undefined, dependencies);
}