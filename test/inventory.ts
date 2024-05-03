import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { Inventory, Item, Slot } from "../inventory.ts";
import { Tags } from "../utils.ts";
class Item1 extends Item{
    tags: Tags=["a"]
    limit_per_slot: number=10
    is(other: Item):boolean {
        return other instanceof Item1
    }
}
class Item2 extends Item{
    limit_per_slot: number=12
    tags: Tags=["b"]
    is(other: Item):boolean {
        return other instanceof Item2
    }
}
Deno.test("Slot Add",()=>{
    const slot=new Slot()
    slot.add(new Item1(),6)
    slot.add(new Item1(),1)
    console.log(slot.quantity)
    assertEquals(slot.quantity,7)
    const res=slot.add(new Item1(),5)
    console.log(slot.quantity,res)
    assertEquals(slot.quantity,10)
    assertEquals(res,2)
})
Deno.test("Slot Remove",()=>{
    const slot=new Slot()
    slot.add(new Item1(),6)
    let res=slot.remove(1)
    console.log(slot.quantity,res)
    assertEquals(slot.quantity,5)
    assertEquals(res,0)
    res=slot.remove(6)
    console.log(slot.quantity,res)
    assertEquals(slot.quantity,0)
    assertEquals(res,1)
    assertEquals(slot.item,null)
})

Deno.test("Inventory Add",()=>{
    const inv=new Inventory(3)
    inv.add(new Item1(),11)
    inv.add(new Item2(),12)

    console.log(inv.slots[0].quantity,inv.slots[1].quantity,inv.slots[2].quantity)

    assertEquals(inv.slots[0].quantity,10)
    assertEquals(inv.slots[1].quantity,1)
    assertEquals(inv.slots[2].quantity,12)
})

Deno.test("Inventory Consume1",()=>{
    const inv=new Inventory(3)
    inv.add(new Item2(),10)
    inv.add(new Item1(),11)
    console.log(inv.slots)
    const ok=inv.consume(new Item1,11)
    console.log(inv.slots[0].quantity,inv.slots[1].quantity,inv.slots[2].quantity,ok)

    assertEquals(ok,true)
})
Deno.test("Inventory Consume2",()=>{
    const inv=new Inventory(3)
    inv.add(new Item1(),11)
    inv.add(new Item2(),12)
    console.log(inv.slots)
    const ok=inv.consume(new Item1,12)
    console.log(inv.slots[0].quantity,inv.slots[1].quantity,inv.slots[2].quantity,ok)

    assertEquals(ok,false)
})

Deno.test("Inventory Remove1",()=>{
    const inv=new Inventory(3)
    inv.add(new Item2(),10)
    inv.add(new Item1(),13)
    console.log(inv.slots)
    const res=inv.remove(new Item1,11)
    console.log(inv.slots[0].quantity,inv.slots[1].quantity,inv.slots[2].quantity,res)

    assertEquals(res,0)
})
Deno.test("Inventory Remove2",()=>{
    const inv=new Inventory(3)
    inv.add(new Item1(),11)
    inv.add(new Item2(),12)
    console.log(inv.slots)
    const res=inv.remove(new Item1,14)
    console.log(inv.slots[0].quantity,inv.slots[1].quantity,inv.slots[2].quantity,res)

    assertEquals(res,3)
})