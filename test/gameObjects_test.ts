import { BaseObject2D, BaseObject3D, CellsManager2D, CellsManager3D, GameObjectManager2D, GameObjectManager3D } from "../utils/gameObject.ts"
import { RectHitbox2D, RectHitbox3D } from "../utils/hitbox.ts"
import { v2, v3 } from "../utils/geometry.ts"
import { random } from "../utils/random.ts";
import { NetStream } from "../utils/stream.ts";
import { Model3D } from "../utils/models.ts";
const randl=v2.new(-1000,1000)
const randl2=v2.new(-1,1)
const randl3=v2.new(-10,10)
let collision=0
class TestObject extends BaseObject2D{
    cls!:CellsManager2D
    create(): void {
        this.hb=new RectHitbox2D(v2.new(random.float(randl.x,randl.y),random.float(randl.x,randl.y)),v2.new(2,2))
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
        this.hb=new RectHitbox2D(v2.new(random.float(randl2.x,randl2.y),random.float(randl2.x,randl2.y)),v2.new(2,2))
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
class TestObject3 extends BaseObject3D{
    cls!:CellsManager3D
    model!:Model3D
    create(): void {
        this.hb=new RectHitbox3D(v3.new(random.float(randl3.x,randl3.y),random.float(randl3.x,randl3.y),random.float(randl3.x,randl3.y)),v3.new(1,1,1))
    }
    update() {
        const objs=this.cls.get_objects2(this.hb,"objs")
        for(const o in objs){
            if(this.hb.collidingWith(objs[o].hb)){
                console.log("Object",this.id,"collide with:",objs[o].id)
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
class TestObject4 extends BaseObject3D{
    cls!:CellsManager3D
    model!:Model3D
    create(): void {
        this.hb=new RectHitbox3D(v3.new(random.float(randl3.x,randl3.y),random.float(randl3.x,randl3.y),random.float(randl3.x,randl3.y)),v3.new(1,1,1))
    }
    update() {
        const objs=this.cls.get_objects2(this.hb,"objs")
        for(const o in objs){
            if(this.hb.collidingWith(objs[o].hb)){
                console.log("Object",this.id,"collide with:",objs[o].id)
                collision++
                this.destroyed=true
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
Deno.test("3D",()=>{
    const m=new GameObjectManager3D(32)
    m.add_category("objs")
    for(let i=0;i<1000;i++){
        const obj=new TestObject3()
        obj.cls=m.cells
        m.add_object(obj,"objs")
    }
    console.log(new Date(),"Start")
    m.update()
    console.log(new Date(),"End With",collision,"collision",Object.keys(m.cells.cells).length,"cells")
})
Deno.test("3D Destroy",()=>{
    const m=new GameObjectManager3D(32)
    m.add_category("objs")
    for(let i=0;i<1000;i++){
        const obj=new TestObject4()
        obj.cls=m.cells
        m.add_object(obj,"objs")
    }
    console.log(new Date(),"Start")
    m.update()
    m.update()
    console.log(new Date(),"End With",collision,"collision",Object.keys(m.cells.cells).length,"cells")
})