import { useNavigation, useRoute } from "@react-navigation/native";
import justTry from "../utils/justTry";
import { useSyncEffect } from "./useEffect";
import useMemory from "./useMemory";

export default function useRouteParamState(key, config) {
	const navigation = useNavigation();
	const memory = useMemory({
		get() {
			const { route, config } = this;

			const param = route.params?.[key];
			const read = (config?.read instanceof Function) ?
				config.read :
				justTry(JSON.parse);

			return read(param);
		},

		set(update) {
			let value = update;
			if (update instanceof Function) {
				const lastState = this.beingSaved ? this.beingSaved.value : this.get();
				value = update(lastState);
			}

			this.beingSaved = { value };

			const { config } = this;
			const write = config?.write instanceof Function ?
				config.write :
				justTry(JSON.stringify);

			navigation.setParams({ [key]: write(value) });
		},
	});

	memory.set = memory.set.bind(memory);

	memory.config = config;
	const route = memory.route = useRoute();
	useSyncEffect(() => memory.beingSaved = undefined, [route.params?.[key]]);

	return [memory.get(), memory.set];
}