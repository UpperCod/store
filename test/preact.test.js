import { h, render } from "preact";
import { useEffect } from "preact/hooks";
import { initialState, createStore } from "./store";
import { Provider, useStore, Consumer } from "../components/preact";

function container() {
	return document.createElement("div");
}

let store = createStore();

describe("preact", () => {
	test("Provider", () => {
		let scope = container();
		function Test() {
			let [state, actions] = useStore();

			expect(actions).toBe(store.actions);
			expect(state).toBe(store.state);
		}
		render(
			<Provider store={store}>
				<Test />
			</Provider>,
			scope
		);
	});
	test("Provider with useStore", () => {
		let scope = container(),
			states = [0, 1],
			index = 0;
		function Test() {
			let [state, actions] = useStore();

			useEffect(() => {
				actions.increment();
			}, []);
			expect(state.value).toBe(states[index++]);
		}
		render(
			<Provider store={store}>
				<Test />
			</Provider>,
			scope
		);
	});

	test("Provider and Consumer", () => {
		let scope = container();
		function Test() {
			return (
				<Consumer>
					{(state, actions) => {
						expect(actions).toBe(store.actions);
						expect(state).toBe(store.state);
					}}
				</Consumer>
			);
		}
		render(
			<Provider store={store}>
				<Test />
			</Provider>,
			scope
		);
	});
});
