import {useNavigation, useRoute} from "@react-navigation/native";
import useMemory from "./useMemory";
import {useSyncEffect} from "./useEffect";

export default function useRouteParamState(key, config){
	const navigation = useNavigation();
	const memory = useMemory({
		get(){
			const {route, config} = this;

			let value = route.params?.[key];
			if (config?.read instanceof Function)
				value = config.read(value);

			return value;
		},

		set(update){
			if (update instanceof Function){
				const lastState = this.beingSaved ? this.beingSaved.value : this.get();
				update = update(lastState);
			}

			const param = this.config?.write instanceof Function ? this.config.write(update) : update;
			this.beingSaved = {value: param};
			navigation.setParams({[key]: param});
		},
	});

	memory.set = memory.set.bind(memory);

	memory.config = config;
	const route = memory.route = useRoute();
	useSyncEffect(() => memory.beingSaved = undefined, [route.params?.[key]]);

	return [memory.get(), memory.set];
}