export type ID=number
export function random_id():ID{
    return Math.floor(Math.random() * 4294967296)
}
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
                resultado.push(elemento);
            }
        }
    }

    return resultado;
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
    private frameDuration: number;
    private lastFrameTime: number;
    public timeScale: number;

    constructor(targetFPS: number, timeScale: number) {
        this.frameDuration = 1000 / targetFPS;
        this.lastFrameTime = Date.now();
        this.timeScale = timeScale;
    }

    // deno-lint-ignore ban-types
    public tick(callback:Function){
        const currentTime = Date.now();
        const elapsedTime=(currentTime-this.lastFrameTime)
        const next_frame=(this.frameDuration-elapsedTime)
        setTimeout(()=>{
            this.lastFrameTime=currentTime
            callback()
            return 0
        },next_frame)
    }
}