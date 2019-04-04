# @atomico/store

[![npm](https://badgen.net/npm/v/@atomico/store)](http://npmjs.com/@atomico/store)
[![gzip](https://badgen.net/bundlephobia/minzip/@atomico/store)](https://bundlephobia.com/result?p=@atomico/store)

Pequeño gestor de estados asíncrono, capas de consumir Promesas y Generadores.

```js
import {Store,setLog} from "@atomico/store";

async function *request(state,url){
	if(state.loading) return state;// ignore update
	
	yield {loading:true}; 
  
	let req = await fetch(url),
		data = await req.json();
	
	return {loading:false,data};
}

class StoreFetch extends Store{
    static actions = { request }
}

let store = new StoreFetch;

store.subscribe((state)=>{
    console.log(state);
})

store.actions.request("https://jsonplaceholder.typicode.com/posts");
```

