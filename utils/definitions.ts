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
}