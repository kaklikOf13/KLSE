export type ID=number
export function random_id():ID{
    return Math.floor(Math.random() * 4294967296)
}

export type Tags=string[]
export function hasTag(tags1:Tags,tags2:Tags):boolean{
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