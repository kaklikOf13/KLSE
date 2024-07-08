import { NullVec2, v2, Vec2 } from "./geometry.ts"
import { Hitbox, NullHitbox } from "./hitbox.ts"
import { ID, Tags } from "./_utils.ts"
import { NetStream } from "../mod.ts";
import { random } from "./random.ts";
import { ObjectsPacket } from "./packets.ts";
export type GameObjectID=ID
export abstract class BaseObject2D{
    public hb:Hitbox
    public destroyed:boolean
    public id!:GameObjectID
    public category!:string
    public calldestroy:boolean=true
    public dirty:boolean=false
    public dirtyPart:boolean=false
    public manager!:GameObjectManager2D
    public get position():Vec2{
        return this.hb ? this.hb.position : NullVec2
    }
    set position(val:Vec2){
        this.hb.position=val
    }
    constructor(){
        this.hb=new NullHitbox()
        this.destroyed=false
    }
    abstract update():void
    abstract create():void
    abstract encodePart(stream:NetStream):void
    abstract decodePart(stream:NetStream):void
    abstract encodeComplete(stream:NetStream):void
    abstract decodeComplete(stream:NetStream):void
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
    get_objects(hitbox:Hitbox,categorys:Tags):Record<string,GameObject[]>{
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
                    objects[c].push(...Object.values(this.cells[y][x][c]))
                }
            }
        }
        return objects
    }
    cellPos(pos:Vec2):Vec2{
        return v2.floor(v2.dscale(pos,this.cellSize))
    }
}
export class GameObjectManager2D<GameObject extends BaseObject2D=BaseObject2D>{
    cells:CellsManager2D<GameObject>
    objects:Record<string,Category<GameObject>>={}
    stream:NetStream
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
        obj.manager=this
        this.objects[category].objects[obj.id]=obj
        this.objects[category].orden.push(obj.id)
        obj.create()
        this.cells.registry(obj)
    }
    add_category(category:string){
        this.objects[category]={orden:[],objects:{}}
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
                const oid=this.stream.readID()
                if(!this.objects[category].objects[oid]){
                    continue
                }
                const dir=this.stream.readUInt8()
                if(dir>0){
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
    update(){
        this.cells.update()
        this.stream.clear()
        this.stream.writeUInt16(Object.keys(this.objects).length)
        for(const c in this.objects){
            this.stream.writeString(c)
            this.stream.writeUInt16(this.objects[c].orden.length)
            for(const o of this.objects[c].orden){
                this.objects[c].objects[o].update()
                this.stream.writeID(o)
                this.stream.writeUInt8(((this.objects[c].objects[o].dirtyPart?1:0)*1)+((this.objects[c].objects[o].dirty?1:0)*10))
                if(this.objects[c].objects[o].dirtyPart||this.objects[c].objects[o].dirty){
                    this.objects[c].objects[o].encodePart(this.stream)
                    if(this.objects[c].objects[o].dirty){
                        this.objects[c].objects[o].encodeComplete(this.stream)
                    }
                }
            }
        }
    }
}