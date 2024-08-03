import { v2, v3, Vec2, Vec3 } from "./geometry.ts"
import { type Hitbox2D, NullHitbox2D, Hitbox3D, NullHitbox3D } from "./hitbox.ts"
import { type ID, type Tags } from "./_utils.ts"
import { NetStream } from "./stream.ts";
import { random } from "./random.ts";
import { ObjectsPacket } from "./packets.ts";
export type GameObjectID=ID
export abstract class BaseObject2D{
    public hb:Hitbox2D
    public destroyed:boolean
    public id!:GameObjectID
    public category!:string
    public calldestroy:boolean=true
    public dirty:boolean=false
    public dirtyPart:boolean=false
    abstract objectType:string
    // deno-lint-ignore no-explicit-any
    public manager!:GameObjectManager2D<any>
    public get position():Vec2{
        return this.hb ? this.hb.position : v2.new(0,0)
    }
    set position(val:Vec2){
        this.hb.position=val
    }
    constructor(){
        this.hb=new NullHitbox2D()
        this.destroyed=false
    }
    abstract update():void
    // deno-lint-ignore no-explicit-any
    abstract create(args:Record<string,any>):void
    abstract encodePart(stream:NetStream):void
    abstract decodePart(stream:NetStream):void
    abstract encodeComplete(stream:NetStream):void
    abstract decodeComplete(stream:NetStream):void
    onDestroy():void{}
    get_key():ObjectKey{
        return {category:this.category,id:this.id}
    }
}
export abstract class BaseObject3D{
    public hb:Hitbox3D
    public destroyed:boolean
    public id!:GameObjectID
    public category!:string
    public calldestroy:boolean=true
    public dirty:boolean=false
    public dirtyPart:boolean=false
    abstract objectType:string
    // deno-lint-ignore no-explicit-any
    public manager!:GameObjectManager2D<any>

    public get position():Vec3{
        return this.hb ? this.hb.transform.position : v3.new(0,0,0)
    }
    set position(val:Vec3){
        this.hb.transform.position=val
    }

    public get scale():Vec3{
        return this.hb ? this.hb.transform.scale : v3.new(0,0,0)
    }
    set scale(val:Vec3){
        this.hb.transform.scale=val
    }

    public get rotation():Vec3{
        return this.hb ? this.hb.transform.rotation : v3.new(0,0,0)
    }
    set rotation(val:Vec3){
        this.hb.transform.rotation=val
    }

    constructor(){
        this.hb=new NullHitbox3D()
        this.destroyed=false
    }
    abstract update():void
    // deno-lint-ignore no-explicit-any
    abstract create(args:Record<string,any>):void
    abstract encodePart(stream:NetStream):void
    abstract decodePart(stream:NetStream):void
    abstract encodeComplete(stream:NetStream):void
    abstract decodeComplete(stream:NetStream):void
    onDestroy():void{}
    get_key():ObjectKey{
        return {category:this.category,id:this.id}
    }
}


export interface ObjectKey {category:string,id:GameObjectID}
export interface Category2D<GameObject extends BaseObject2D> {objects:Record<GameObjectID,GameObject>,orden:number[]}
export interface Category3D<GameObject extends BaseObject3D> {objects:Record<GameObjectID,GameObject>,orden:number[]}
export class CellsManager2D<GameObject extends BaseObject2D=BaseObject2D>{
    objects:Record<string,Record<GameObjectID,GameObject>>={}
    cellSize:number
    cells:Record<number,Record<number,Record<string,GameObject[]>>>
    constructor(cellSize:number=32){
        this.cellSize=cellSize
        this.cells={}
    }

