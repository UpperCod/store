import { Store } from "../src";

describe("Store", () => {
    let store = Store({
        count: {
            increment(state = 0) {
                return state + 1;
            },
            incrementPromise(state = 0) {
                return Promise.resolve(state + 1);
            }
        }
    });
    test("action subscribe", () => {
        let unsubscribe = store.subscribe(state => {
            expect(state.count).toBe(1);
            unsubscribe();
        });
        store.actions.count.increment(); // 1
        store.actions.count.increment(); // 2
    });
    test("action async promise", done => {
        let unsubscribe = store.subscribe(state => {
            expect(state.count).toBe(3);
            unsubscribe();
            done();
        });
        store.actions.count.incrementPromise();
    });
});
