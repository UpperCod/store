export function Store(reducers, state = {}, logger) {
    let actions = {},
        handlers = [];

    function setSpace(space, action, value, deep = 0) {
        return Promise.resolve(
            typeof value === "function" ? value(state[space], action) : value
        ).then(value => {
            if (typeof value === "object") {
                if (typeof value.next === "function") {
                    return new Promise(resolve => {
                        function scan(generator) {
                            Promise.resolve(generator.next(state[space])).then(
                                ({ value, done }) => {
                                    setSpace(
                                        space,
                                        action,
                                        value,
                                        deep + 1
                                    ).then(() => {
                                        if (done) {
                                            resolve(state);
                                        } else {
                                            scan(generator);
                                        }
                                    });
                                }
                            );
                        }
                        scan(value);
                    });
                }
            }
            if (value !== state[space]) {
                if (logger) logger(space, action, state[space], value, deep);
                state = { ...state, [space]: value };
                let length = handlers.length;
                for (let i = 0; i < length; i++) handlers[i](state, space);
            }
            return state;
        });
    }

    function createAction(space, reducer) {
        let action = action => setSpace(space, action, reducer);
        if (typeof Proxy === "function") {
            action = new Proxy(action, {
                get: (target, type) => value => target({ type, value })
            });
        }
        actions[space] = action;
    }

    function setActions(reducers) {
        for (let key in reducers) createAction(key, reducers[key]);
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
