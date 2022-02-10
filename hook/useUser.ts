import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import onceAuthReady from "../utils/onceAuthReady";
import useSubscribe from "./useSubscribe";

export default function useUser(): User | null | undefined {
	useSubscribe(forceRender => {
		if (!onceAuthReady.ready)
			onceAuthReady().then(forceRender);

		const auth = getAuth();
		return onAuthStateChanged(auth, forceRender);
	});

	return getAuth().currentUser || (onceAuthReady.ready ? null : undefined);
}
