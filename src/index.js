export function Store(reducers, state, logger) {
    let actions = {},
        handlers = [];

    function getSpace(space) {
        return space ? state[space] : state;
    }
    function setSpace(space, type, value, payload) {
        return Promise.resolve(value).then(value => {
            let localState = getSpace(space);
            if (typeof value === "function")
                return setSpace(space, type, value(localState, payload));

            if (typeof value === "object") {
                if (typeof value.next === "function") {
                    return new Promise(resolve => {
                        function scan(generator) {
                            Promise.resolve(
                                generator.next(getSpace(space))
                            ).then(({ value, done }) =>
                                setSpace(space, type, value).then(() => {
                                    if (done) {
                                        resolve(state);
                                    } else {
                                        scan(generator);
                                    }
                                })
                            );
                        }
                        scan(value);
                    });
                }
            }
            if (value !== localState) {
                if (logger) logger(space, type, localState, value);
                if (space) {
                    let nextState = {};
                    for (let key in state) {
                        nextState[key] = state[key];
                    }
                    nextState[space] = value;
                    value = nextState;
                }
                state = value;
                let length = handlers.length;
                for (let i = 0; i < length; i++) handlers[i](state, space);
            }
            return state;
        });
    }

    function createAction(space, type, reducer) {
        return payload => setSpace(space, type, reducer, payload);
    }

    function setActions(reducers, parent) {
        for (let space in reducers) {
            let reducer = reducers[space];
            if (typeof reducer === "object") {
                for (let type in reducer) {
                    actions[space] = actions[space] || {};
                    actions[space][type] = createAction(
                        space,
                        type,
                        reducer[type]
                    );
                }
            } else {
                actions[space] = createAction(null, space, reducer);
            }
        }
    }

    function subscribe(handler, space) {
        handlers.push(handler);
        return function unsubscribe() {
            handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        };
    }

    setActions(reducers);

    return {
        setActions,
        actions,
        subscribe,
        get state() {
            return state;
        }
    };
}
