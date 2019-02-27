#@atomico/store

pequeño y modular gestor de estados a base de acciones con alcance.

# acion sincrona

```js
function increment(state=0){
    return state+1;
}
```

# acion con retorno asincrono

```js
function increment(state=0){
    return Promise.resolve(state+1)
}
```

# acion de proceso



```js
import {useSpace} from "@atomico/store";

function request(state={},url){
    if(state.loading)return state;

    let [set] = useSpace();

    fetch(url)
    .then(res=>res.json())
    .then((data)=>set(loading:false,data));

    return {loading:true};
}
```
