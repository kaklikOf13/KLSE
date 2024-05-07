import { HashVector, NullVector, Vec, Vector } from "./geometry.ts"
import { Hitbox, NullHitbox } from "./hitbox.ts"
import { ID,Tags,combineWithoutEqual,random_id } from "./_utils.ts"

export type GameObjectID=ID
export type Categorys=Tags
export abstract class GameObject{
    public hb:Hitbox
    public destroyed:boolean
    public id:GameObjectID
    public parent:SimpleGameObjectsManager|null
    public overlaps:Categorys
    public collides:Categorys
    public get position():Vector{
        return this.hb ? this.hb.position : NullVector
    }
    constructor(){
        this.hb=new NullHitbox()
        this.destroyed=false
        this.id=0
        this.parent=null
        this.overlaps=[]
        this.collides=[]
    }
    abstract update():void
    on_collide_with(_obj:GameObject):void{}
    on_overlap_with(_obj:GameObject):void{}
    copy():GameObject{
        return Object.assign({}, this)
    }
}

interface ObjectKey {category:string,id:GameObjectID}
function newObjectKey(category:string,id:GameObjectID):ObjectKey{
    return {category:category,id:id}
}
interface Category {objs:Record<GameObjectID,GameObject>,orden:GameObjectID[]}
function newCategory():Category{
    return { objs:{}, orden:[]}
}

export class SimpleGameObjectsManager{
    public categorys:Record<string,Category>
    constructor(){
        this.categorys={}
    }
    // deno-lint-ignore no-explicit-any
    after_update():any{}
    begin_update(){}
    // deno-lint-ignore no-explicit-any
    update():any{
        this.begin_update()
        for(const c in this.categorys){
            for(let j=0;j<this.categorys[c].orden.length;j++){
                const i=this.categorys[c].orden[j]
                this.categorys[c].objs[i].update()
                if (this.categorys[c].objs[i].destroyed){
                    this.categorys[c].orden.splice(j,1)
                    delete this.categorys[c].objs[i]
                    j-=1
                    continue
                }
                this.update_object(newObjectKey(c,i))
            }
        }
        return this.after_update()
    }
    update_object(obj:ObjectKey){
        const obji=this.categorys[obj.category].objs[obj.id]
        const a=combineWithoutEqual(obji.collides,obji.overlaps)
        for(const c2 of a){
            for(const [_j2,i2] of this.categorys[c2].orden.entries()){
                this.solve_collision_normal(obj,newObjectKey(c2,i2))
                this.solve_collision_overlap(obj,newObjectKey(c2,i2))
            }
        }
    }
    solve_collision_overlap(objA:ObjectKey,objB:ObjectKey){
        if(!(objA.id==objB.id&&objA.category==objB.category)&&this.categorys[objA.category].objs[objA.id].hb.overlapCollision(this.categorys[objB.category].objs[objB.id].hb)){
            this.categorys[objA.category].objs[objA.id].on_overlap_with(this.categorys[objB.category].objs[objB.id])
        }
    }
    solve_collision_normal(objA:ObjectKey,objB:ObjectKey){
        if(!(objA.id==objB.id&&objA.category==objB.category)&&this.categorys[objA.category].objs[objA.id].hb.collidingWith(this.categorys[objB.category].objs[objB.id].hb)){
            this.categorys[objA.category].objs[objA.id].on_collide_with(this.categorys[objB.category].objs[objB.id])
        }
    }
    add_object(category:string,obj:GameObject,id?:GameObjectID){
        if(!id){
            id=random_id()
        }
        obj.id=id
        obj.parent=this
        this.categorys[category].objs[id]=obj
        this.categorys[category].orden.push(id)
    }
    get_object<Type extends GameObject>(category:string,id:GameObjectID):Type{
        // deno-lint-ignore ban-ts-comment
        //@ts-expect-error
        return this.categorys[category].objs[id]
    }
    add_category(name:string){
        this.categorys[name]=newCategory()
    }
}

interface Cell {pos:Vector,objs:Record<string,GameObjectID[]>}

export class CellsGameObjectsManager extends SimpleGameObjectsManager{
    public cells:Map<HashVector,Cell>
    //public cells:Map<HashVector,GameObjectID[]>
    public cellSize:number
    public threads:number
    constructor(threads=5,cellSize=32){
        super()
        this.threads=threads
        this.cellSize=cellSize
        this.cells=new Map()
    }
    override begin_update() {
        this.cells.clear()
    }
    // deno-lint-ignore no-explicit-any
    override after_update():any{
        const promisses=[]
        const ckeys=Array.from(this.cells.keys())
        const nf=Math.ceil(ckeys.length/this.threads)
        const nff=ckeys.length/nf
        for(let p=0;p<this.threads;p++){
            if((p+1)*nff>=ckeys.length){
                promisses.push(this.update_especific_cells(ckeys.slice(p*nff,ckeys.length)))
            }else{
                promisses.push(this.update_especific_cells(ckeys.slice(p*nff,(p+1)*nff)))
            }
        }
        return Promise.all(promisses)
    }
    override update_object(obj: ObjectKey): void {
        const c=Vec.floor(Vec.dscale(this.categorys[obj.category].objs[obj.id].position,this.cellSize))
        const ch=Vec.hash(c)
        if(this.cells.get(ch)){
            // deno-lint-ignore ban-ts-comment
            //@ts-expect-error
            this.cells.get(ch).objs[obj.category].push(obj.id)
        }else{
            this.cells.set(ch,{objs:{[obj.category]:[obj.id]},pos:c})
        }
    }
    update_especific_cells(keys:HashVector[]):Promise<void>{
        return new Promise((resolve, _reject)=>{
            for(const cc of keys){
                this.update_cell(cc)
            }
            resolve()
        })
    }
    update_cell(c:HashVector){
        // deno-lint-ignore ban-ts-comment
        //@ts-expect-error
        const cp=this.cells.get(c).pos
        for(let yy=-1; yy<=1; yy++){
            for(let xx=-1; xx<=1; xx++){
                const oc=Vec.new(cp.x+xx,cp.y+yy)
                const och=Vec.hash(oc)
                if(this.cells.get(och)){
                    // deno-lint-ignore ban-ts-comment
                    //@ts-expect-error
                    for(const cat1 of Object.keys(this.cells.get(c).objs)){
                        // deno-lint-ignore ban-ts-comment
                        //@ts-expect-error
                        if (!this.cells.get(c).objs[cat1]) continue
                        // deno-lint-ignore ban-ts-comment
                        //@ts-expect-error
                        for(const objA of this.cells.get(c).objs[cat1]){
                            const objAk=newObjectKey(cat1,objA)
                            for(const cat2 of this.categorys[cat1].objs[objA].collides){
                                // deno-lint-ignore ban-ts-comment
                                //@ts-expect-error
                                if (this.cells.get(c).objs[cat2]){
                                    // deno-lint-ignore ban-ts-comment
                                    //@ts-expect-error
                                    for(const objB of this.cells.get(c).objs[cat2]){
                                        this.solve_collision_normal(objAk,newObjectKey(cat2,objB))
                                    }
                                }
                            }
                            for(const cat2 of this.categorys[cat1].objs[objA].overlaps){
                                // deno-lint-ignore ban-ts-comment
                                //@ts-expect-error
                                if (this.cells.get(c).objs[cat2]){
                                    // deno-lint-ignore ban-ts-comment
                                    //@ts-expect-error
                                    for(const objB of this.cells.get(c).objs[cat2]){
                                        this.solve_collision_overlap(objAk,newObjectKey(cat2,objB))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}