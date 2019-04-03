export function assign(master, commit) {
	for (let key in commit) {
		master[key] = commit[key];
	}
	for (let i = 2; i < arguments.length; i++) assign(master, arguments[i]);
	return master;
}

export function consumer(value, payload, get, set) {
	return Promise.resolve(value).then(value => {
		let state = get();
		if (typeof value == "function") {
			return consumer(value(state), payload, get, set);
		}
		if (typeof value == "object") {
			if (typeof value.next == "function") {
				return new Promise(resolve => {
					function scan(generator) {
						Promise.resolve(generator.next(get())).then(({ value, done }) =>
							consumer(value, null, get, set).then(() => {
								done ? resolve(get()) : scan(generator);
							})
						);
					}
					scan(value);
				});
			}
		}
		set(value);
		return state;
	});
}
/**
 * @param {object} reducers
 * @param {object} [state]
 * @param {Function} [logger]
 */
export function Store(reducers, state, logger) {
	let actions = {},
		handlers = [];

	state = state || {};

	function emit(space) {
		let length = handlers.length;
		for (let i = 0; i < length; i++) handlers[i](state, space);
	}

	function createAction(space, type, reducer) {
		let get = () => (space ? state[space] : state),
			set = value => {
				let localState = get();
				if (localState == state) return;
				if (logger) logger(space, type, localState, value);
				if (space) value = { [space]: assign({}, localState, value) };
				state = assign({}, state, value);
				emit(space);
			};
		if (space && !(space in state)) state[space] = {};
		return payload => consumer(reducer, payload, get, set);
	}

	function setActions(reducers, parent) {
		for (let space in reducers) {
			let reducer = reducers[space];
			if (typeof reducer == "object") {
				for (let type in reducer) {
					actions[space] = actions[space] || {};
					actions[space][type] = createAction(space, type, reducer[type]);
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
