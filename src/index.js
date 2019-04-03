import { assign, consumer } from "./utils";
/**
 * @type {Function}
 */
let LOG;

/**
 * @param {Function} log - It allows to add a global observer of all the changes of states.
 */
export function setLog(log) {
	LOG = log;
}
/**
 * @class
 */
export class Store {
	/**
	 * @param {object} [state={}] - initial state of the store
	 */
	constructor(state) {
		/** @type {Object<string,Object>} */
		this.state = state || {};
		/** @type {Object<string,Action>} */
		this.actions = {};
		/** @type {Function[]} */
		this.handlers = [];
		let { actions } = this.constructor;
		this.setActions(actions);
	}
	/**
	 * Dispatch to Store subscribers, a change within the state
	 * @param {string} [action] - define the origin of the update
	 */
	dispatch(action) {
		let { handlers } = this,
			length = handlers.length;
		for (let i = 0; i < length; i++) handlers[i](this.state, action);
	}
	/**
	 * It allows defining a group of actions for the Store
	 * @param {Object} actions
	 */
	setActions(actions) {
		for (let name in actions) this.setAction(name, actions[name]);
	}
	/**
	 * Record an action in `this.actions`
	 * @param {string} name
	 * @param {Function} value
	 */
	setAction(name, value) {
		let set = value => {
			if (LOG) LOG(this, name, value);
			this.state = assign({}, this.state, value);
			this.dispatch(name);
		};

		if (typeof value == "function") {
			let action, instance;
			if (value.prototype instanceof Store) {
				instance = new value(this.state[name]);
			} else if (value instanceof Store) {
				instance = value;
			} else {
				action = payload => {
					return consumer(value, payload, () => this.state, set);
				};
			}
			if (instance) {
				action = instance.actions;
				instance.subscribe(value => set({ [name]: value }));
				this.state[name] = instance.state;
			}
			this.actions[name] = action;
		}
	}
	/**
	 * Allows you to add a subscriber to the store,
	 * this subscriber will receive as first parameter
	 * @param {(state:Object,action:string)} handler
	 * @return {Function} Allows deleting the store's subscriber
	 */
	subscribe(handler) {
		let { handlers } = this;
		handlers.push(handler);
		return function unsubscribe() {
			handlers.splice(handlers.indexOf(handler) >>> 0, 1);
		};
	}
}
