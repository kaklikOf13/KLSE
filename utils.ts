export type ID=number
export function random_id():ID{
    return Math.floor(Math.random() * 4294967296)
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

export type SignalCallback<T> = (data: T) => void

export class SignalManager<T> {
    private listeners: Map<string, SignalCallback<T>[]>

    constructor() {
        this.listeners = new Map<string, SignalCallback<T>[]>()
    }

    public on(signal: string, callback: SignalCallback<T>): void {
        if (!this.listeners.has(signal)) {
            this.listeners.set(signal, [])
        }
        this.listeners.get(signal)!.push(callback)
    }

    public off(signal: string, callback: SignalCallback<T>): void {
        const signalListeners = this.listeners.get(signal)
        if (signalListeners) {
            const index = signalListeners.indexOf(callback)
            if (index !== -1) {
                signalListeners.splice(index, 1)
            }
        }
    }

    public emit(signal: string, data: T): void {
        const signalListeners = this.listeners.get(signal)
        if (signalListeners) {
            for (const listener of signalListeners) {
                listener(data)
            }
        }
    }

    public clear(signal: string): void {
        this.listeners.delete(signal)
    }
}