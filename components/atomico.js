import {
    h,
    createContext,
    useContext,
    useEffect,
    useState
} from "@atomico/core";

let Context = createContext();

export function Provider({ children, store }) {
    return <Context.Provider value={store}>{children[0]}</Context.Provider>;
}

export function Consumer({ children, space }) {
    let [state, actions] = useStore(space);
    return children[0](state, actions);
}

export function useStore(nameSpace) {
    let { actions, state, subscribe } = useContext(Context),
        [ignore, setState] = useState();

    useEffect(() => {
        return subscribe((state, fromNameSpace) => {
            if (nameSpace) {
                if (fromNameSpace === nameSpace) {
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
