import { NullVec2, NullVec3, v2, v3, Vec2, Vec3 } from "./geometry.ts"
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
    // deno-lint-ignore no-explicit-any
    public manager!:GameObjectManager2D<any>
    public get position():Vec2{
        return this.hb ? this.hb.position : NullVec2
    }
    set position(val:Vec2){
        this.hb.position=val
    }
    constructor(){
        this.hb=new NullHitbox2D()
        this.destroyed=false
    }
    abstract update():void
    abstract create():void
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
    // deno-lint-ignore no-explicit-any
    public manager!:GameObjectManager2D<any>
    public get position():Vec3{
        return this.hb ? this.hb.position : NullVec3
    }
    set position(val:Vec3){
        this.hb.position=val
    }
    constructor(){
        this.hb=new NullHitbox3D()
        this.destroyed=false
    }
    abstract update():void
    abstract create():void
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
export interface Category<GameObject extends BaseObject2D> {objects:Record<GameObjectID,GameObject>,orden:number[]}
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
                const cp=this.cellPos(obj.position)
                if(!this.cells[cp.y]){
                    this.cells[cp.y]={}
                }
                if(!this.cells[cp.y][cp.x]){
                    this.cells[cp.y][cp.x]={}
                }
                if(!(this.cells[cp.y][cp.x][obj.category])){
                    this.cells[cp.y][cp.x][obj.category]=[]
                }
                this.cells[cp.y][cp.x][obj.category].push(obj)
            }
        }
    }
    get_objects(hitbox:Hitbox2D,categorys:Tags):Record<string,GameObject[]>{
        const rect=hitbox.toRect()
        const min = this.cellPos(rect.position);
        const max = this.cellPos(v2.add(rect.position,rect.size));
        const objects:Record<string,GameObject[]> = {};

        for (let x = min.x, maxX = max.x;x <= maxX;x++) {
            for (let y = min.y, maxY = max.y;y <= maxY;y++) {
                if(!(this.cells[y]&&this.cells[y][x])){
                    continue
                }
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
        const min = this.cellPos(rect.position);
        const max = this.cellPos(v2.add(rect.position,rect.size));
        const objects:GameObject[] = [];

        for (let y = min.y;y <= max.y;y++) {
            if(!(this.cells[y])){
                continue
            }
            for (let x = min.x;x <= max.x;x++) {
                if(!(this.cells[y][x])){
                    continue
                }
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
    //_______________Z_____________Y_____________X
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
                const cp=this.cellPos(obj.position)
                if(!this.cells[cp.z]){
                    this.cells[cp.z]={}
                }
                if(!this.cells[cp.z][cp.y]){
                    this.cells[cp.z][cp.y]={}
                }
                if(!this.cells[cp.z][cp.y][cp.x]){
                    this.cells[cp.z][cp.y][cp.x]={}
                }
                if(!(this.cells[cp.z][cp.y][cp.x][obj.category])){
                    this.cells[cp.z][cp.y][cp.x][obj.category]=[]
                }
                this.cells[cp.z][cp.y][cp.x][obj.category].push(obj)
            }
        }
    }
    get_objects(hitbox:Hitbox3D,categorys:Tags):Record<string,GameObject[]>{
        const rect=hitbox.toRect()
        const min = this.cellPos(rect.position);
        const max = this.cellPos(v3.add(rect.position,rect.size));
        const objects:Record<string,GameObject[]> = {};
        for (let z:number = min.z;z <= max.z;z++) {
            if(!(this.cells[z])){
                continue
            }
            for (let y = min.y;y <= max.y;y++) {
                if(!(this.cells[z][y])){
                    continue
                }
                for (let x = min.x;min.x <= max.x;x++) {
                    if(!(this.cells[z][y][x])){
                        continue
                    }
                    for (const c of categorys) {
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
        const rect=hitbox.toRect()
        const min = this.cellPos(rect.position);
        const max = this.cellPos(v3.add(rect.position,rect.size));
        const objects:GameObject[] = [];
        for (let z:number = min.z;z <= max.z;z++) {
            if(!(this.cells[z])){
                continue
            }
            for (let y = min.y;y <= max.y;y++) {
                if(!(this.cells[z][y])){
                    continue
                }
                for (let x = min.x;min.x <= max.x;x++) {
                    if(!(this.cells[z][y][x])){
                        continue
                    }
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
    objects:Record<string,Category<GameObject>>={}
    stream:NetStream
    ondestroy:(obj:GameObject)=>void=(_)=>{}
    constructor(cellsSize?:number){
        this.cells=new CellsManager2D(cellsSize)
        this.stream=new NetStream(new Uint8Array())
    }
    add_object(obj:GameObject,category:string,id?:number){
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
        obj.create()
        this.cells.registry(obj)
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
    proccess(packet:ObjectsPacket,oncreate:(key:ObjectKey)=>GameObject){
        const csize=packet.stream.readUInt16()
        for(let i=0;i<csize;i++){
            const category=packet.stream.readString()
            if(!this.objects[category]){
                continue
            }
            const osize=packet.stream.readUInt16()
            for(let j=0;j<osize;j++){
                const oid=this.stream.readID()
                if(!this.objects[category].objects[oid]){
                    oncreate({category:category,id:oid})
                }
                const dir=this.stream.readUInt8()
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
                    if(this.objects[c].objects[o].calldestroy){
                        this.ondestroy(this.objects[c].objects[o])
                        this.objects[c].objects[o].onDestroy()
                    }
                    this.cells.unregistry(this.objects[c].objects[o].get_key())
                    delete this.objects[c].objects[o]
                    this.objects[c].orden.splice(j,1)
                    j--
                    continue
                }
            }
        }
    }
}
export class GameObjectManager3D<GameObject extends BaseObject3D> extends GameObjectManager2D<GameObject>{
    // deno-lint-ignore ban-ts-comment
    //@ts-expect-error
    cells:CellsManager3D<GameObject>
    constructor(cellsSize?:number){
        super(cellsSize)
        this.cells=new CellsManager3D(cellsSize)
    }
}