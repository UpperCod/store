import {
    h,
    createContext,
    useContext,
    useEffect,
    useState
} from "@atomico/core";

let Context = createContext();

export function Provider({ children, store }) {
    return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function Consumer({ children, space }) {
    let [state, actions] = useStore(space);
    return children(state, actions);
}

export function useStore(nameSpace) {
    let { actions, state, subscribe } = useContext(Context),
        [ignore, setState] = useState();

    useEffect(() => {
        return subscribe((state, fromNameSpace) => {
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
