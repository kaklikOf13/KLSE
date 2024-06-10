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