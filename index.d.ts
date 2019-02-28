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

interface Logger{
    (action:string, prevValue:any,nextValue:any):void
}

interface Space{
    0:{
        set(nextValue:any):void;
        get(selector?:Function):any;
    },
    1:object
}

declare module "@atomico/store" {
    export function Store(actions:object,state:object,logger?:Logger):Store;
    export function getCurrentSpace():Space;
}

interface PropsProvider{
    store : object
}

interface PropsConsumer{
    space ?: string
}

declare module "@atomico/store/components"{
    export function Provider(props:PropsProvider):object;
    export function Consumer(props:PropsConsumer):object;
    export function useStore(space?:string):[any,object];
}
