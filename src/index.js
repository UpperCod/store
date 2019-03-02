let CURRENT_SPACE;

function join(parent, child) {
    return parent ? parent + child[0].toUpperCase() + child.slice(1) : child;
}

export function Store(acts, state = {}, logger) {
    let actions = {},
        handlers = [];

    function setSpace(space, action, value, payload) {
        return Promise.resolve(
            typeof value === "function" ? value(state[space], payload) : value
        ).then(value => {
            if (typeof value === "object") {
                if (typeof value.next === "function") {
                    return new Promise(resolve => {
                        function scan(generator) {
                            Promise.resolve(generator.next(state[space])).then(
                                ({ value, done }) => {
                                    setSpace(space, action, value).then(() => {
                                        if (done) {
                                            resolve();
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
                if (logger) {
                    logger(space + "." + action, state[space], value);
                }
                state = { ...state, [space]: value };
                handlers.forEach(handler => handler(state, space));
            }
        });
    }
    function setActions(acts, parent = "") {
        for (let index in acts) {
            let value = acts[index],
                type = typeof value;
            if (type === "object") {
                setActions(value, join(parent, index));
                continue;
            }
            if (parent && type === "function") {
                //########## v1 with async
                //let set = async (value, payload) => {
                //        let prevValue = state[parent];
                //        if (typeof value === "function") {
                //            value = await value(prevValue, payload);
                //        } else {
                //            value = await value;
                //        }
                //        if (typeof value === "object") {
                //            if (typeof value.next === "function") {
                //                return await new Promise(resolve => {
                //                    async function scan(generator) {
                //                        let {
                //                            done,
                //                            value
                //                        } = await generator.next(prevValue);
                //                        await set(value);
                //                        if (!done) {
                //                            scan(generator);
                //                        } else {
                //                            resolve();
                //                        }
                //                    }
                //                    scan(value);
                //                });
                //            }
                //        }
                //        if (value !== prevValue) {
                //            if (logger) {
                //                logger(parent + "." + index, prevValue, value);
                //            }
                //            state = { ...state, [parent]: value };
                //            handlers.forEach(handler => handler(state, parent));
                //        }
                //    },
                //########## v1.1  without polyfills

                if (!actions[parent]) actions[parent] = {};
                actions[parent][index] = payload =>
                    setSpace(parent, index, value, payload);
            }
        }
    }

    function subscribe(handler, space) {
        handlers.push(handler);
        return function unsubscribe() {
            handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        };
    }

    setActions(acts);

    return {
        setActions,
        subscribe,
        actions,
        get state() {
            return state;
        }
    };
}
