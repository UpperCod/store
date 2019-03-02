import { Store } from "../src";

function createStore() {
    return Store({
        count: {
            increment(state = 0) {
                return state + 1;
            },
            incrementPromise(state = 0) {
                return Promise.resolve(state + 1);
            }
        }
    });
}
describe("Store", () => {
    test("action subscribe", done => {
        let store = createStore();
        let unsubscribe = store.subscribe(state => {
            expect(state.count).toBe(1);
            unsubscribe();
        });
        store.actions.count.increment().then(() => {
            store.actions.count.increment();
            done();
        });
    });
});
