interface Action{
    (state:any,payload?:any)
}

interface ActionsNameSpaces{
    [nameSpace: string]:{
        [action: string]:Action
    }
}

interface Store{
    readonly state: object,
    readonly actions: ActionsNameSpaces,
    subscribe(handler:Function, space?:String):any
}

declare module "@atomico/store" {
    export function Store(actions:object,state:object):Store
}
  