    registry(obj:GameObject){
        if(!this.objects[obj.category]){
            this.objects[obj.category]={}
        }
        if(this.objects[obj.category][obj.id]){
            throw new Error(`Existent Object ${obj.id} In Cell`)
        }
        this.objects[obj.category][obj.id]=obj
    }
    unregistry(obj:ObjectKey){
        if(!(this.objects[obj.category]&&this.objects[obj.category][obj.id])){
            throw new Error(`Invalid Object ${obj}`)
        }
        delete this.objects[obj.category][obj.id]
    }
    update(){
        this.cells={}
        for(const c of Object.keys(this.objects)){
            for(const obj of Object.values(this.objects[c])){
                const rect=obj.hb.toRect()
                let min = this.cellPos(rect.position)
                let max = this.cellPos(v2.add(rect.position,rect.size))
                if(v2.less(max,min)){
                    const m=min
                    min=max
                    max=m
                }
                for(let y=min.y;y<=max.y;y++){
                    if(!this.cells[y]){
                        this.cells[y]={}
                    }
                    for(let x=min.x;x<=max.x;x++){
                        if(!this.cells[y][x]){
                            this.cells[y][x]={}
                        }
                        if(!(this.cells[y][x][obj.category])){
                            this.cells[y][x][obj.category]=[]
                        }
                        this.cells[y][x][obj.category].push(obj)
                    }
                }
            }
        }
    }
    get_objects(hitbox:Hitbox2D,categorys:Tags):Record<string,GameObject[]>{
        const rect=hitbox.toRect()
        let min = this.cellPos(rect.position)
        let max = this.cellPos(v2.add(rect.position,rect.size))
        if(v2.less(max,min)){
            const m=min
            min=max
            max=m
        }
        const objects:Record<string,GameObject[]> = {};
        for(let y=min.y;y<=max.y;y++){
            if(!this.cells[y])continue
            for(let x=min.x;x<=max.x;x++){
                if(!this.cells[y][x])continue
                for (const c of categorys) {
                    if(!objects[c]){
                        objects[c]=[]
                    }
                    objects[c].push(...this.cells[y][x][c])
                }
            }
        }
        return objects
    }
    get_objects2(hitbox:Hitbox2D,categorys:string):GameObject[]{
        const rect=hitbox.toRect()
        let min = this.cellPos(rect.position)
        let max = this.cellPos(v2.add(rect.position,rect.size))
        if(v2.less(max,min)){
            const m=min
            min=max
            max=m
        }
        const objects:GameObject[] = []
        for(let y=min.y;y<=max.y;y++){
            if(!this.cells[y])continue
            for(let x=min.x;x<=max.x;x++){
                if(!this.cells[y][x])continue
                objects.push(...this.cells[y][x][categorys])
            }
        }
        return objects
    }
    cellPos(pos:Vec2):Vec2{
        return v2.floor(v2.dscale(pos,this.cellSize))
    }
}
export class CellsManager3D<GameObject extends BaseObject3D=BaseObject3D>{
    objects:Record<string,Record<GameObjectID,GameObject>>={}
    cellSize:number
    //   ____________Z_____________Y_____________X
    cells:Record<number,Record<number,Record<number,Record<string,GameObject[]>>>>
    constructor(cellSize:number=32){
        this.cellSize=cellSize
        this.cells={}
    }

