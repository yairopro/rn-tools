import firebase from "firebase/app"
import "firebase/auth"

const onceAuthReady = new Promise(resolve => {
	const detach = firebase.auth().onAuthStateChanged(() => {
		resolve();
		detach();
	});
});

onceAuthReady.ready = false; // for sync use
onceAuthReady.then(() => onceAuthReady.ready = true);

export default onceAuthReady;