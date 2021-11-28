import { getAuth, onAuthStateChanged } from "firebase/auth";


let promise;
export default function onceAuthReady(){
	if (!promise){
		promise = new Promise(resolve => {
			const detach = onAuthStateChanged(getAuth(), () => {
				resolve();
				detach();
			});
		});
		
		promise.ready = false; // for sync use
		promise.then(() => onceAuthReady.ready = true);
	}

	return promise;
};