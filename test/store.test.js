import { Store } from "../src";

function createStore() {
    return Store({
        count(state = 0, { type, value }) {
            switch (type) {
                case "increment":
                    return state + 1;
                default:
                    return state;
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
