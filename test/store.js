import { Store } from "../src";

export let initialState = {
	value: 0
};
export function createStore() {
	return new class extends Store {
		static actions = {
			increment({ value = 0 }) {
				value++;
				return { value };
			}
		};
	}(initialState);
}
