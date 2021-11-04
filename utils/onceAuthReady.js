import { getAuth, onAuthStateChanged } from "firebase/auth";

const onceAuthReady = new Promise(resolve => {
	const detach = onAuthStateChanged(getAuth(), () => {
		resolve();
		detach();
	});
});

onceAuthReady.ready = false; // for sync use
onceAuthReady.then(() => onceAuthReady.ready = true);

export default onceAuthReady;