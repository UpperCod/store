export default function(h, useState, useEffect, useContext, createContext) {
	let Context = createContext();

	function Provider({ children, store }) {
		return <Context.Provider value={store}>{children}</Context.Provider>;
	}

	function Consumer({ children, space }) {
		let [state, actions] = useStore(space);
		return children(state, actions);
	}

	function useStore(nameSpace) {
		let store = useContext(Context),
			[ignore, setState] = useState(),
			{ actions, state } = store;

		useEffect(() => {
			return store.subscribe((state, fromNameSpace) => {
				if (nameSpace) {
					if (fromNameSpace == nameSpace || fromNameSpace == null) {
						setState();
					}
				} else {
					setState();
				}
			});
		}, [actions]);

		return nameSpace
			? [state[nameSpace], actions[nameSpace]]
			: [state, actions];
	}

	return { Provider, Consumer, useStore };
}
