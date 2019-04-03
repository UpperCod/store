import { assign, consumer } from "./utils";

let LOG = false;

export function setLog(log) {
	LOG = log;
}

export class Store {
	constructor(state) {
		this.state = state || {};
		this.actions = {};
		this.handlers = [];
		let { actions } = this.constructor;
		this.setActions(actions);
	}
	dispatch(action) {
		let { handlers } = this,
			length = handlers.length;
		for (let i = 0; i < length; i++) handlers[i](this.state, action);
	}
	setActions(actions) {
		for (let name in actions) this.setAction(name, actions[name]);
	}
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
	subscribe(handler) {
		let { handlers } = this;
		handlers.push(handler);
		return () => {
			handlers.splice(handlers.indexOf(handler) >>> 0, 1);
		};
	}
}
