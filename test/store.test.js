import { createStore } from "./store";

let store = createStore();

describe("Store", () => {
	test("action subscribe", async done => {
		let store = createStore();
		let unsubscribe = store.subscribe(state => {
			expect(state.value).toBe(1);
			unsubscribe();
		});
		await store.actions.increment();
		await store.actions.increment();
		done();
	});
});
