import { BaseGameObject, CellsGameObjectsManager,SimpleGameObjectsManager } from "../utils/gameObject.ts"
import { RectHitbox } from "../utils/hitbox.ts"
import { Vec } from "../utils/geometry.ts"
import { random_float } from "../utils/random.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
const randl=Vec.new(-1000,1000)
const randl2=Vec.new(-1,1)

class TestObject extends BaseGameObject{
    constructor(){
        super()
        this.overlaps=["test"]
        this.hb=new RectHitbox(Vec.new(random_float(randl.x,randl.y),random_float(randl.x,randl.y)),Vec.new(2,2))
    }
    override update(): void {
        
    }
    /*override on_overlap_with(obj: GameObject): void {
        console.log(`${this.id} Is Overlaping With ${obj.id}, ${Vec.toString(this.hb.position)} ${Vec.toString(obj.hb.position)}`)
    }*/
}

class TestObject2 extends BaseGameObject{
    constructor(){
        super()
        this.collides=["test"]
        this.hb=new RectHitbox(Vec.new(random_float(randl2.x,randl2.y),random_float(randl2.x,randl2.y)),Vec.new(2,2))
    }
    override update(): void {
        
    }
    override on_collide_with(_obj: BaseGameObject): void {
        this.destroyed=true
    }
}

Deno.test("Opimisation",async()=>{
    const m=new CellsGameObjectsManager(20)
    m.add_category("test")
    for(let i=0;i<5000;i++){
        m.add_object("test",new TestObject())
    }
    console.log(new Date(),"Start")
    await m.update()
    console.log(new Date(),"End")
})

Deno.test("Destroing",async()=>{
    const m=new CellsGameObjectsManager(20)
    m.add_category("test")
    for(let i=0;i<30;i++){
        m.add_object("test",new TestObject2())
    }
    console.log(new Date(),"Start")
    await m.update()
    //console.log(m.categorys)
    await m.update()
    console.log(new Date(),"End")
    assertEquals(m.categorys["test"].orden.length,0)
})

Deno.test("Bad Opimisation",async()=>{
    const m=new SimpleGameObjectsManager()
    m.add_category("test")
    for(let i=0;i<5000;i++){
        m.add_object("test",new TestObject())
    }
    console.log(new Date(),"Start")
    await m.update()
    console.log(new Date(),"End")
})