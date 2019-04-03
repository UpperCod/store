import { h, render, useEffect } from "@atomico/core";
import { Store } from "../src";
import { Provider, useStore, Consumer } from "../components/atomico";

function increment({ value = 0 }) {
	value++;
	return { value };
}

let store = Store(
	{
		count: { increment }
	},
	{
		count: { value: 0 }
	}
);

function container() {
	return document.createElement("div");
}

describe("atomico", () => {
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
				actions.count.increment();
			}, []);
			expect(state.count.value).toBe(states[index++]);
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

	test("Provider and Consumer space", () => {
		let scope = container();
		function Test() {
			return (
				<Consumer space="count">
					{(state, actions) => {
						expect(actions).toBe(store.actions.count);
						expect(state).toBe(store.state.count);
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
