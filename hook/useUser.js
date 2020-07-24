import firebase from "firebase/app";
import onceAuthReady from "../utils/onceAuthReady";
import useSubscribe from "./useSubscribe";

export default function useUser() {
	useSubscribe(forceRender => {
		if (!onceAuthReady.ready)
			onceAuthReady.then(forceRender);

		return firebase.auth().onAuthStateChanged(forceRender);
	});

	return firebase.auth().currentUser || (onceAuthReady.ready ? null : undefined);
}
