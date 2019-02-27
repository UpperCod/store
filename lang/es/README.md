# @atomico/store

[![npm](https://badgen.net/npm/v/@atomico/store)](http://npmjs.com/@atomico/store)
[![gzip](https://badgen.net/bundlephobia/minzip/@atomico/store)](https://bundlephobia.com/result?p=@atomico/store)

pequeño y modular gestor de estados a base de acciones con alcance. 

## acción

las acciones son funciones que retorna un estado al momento de su ejecución, **este estado debe ser inmutable si se desea despachar una actualización**. las acciones en `@atomico/store`  no conocen su almacén ni su nameSpace reservado para almacenar su estado, esto trae como beneficio una acción completamente reutilizable.

### acción síncrona

```js
function increment(state=0){
    return state+1;
}
```

### acción con retorno asíncrono

```js
function increment(state=0){
    return Promise.resolve(state+1)
}
```


### acción asincrona

```js
async function increment(state=0){
    state = await Promise.resolve(state+1)
    return state;
}
```

### acción de proceso

mediante el hook `useSpace` ud puede acceder al nameSpace asociado a la acción, este retorna  2 métodos para trabajar con el nameSpace :

* `set(nextState)` : actualiza el estado asociado al nameSpace.
* `get()`: permite obtener el estado actual.

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

el store permite agrupar acciones y estado en nameSpaces que se crean a base del árbol de acciones.

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

>  El Store anula la profundidad de manipulación de las acciones solo a un primer índice.

## Componentes

`@atomico/store/components` ofrece acceso al store mediante componentes y hooks.

### Provider

Contexto necesario para invocar `useStore` en tiempo de ejecución del componente.

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

permite consumir y suscribirse al contenido del store.

```jsx
<Consumer space={optionalSpace}>
    {(state,actions)=>{

    }}
</Consumer>
```

### useStore

useStore accede al contexto creado por el componente `Provider`, obteniendo por defecto las acciones y el estado global. este hook también permite la suscrición ante los cambios del store.

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

### useStore con nameSpace

permite suscribirse a los cambios solo de un nameSpace, a su vez agrupa las acciones evitando el uso del selector de espacio.

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
