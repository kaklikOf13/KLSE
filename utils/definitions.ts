import { splitPath } from "./_utils.ts"

export class Definitions<Type>{
    value:Record<string,Type>
    constructor(){
        this.value={}
    }
    get(name:string=""):Type{
        return this.value[name]
    }
    define(value:Type,name:string=""){
        Object.defineProperty(this.value,name,{value:value})
    }
    delete(name:string){
        delete this.value[name]
    }
    list():string[]{
        return Object.keys(this.value)
    }
}
export class Tree<Type> extends Definitions<Type>{
    childs:Record<string,Tree<Type>>
    constructor(){
        super()
        this.childs={}
    }
    define_tree(name:string):Tree<Type>{
        Object.defineProperty(this.childs,name,{
            value:new Tree<Type>
        })
        return this.childs[name]
    }
    get_tree(name:string):Tree<Type>{
        return this.childs[name]
    }
    delete_tree(name:string){
        delete this.childs[name]
    }
    list_tree():string[]{
        return Object.keys(this.childs)
    }
    exist_tree(tree:string):boolean{
        return this.childs[tree]!=undefined
    }
    //** mysub/sub/1 */
    get_item(name:string):Type|undefined{
        const divisions:string[]=splitPath(name)
        // deno-lint-ignore no-this-alias
        let act:Tree<Type>=this
        for(let i=0;i<divisions.length;i++){
            const d=divisions[i]
            if(act.exist_tree(d)){
                act=this.get_tree(d)
            }else if(act.value[d]!=undefined){
                return act.value[d]
            }else{
                return undefined
            }
        }
    }
}
export class Server{
    IP:string
    Port:number
    HTTP:boolean
    constructor(IP:string,Port:number,HTTP:boolean=false){
        this.IP=IP
        this.Port=Port
        this.HTTP=HTTP
    }
    toString():string{
        return `${this.HTTP ? "s" : ""}://${this.IP}:${this.Port}`
    }
}
export class ExtendedMap<K, V> extends Map<K, V> {
    private _get(key: K): V {
        // it's up to callers to verify that the key is valid
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return super.get(key)!;
    }

    /**
     * Retrieves the value at a given key, placing (and returning) a user-defined
     * default value if no mapping for the key exists
     * @param key      The key to retrieve from
     * @param fallback A value to place at the given key if it currently not associated with a value
     * @returns The value emplaced at key `key`; either the one that was already there or `fallback` if
     *          none was present
     */
    getAndSetIfAbsent(key: K, fallback: V): V {
        // pretty obvious why this is okay
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.has(key)) return this.get(key)!;

        this.set(key, fallback);
        return fallback;
    }

    /**
     * Retrieves the value at a given key, placing (and returning) a user-defined
     * default value if no mapping for the key exists
     * @param key      The key to retrieve from
     * @param fallback A function providing a value to place at the given key if it currently not
     *                 associated with a value
     * @returns The value emplaced at key `key`; either the one that was already there
     *          or the result of `fallback` if none was present
     */
    getAndGetDefaultIfAbsent(key: K, fallback: () => V): V {
        // pretty obvious why this is okay
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.has(key)) return this.get(key)!;

        const value = fallback();
        this.set(key, value);
        return value;
    }

    ifPresent(key: K, callback: (obstacle: V) => void): void {
        this.ifPresentOrElse(key, callback, () => { /* no-op */ });
    }

    ifPresentOrElse(key: K, callback: (obstacle: V) => void, ifAbsent: () => void): void {
        const mappingPresent = super.has(key);

        if (!mappingPresent) {
            return ifAbsent();
        }

        callback(this._get(key));
    }

    mapIfPresent<U = V>(key: K, mapper: (value: V) => U): U | undefined {
        if (!super.has(key)) return undefined;

        return mapper(this._get(key));
    }
}