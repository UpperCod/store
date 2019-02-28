let CURRENT_SPACE;

function join(parent, child) {
    return parent ? parent + child[0].toUpperCase() + child.slice(1) : child;
}

export function getCurrentSpace() {
    if (!CURRENT_SPACE) {
        throw new Error(
            "The hook can only be called from a running action from the Store"
        );
    }
    return CURRENT_SPACE;
}

export function Store(acts, state = {}, logger) {
    let actions = {},
        handlers = [];

    (function createActions(acts, parent = "") {
        for (let index in acts) {
            let value = acts[index],
                type = typeof value;
            if (type === "object") {
                createActions(value, join(parent, index));
                continue;
            }
            if (parent && type === "function") {
                let set = value => {
                        if (typeof value === "function") {
                            value = value(state[parent]);
                        }
                        if (state[parent] === value) return;
                        if (value instanceof Promise) {
                            value.then(set);
                        } else {
                            if (logger)
                                logger(
                                    parent + "." + index,
                                    state[parent],
                                    value
                                );
                            state = { ...state, [parent]: value };
                            handlers.forEach(handler => handler(state, parent));
                        }
                    },
                    get = selector =>
                        selector ? selector(state[parent]) : state[parent];

                if (!actions[parent]) actions[parent] = {};

                actions[parent][index] = payload => {
                    CURRENT_SPACE = [{ set, get }, actions[parent]];
                    set(value(get(), payload));
                    CURRENT_SPACE = false;
                };
            }
        }
    })(acts);

    function subscribe(handler, nameSpace) {
        handlers.push(handler);
        return function unsubscribe() {
            handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        };
    }

    return {
        subscribe,
        actions,
        get state() {
            return state;
        }
    };
}
