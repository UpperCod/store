# @atomico/store

[create by Uppercod](https://github.com/uppercod)

small and modular state manager based on actions with scope(nameSpace).

## action

actions are functions that return a state at the time of execution, **this state must be immutable if you want to dispatch an update**. the actions in `@atomico/store` do not know their store or their nameSpace reserved to store their status, this brings as a benefit a completely reusable action.

### synchronous action

```js
function increment(state=0){
    return state+1;
}
```

### action with asynchronous return

```js
function increment(state=0){
    return Promise.resolve(state+1)
}
```


### asynchronous action

```js
async function increment(state=0){
    state = await Promise.resolve(state+1)
    return state;
}
```

### process action

using the hook `useSpace` you can access the nameSpace associated with the action, it returns 2 methods to work with the nameSpace:


* `set(nextState)` : Updates the state associated with the nameSpace.
* `get()`: allows you to obtain the current status.

```js
import {useSpace} from "@atomico/store";

function request(state={},url){
    if(state.loading)return state;
    
    let [set,get] = useSpace();

    fetch(url)
    .then(res=>res.json())
    .then((data)=>set(loading:false,data));

    return {loading:true};
}
```

## Store

The store allows grouping actions and status in nameSpaces that are created based on the actions tree.

```js
import { Store } from "@atomico/store";
import {increment,decrement} from "./actions/counter";

let store = Store({
    count1 : {increment,decrement},
    count2 : {increment,decrement},
    count3 : {increment,decrement}
},{count1 : 0 , count2: 2, count:4})

store.actions.count1.increment() // store.state.count1 = 1
store.actions.count2.increment() // store.state.count2 = 3
store.actions.count3.increment() // store.state.count3 = 5
```

>  The Store cancels the depth of manipulation of the actions only to a first index.

## Components

`@atomico/store/components` allows access to the store through components and hooks.

### Provider

Necessary context to invoke `a Store` at component runtime.

```jsx
import { h, render } from "@atomico/core";
import { Store } from "@atomico/store";
import { Provider } from "@atomico/store/components";
import App from "./app";

let store = Store(
    // actions
    {count : {
        increment(state){
            return state+1
        }
    }},
    // initialState
    {count:0}
)

render(
    <Provider store={store}>
        <App/>
    </Provider>
)
```

### Consumer

allows you to consume and subscribe to the content of the store.

```jsx
<Consumer space={optionalSpace}>
    {(state,actions)=>{

    }}
</Consumer>
```

### useStore

useStored to access the context created by the `<Provider/>` component, obtaining by default the actions and the global state. this hook also allows the suscrición before the changes of the store.

```jsx
import { h } from "@atomico/core";
import { useStore } from "@atomico/store/components";

export function App(){
    let [ state ,actions]= useStore();

    return <div>
        <h1>count : {state.count}</h1>
        <button onClick={action.count.increment}>increment</button>  
    </div>
}
```

### useStore with nameSpace

allows to subscribe to changes only from a nameSpace, in turn groups the actions avoiding the use of the space selector.

```jsx
import { h } from "@atomico/core";
import { useStore } from "@atomico/store/components";

export function App(){
    let [ state, actions ] = useStore("count");

    return <div>
        <h1>count : {state}</h1>
        <button onClick={action.increment}>increment</button>  
    </div>
}
```
