export type ID=number
export function splitPath(path:string):string[]{
    const ret=path.split(/[\\/]/)
    for(let i=0;i<ret.length;i++){
        if(ret[i]==""){
            ret.splice(i,1)
            i--
        }
    }
    if(ret.length==0){
        ret.push("")
    }
    return ret
}
export type Tags=string[]
export function hasTag(tags:Tags,tag:string):boolean{
    return tags.includes(tag)
}
export function hasTags(tags1:Tags,tags2:Tags):boolean{
    for(const t of tags1){
        if (tags2.includes(t)){
            return true
        }
    }
    return false
}
export function combineWithoutEqual<T>(...arrays: T[][]): T[] {
    const resultado: T[] = []

    for (const array of arrays) {
        for (const elemento of array) {
            if (!resultado.includes(elemento)) {
                resultado.push(elemento)
            }
        }
    }

    return resultado
}

export class SignalManager {
    // deno-lint-ignore ban-types
    protected listeners: Map<string, Function[]>

    constructor() {
        this.listeners = new Map()
    }

    // deno-lint-ignore ban-types
    on(signal: string, callback: Function): void {
        if (!this.listeners.has(signal)) {
            this.listeners.set(signal, [])
        }
        this.listeners.get(signal)!.push(callback)
    }

    // deno-lint-ignore ban-types
    off(signal: string, callback: Function): void {
        const signalListeners = this.listeners.get(signal)
        if (signalListeners) {
            const index = signalListeners.indexOf(callback)
            if (index !== -1) {
                signalListeners.splice(index, 1)
            }
        }
    }

    // deno-lint-ignore no-explicit-any
    emit(signal: string, ...parameters:any[]): void {
        const signalListeners = this.listeners.get(signal)
        if (signalListeners) {
            for (const listener of signalListeners) {
                listener(...parameters)
            }
        }
    }

    clear(signal: string): void {
        this.listeners.delete(signal)
    }
    clearAll(): void {
        this.listeners.clear()
    }
}

export class Clock {
    private frameDuration: number
    private lastFrameTime: number
    public timeScale: number

    constructor(targetFPS: number, timeScale: number) {
        this.frameDuration = 1000 / targetFPS
        this.lastFrameTime = Date.now()
        this.timeScale = timeScale
    }

    // deno-lint-ignore ban-types
    public tick(callback:Function){
        const currentTime = Date.now()
        const elapsedTime=(currentTime-this.lastFrameTime)
        const next_frame=(this.frameDuration-elapsedTime)
        setTimeout(()=>{
            this.lastFrameTime=currentTime
            callback()
            return 0
        },next_frame)
    }
}

//Credits Adaptable part of Suroi.io code
export interface DeepCloneable<T> {
    [cloneDeepSymbol](): T
}
export const cloneSymbol: unique symbol = Symbol("clone")
export const cloneDeepSymbol: unique symbol = Symbol("clone deep")

export interface Cloneable<T> {
    [cloneSymbol](): T
}
// deno-lint-ignore no-explicit-any
export type Func = (...args: any[]) => unknown;
export type DeepPartial<T> = {
    [K in keyof T]?: DeepPartial<T[K]>;
};

export function cloneDeep<T>(object: T): T {
    const clonedNodes = new Map<unknown, unknown>();

    return (function internal<T>(target: T): T {
        if (typeof target!=="object" && !Array.isArray(target)) return target
        if (clonedNodes.has(target)) return clonedNodes.get(target) as T

        if (cloneDeepSymbol in target!) {
            const clone = target[cloneDeepSymbol]
            if (typeof clone === "function" && clone.length === 0) {
                return clone.call(target)
            } else {
                console.warn(`Inappropriate use of ${cloneDeepSymbol.toString()}: it should be a no-arg function`)
            }
        }

        const copyAllPropDescs = <T>(
            to: T,
            entryFilter: (entry: readonly [string, TypedPropertyDescriptor<unknown>]) => boolean = () => true
        ): T => {
            for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(target)).filter(entryFilter)) {
                desc.value = internal(target![key as keyof typeof target])
                Object.defineProperty(to, key, desc)
            }
            return to
        };

        const prototype = Object.getPrototypeOf(target) as object | null

        switch (true) {
            case target instanceof Array: {
                const root = Object.create(prototype) as T & unknown[]
                clonedNodes.set(target, root)

                for (let i = 0, l = target.length; i < l; i++) {
                    root[i] = internal(target[i])
                }

                return copyAllPropDescs(root, ([key]) => Number.isNaN(+key));
            }
            case target instanceof Map: {
                const root = new Map<unknown, unknown>()
                clonedNodes.set(target, root)

                for (const [k, v] of (target as T & Map<unknown, unknown>).entries()) {
                    root.set(internal(k), internal(v))
                }

                Object.setPrototypeOf(root, prototype)
                return copyAllPropDescs(root as T)
            }
            case target instanceof Set: {
                const root = new Set<unknown>()
                clonedNodes.set(target, root)

                for (const v of target) root.add(internal(v))

                Object.setPrototypeOf(root, prototype)
                return copyAllPropDescs(root as T)
            }
            default: {
                const clone = Object.create(prototype) as T
                clonedNodes.set(target, clone)

                return copyAllPropDescs(clone)
            }
        }
    })(object)
}

export function mergeDeep<T extends object>(target:T,...sources: Array<DeepPartial<T>>):T{
    if(!sources.length)return target

    const[source,...rest]=sources

    type StringKeys=keyof T&string
    type SymbolKeys=keyof T&symbol

    for (
        const key of (
            Object.keys(source) as Array<StringKeys|SymbolKeys>
        ).concat(Object.getOwnPropertySymbols(source) as SymbolKeys[])
    ) {
        const [sourceProp,targetProp]=[source[key],target[key]]
        if (typeof sourceProp==="object"&&!Array.isArray(sourceProp)){
            if(typeof targetProp==="object"&&!Array.isArray(sourceProp)){
                mergeDeep(targetProp!,sourceProp as DeepPartial<T[keyof T]&object>)
            }else{
                target[key]=cloneDeep(sourceProp)as T[StringKeys]&T[SymbolKeys]
            }
            continue
        }
        target[key]=sourceProp as T[StringKeys]&T[SymbolKeys]
    }

    return mergeDeep(target,...rest)
}