    registry(obj:GameObject){
        if(!this.objects[obj.category]){
            this.objects[obj.category]={}
        }
        if(this.objects[obj.category][obj.id]){
            throw new Error(`Existent Object ${obj.id} In Cell`)
        }
        this.objects[obj.category][obj.id]=obj
    }
    unregistry(obj:ObjectKey){
        if(!(this.objects[obj.category]&&this.objects[obj.category][obj.id])){
            throw new Error(`Invalid Object ${obj}`)
        }
        delete this.objects[obj.category][obj.id]
    }
    update(){
        this.cells={}
        for(const c of Object.keys(this.objects)){
            for(const obj of Object.values(this.objects[c])){
                const rect=obj.hb.toBox().gmm()
                let min = this.cellPos(rect.min)
                let max = this.cellPos(rect.max)
                if(v3.less(max,min)){
                    const m=min
                    min=max
                    max=m
                }
                for(let z=min.z;z<=max.z;z++){
                    if(!this.cells[z]){
                        this.cells[z]={}
                    }
                    for(let y=min.y;y<=max.y;y++){
                        if(!this.cells[z][y]){
                            this.cells[z][y]={}
                        }
                        for(let x=min.x;x<=max.x;x++){
                            if(!this.cells[z][y][x]){
                                this.cells[z][y][x]={}
                            }
                            if(!(this.cells[z][y][x][obj.category])){
                                this.cells[z][y][x][obj.category]=[]
                            }
                            this.cells[z][y][x][obj.category].push(obj)
                        }
                    }
                }
            }
        }
    }
    get_objects(hitbox:Hitbox3D,categorys:Tags):Record<string,GameObject[]>{
        const rect=hitbox.toBox().gmm()
        let min = this.cellPos(rect.min)
        let max = this.cellPos(rect.max)
        if(v3.less(max,min)){
            const m=min
            min=max
            max=m
        }
        const objects:Record<string,GameObject[]> = {}
        for(let z=min.z;z<=max.z;z++){
            if(!this.cells[z])continue
            for(let y=min.y;y<=max.y;y++){
                if(!this.cells[z][y])continue
                for(let x=min.x;x<=max.x;x++){
                    if(!(this.cells[z][y][x]))continue
                    for (const c of categorys) {
                        if(!(this.cells[z][y][x][c]))continue
                        if(!objects[c]){
                            objects[c]=[]
                        }
                        objects[c].push(...this.cells[z][y][x][c])
                    }
                }
            }
        }
        return objects
    }
    get_objects2(hitbox:Hitbox3D,categorys:string):GameObject[]{
        const rect=hitbox.toBox().gmm()
        let min = this.cellPos(rect.min)
        let max = this.cellPos(rect.max)
        if(v3.less(max,min)){
            const m=min
            min=max
            max=m
        }
        const objects:GameObject[] = []
        for(let z=min.z;z<max.z;z++){
            if(!this.cells[z])continue
            for(let y=min.y;y<=max.y;y++){
                if(!this.cells[z][y])continue
                for(let x=min.x;x<=max.x;x++){
                    if(!(this.cells[z][y][x]))continue
                    objects.push(...this.cells[z][y][x][categorys])
                }
            }
        }
        return objects
    }
    cellPos(pos:Vec3):Vec3{
        return v3.floor(v3.dscale(pos,this.cellSize))
    }
}
export class GameObjectManager2D<GameObject extends BaseObject2D>{
    cells:CellsManager2D<GameObject>
    objects:Record<string,Category2D<GameObject>>={}
    stream:NetStream
    ondestroy:(obj:GameObject)=>void=(_)=>{}
    constructor(cellsSize?:number){
        this.cells=new CellsManager2D(cellsSize)
        this.stream=new NetStream(new Uint8Array())
    }
    clear(){
        for(const c in this.objects){
            for(let j=0;j<this.objects[c].orden.length;j++){
                const o=this.objects[c].orden[j]
                this.unregister(this.objects[c].objects[o].get_key())
            }
        }
        this.objects={}
    }
    // deno-lint-ignore no-explicit-any
    add_object(obj:GameObject,category:string,id?:number,args?:Record<string,any>,sv:Record<string,any>={}):GameObject{
        if(!this.objects[category]){
            throw new Error(`Invalid Category ${category}`)
        }
        if(id===undefined){
            while(id===undefined){
                id=random.id()
                if(this.objects[category].objects[id]){
                    id=undefined
                }
            }
        }
        obj.id=id
        obj.category=category
        obj.dirty=true
        // deno-lint-ignore ban-ts-comment
        //@ts-ignore
        obj.manager=this
        this.objects[category].objects[obj.id]=obj
        this.objects[category].orden.push(obj.id)
        for(const i in sv){
            // deno-lint-ignore ban-ts-comment
            //@ts-expect-error
            obj[i]=sv[i]
        }
        obj.create(args??{})
        this.cells.registry(obj)
        return obj
    }
    get_object(obj:ObjectKey):GameObject{
        return this.objects[obj.category].objects[obj.id]
    }
    exist(obj:ObjectKey):boolean{
        return Object.hasOwn(this.objects,obj.category)&&Object.hasOwn(this.objects[obj.category].objects,obj.id)
    }
    alive_count(category:keyof typeof this.objects):number{
        return this.objects[category].orden.length
    }
    add_category(category:keyof typeof this.objects){
        this.objects[category]={orden:[],objects:{}}
    }
    oncreate(_key:ObjectKey,_type:string):GameObject|undefined{
        return
    }
    proccess(packet:ObjectsPacket){
        const csize=packet.stream.readUInt16()
        for(let i=0;i<csize;i++){
            const category=packet.stream.readString()
            if(!this.objects[category]){
                this.add_category(category)
            }
            const osize=packet.stream.readUInt16()
            for(let j=0;j<osize;j++){
                const oid=packet.stream.readID()
                const tp=packet.stream.readString()
                if(tp===""){
                    continue
                }
                if(!this.objects[category].objects[oid]){
                    const obj=this.oncreate({category:category,id:oid},tp)
                    if(!obj)continue
                    this.add_object(obj,category,oid)
                }
                const dir=packet.stream.readUInt8()
                if(dir>0){
                    if(dir>=100){
                        this.objects[category].objects[oid].destroyed=true
                        continue
                    }
                    this.objects[category].objects[oid].dirtyPart=true
                    this.objects[category].objects[oid].decodePart(packet.stream)
                    if(dir>1){
                        this.objects[category].objects[oid].dirty=true
                        this.objects[category].objects[oid].decodeComplete(packet.stream)
                    }
                }
            }
        }
    }
    encode():ObjectsPacket{
        const stream=new NetStream()
        stream.writeUInt16(Object.keys(this.objects).length)
        for(const c in this.objects){
            stream.writeString(c)
            stream.writeUInt16(this.objects[c].orden.length)
            for(let j=0;j<this.objects[c].orden.length;j++){
                const o=this.objects[c].orden[j]
                stream.writeID(o)
                stream.writeString(this.objects[c].objects[o].objectType)
                stream.writeUInt8(
                    11
                    +(this.objects[c].objects[o].calldestroy&&this.objects[c].objects[o].destroyed?100:0)
                )
                this.objects[c].objects[o].encodePart(stream)
                this.objects[c].objects[o].encodeComplete(stream)
            }
        }
        return new ObjectsPacket(stream)
    }
    update(){
        this.cells.update()
        this.stream.clear()
        this.stream.writeUInt16(Object.keys(this.objects).length)
        for(const c in this.objects){
            this.stream.writeString(c)
            this.stream.writeUInt16(this.objects[c].orden.length)
            for(let j=0;j<this.objects[c].orden.length;j++){
                const o=this.objects[c].orden[j]
                this.objects[c].objects[o].update()
                this.stream.writeID(o)
                this.stream.writeString(this.objects[c].objects[o].objectType)
                this.stream.writeUInt8(
                    ((this.objects[c].objects[o].dirtyPart?1:0)*1)
                    +((this.objects[c].objects[o].dirty?1:0)*10)
                    +(this.objects[c].objects[o].calldestroy&&this.objects[c].objects[o].destroyed?100:0)
                )
                if(this.objects[c].objects[o].dirtyPart||this.objects[c].objects[o].dirty){
                    this.objects[c].objects[o].encodePart(this.stream)
                    if(this.objects[c].objects[o].dirty){
                        this.objects[c].objects[o].dirty=false
                        this.objects[c].objects[o].encodeComplete(this.stream)
                    }
                    this.objects[c].objects[o].dirtyPart=true
                }
                if(this.objects[c].objects[o].destroyed){
                    this.unregister(this.objects[c].objects[o].get_key())
                    delete this.objects[c].objects[o]
                    this.objects[c].orden.splice(j,1)
                    j--
                    continue
                }
            }
        }
    }
    unregister(k:ObjectKey){
        if(this.objects[k.category].objects[k.id].calldestroy){
            this.ondestroy(this.objects[k.category].objects[k.id])
            this.objects[k.category].objects[k.id].onDestroy()
        }
        this.cells.unregistry(this.objects[k.category].objects[k.id].get_key())
    }
}
export class GameObjectManager3D<GameObject extends BaseObject3D>{
    cells:CellsManager3D<GameObject>
    objects:Record<string,Category3D<GameObject>>={}
    stream:NetStream
    ondestroy:(obj:GameObject)=>void=(_)=>{}
    constructor(cellsSize?:number){
        this.cells=new CellsManager3D(cellsSize)
        this.stream=new NetStream(new Uint8Array())
    }
    // deno-lint-ignore no-explicit-any
    add_object(obj:GameObject,category:string,id?:number,args?:Record<string,any>,sv:Record<string,any>={}):GameObject{
        if(!this.objects[category]){
            throw new Error(`Invalid Category ${category}`)
        }
        if(id===undefined){
            while(id===undefined){
                id=random.id()
                if(this.objects[category].objects[id]){
                    id=undefined
                }
            }
        }
        obj.id=id
        obj.category=category
        obj.dirty=true
        // deno-lint-ignore ban-ts-comment
        //@ts-ignore
        obj.manager=this
        this.objects[category].objects[obj.id]=obj
        this.objects[category].orden.push(obj.id)
        for(const i in sv){
            // deno-lint-ignore ban-ts-comment
            //@ts-expect-error
            obj[i]=sv[i]
        }
        obj.create(args??{})
        this.cells.registry(obj)
        return obj
    }
    get_object(obj:ObjectKey):GameObject{
        return this.objects[obj.category].objects[obj.id]
    }
    exist(obj:ObjectKey):boolean{
        return Object.hasOwn(this.objects,obj.category)&&Object.hasOwn(this.objects[obj.category].objects,obj.id)
    }
    alive_count(category:keyof typeof this.objects):number{
        return this.objects[category].orden.length
    }
    add_category(category:keyof typeof this.objects){
        this.objects[category]={orden:[],objects:{}}
    }
    oncreate(_key:ObjectKey,_type:string):GameObject|undefined{
        return
    }
    proccess(packet:ObjectsPacket){
        const csize=packet.stream.readUInt16()
        for(let i=0;i<csize;i++){
            const category=packet.stream.readString()
            if(!this.objects[category]){
                continue
            }
            const osize=packet.stream.readUInt16()
            for(let j=0;j<osize;j++){
                const oid=packet.stream.readID()
                const tp=packet.stream.readString()
                if(tp===""){
                    continue
                }
                if(!this.objects[category].objects[oid]){
                    const obj=this.oncreate({category:category,id:oid},tp)
                    if(!obj)continue
                    this.add_object(obj,category,oid)
                }
                const dir=packet.stream.readUInt8()
                if(dir>0){
                    if(dir>=100){
                        this.objects[category].objects[oid].destroyed=true
                        continue
                    }
                    this.objects[category].objects[oid].dirtyPart=true
                    this.objects[category].objects[oid].decodePart(packet.stream)
                    if(dir>1){
                        this.objects[category].objects[oid].dirty=true
                        this.objects[category].objects[oid].decodeComplete(packet.stream)
                    }
                }
            }
        }
    }
    encode():ObjectsPacket{
        const stream=new NetStream()
        stream.writeUInt16(Object.keys(this.objects).length)
        for(const c in this.objects){
            stream.writeString(c)
            stream.writeUInt16(this.objects[c].orden.length)
            for(let j=0;j<this.objects[c].orden.length;j++){
                const o=this.objects[c].orden[j]
                stream.writeID(o)
                stream.writeString(this.objects[c].objects[o].objectType)
                stream.writeUInt8(
                    11
                    +(this.objects[c].objects[o].calldestroy&&this.objects[c].objects[o].destroyed?100:0)
                )
                this.objects[c].objects[o].encodePart(stream)
                this.objects[c].objects[o].encodeComplete(stream)
            }
        }
        return new ObjectsPacket(stream)
    }
    update(){
        this.cells.update()
        this.stream.clear()
        this.stream.writeUInt16(Object.keys(this.objects).length)
        for(const c in this.objects){
            this.stream.writeString(c)
            this.stream.writeUInt16(this.objects[c].orden.length)
            for(let j=0;j<this.objects[c].orden.length;j++){
                const o=this.objects[c].orden[j]
                this.objects[c].objects[o].update()
                this.stream.writeID(o)
                this.stream.writeString(this.objects[c].objects[o].objectType)
                this.stream.writeUInt8(
                    ((this.objects[c].objects[o].dirtyPart?1:0)*1)
                    +((this.objects[c].objects[o].dirty?1:0)*10)
                    +(this.objects[c].objects[o].calldestroy&&this.objects[c].objects[o].destroyed?100:0)
                )
                if(this.objects[c].objects[o].dirtyPart||this.objects[c].objects[o].dirty){
                    this.objects[c].objects[o].encodePart(this.stream)
                    if(this.objects[c].objects[o].dirty){
                        this.objects[c].objects[o].dirty=false
                        this.objects[c].objects[o].encodeComplete(this.stream)
                    }
                    this.objects[c].objects[o].dirtyPart=true
                }
                if(this.objects[c].objects[o].destroyed){
                    this.unregister(this.objects[c].objects[o].get_key())
                    delete this.objects[c].objects[o]
                    this.objects[c].orden.splice(j,1)
                    j--
                    continue
                }
            }
        }
    }
    clear(){
        for(const c in this.objects){
            for(let j=0;j<this.objects[c].orden.length;j++){
                const o=this.objects[c].orden[j]
                this.unregister(this.objects[c].objects[o].get_key())
            }
        }
        this.objects={}
    }
    unregister(k:ObjectKey){
        if(this.objects[k.category].objects[k.id].calldestroy){
            this.ondestroy(this.objects[k.category].objects[k.id])
            this.objects[k.category].objects[k.id].onDestroy()
        }
        this.cells.unregistry(this.objects[k.category].objects[k.id].get_key())
    }
}