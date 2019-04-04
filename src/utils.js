export function assign(master, commit) {
	for (let key in commit) {
		master[key] = commit[key];
	}
	for (let i = 2; i < arguments.length; i++) assign(master, arguments[i]);
	return master;
}
/**
 * It allows to consume functions, generators and promises
 * @param {*} value
 * @param {*} payload
 * @param {Function} get
 * @param {(state:Object)} set
 * @returns {Promise}
 */
export function consumer(value, payload, get, set) {
	return Promise.resolve(value).then(value => {
		let state = get();
		if (typeof value == "function") {
			return consumer(value(state, payload), null, get, set);
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
