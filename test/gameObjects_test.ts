import { BaseObject2D, CellsManager2D, GameObjectManager2D } from "../utils/gameObject.ts"
import { RectHitbox } from "../utils/hitbox.ts"
import { v2 } from "../utils/geometry.ts"
import { random } from "../utils/random.ts";
import { NetStream } from "../utils/stream.ts";
const randl=v2.new(-1000,1000)
const randl2=v2.new(-1,1)
let collision=0
class TestObject extends BaseObject2D{
    cls!:CellsManager2D
    create(): void {
        this.hb=new RectHitbox(v2.new(random.float(randl.x,randl.y),random.float(randl.x,randl.y)),v2.new(2,2))
    }
    update() {
        const objs=this.cls.get_objects2(this.hb,"objs")
        for(const o in objs){
            if(this.hb.collidingWith(objs[o].hb)){
                //console.log("Object",this.id,"collide with:",objs[c][o].id)
                collision++
            }
        }
    }
    override decodePart(_stream: NetStream): void {
        
    }
    override encodePart(_stream: NetStream): void {
        
    }
    override encodeComplete(_stream: NetStream): void {
        
    }
    override decodeComplete(_stream: NetStream): void {
        
    }
}
class TestObject2 extends BaseObject2D{
    cls!:CellsManager2D
    create(): void {
        this.hb=new RectHitbox(v2.new(random.float(randl2.x,randl2.y),random.float(randl2.x,randl2.y)),v2.new(2,2))
    }
    update() {
        const objs=this.cls.get_objects2(this.hb,"objs")
        for(const o in objs){
            if(this.hb.collidingWith(objs[o].hb)){
                //console.log("Object",this.id,"collide with:",objs[c][o].id)
                this.destroyed=true
                collision++
            }
        }
    }
    override decodePart(_stream: NetStream): void {
        
    }
    override encodePart(_stream: NetStream): void {
        
    }
    override encodeComplete(_stream: NetStream): void {
        
    }
    override decodeComplete(_stream: NetStream): void {
        
    }
}
Deno.test("Optimisation",()=>{
    const m=new GameObjectManager2D(32)
    m.add_category("objs")
    for(let i=0;i<5000;i++){
        const obj=new TestObject()
        obj.cls=m.cells
        m.add_object(obj,"objs")
    }
    console.log(new Date(),"Start")
    m.update()
    console.log(new Date(),"End With",collision,"collision",Object.keys(m.cells.cells).length,"cells")
})
Deno.test("Destroy",()=>{
    const m=new GameObjectManager2D()
    m.add_category("objs")
    for(let i=0;i<5000;i++){
        const obj=new TestObject2()
        obj.cls=m.cells
        m.add_object(obj,"objs")
    }
    console.log(new Date(),m.alive_count("objs"),"Start")
    m.update()
    console.log(new Date(),m.alive_count("objs"),"End With",collision,"collision")
})