import { Store } from "../src";

function createStore() {
	return Store({
		count: {
			increment({ value = 0 }) {
				value++;
				return { value };
			}
		}
	});
}
describe("Store", () => {
	test("action subscribe", async done => {
		let store = createStore();
		let unsubscribe = store.subscribe(state => {
			expect(state.count.value).toBe(1);
			unsubscribe();
		});
		await store.actions.count.increment();
		await store.actions.count.increment();
		done();
	});
});
