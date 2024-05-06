import { Tags, hasTag, hasTags } from "./_utils.ts";

export abstract class Item{
    limit_per_slot:number=1
    tags:Tags=[]
    abstract is(other:Item):boolean
}

export class Slot<ItemBase extends Item = Item>{
    item:ItemBase|null
    quantity:number
    accept_tags:Tags
    constructor(accept_tags:Tags=[]){
        this.accept_tags=accept_tags
        this.quantity=0
        this.item=null
    }
    /**
     * Add Item In `Slot`
     * @param item `Item` To Add
     * @param quantity Add Quantity
     * @returns `Slot` Overflow
     */
    add(item:ItemBase,quantity:number=1):number{
        if(this.item==null){
            if(this.accept_tags.length==0||hasTags(this.accept_tags,item.tags)){
                this.item=item
            }else{
                return quantity
            }
        }else if(!this.item.is(item)){
            return quantity
        }
        const add=this.quantity+quantity
        const ret=Math.max(add-this.item.limit_per_slot,0)
        this.quantity=add-ret
        return ret
    }
    /**
     * Remove Item From `Slot`
     * @param quantity Remove amount
     * @returns The `Slot` debt
     */
    remove(quantity:number):number{
        if(this.item==null){
            return quantity
        }
        this.quantity-=quantity
        const ret=Math.max(-this.quantity,0)
        if(ret!=0){
            this.item=null
            this.quantity=0
        }
        return ret
    }
}

export class Inventory<ItemBase extends Item = Item>{
    slots:Slot<ItemBase>[]
    constructor(slots_quatity:number=10){
        this.slots=[]
        for(let i=0;i<slots_quatity;i++){
            this.slots.push(new Slot<ItemBase>())
        }
    }
    /**
     * Add Item In `Inventory`
     * @param item `Item` To Add
     * @param quantity Add amount
     * @returns `Inventory` Overflow
     */
    add(item:ItemBase,quantity:number=1):number{
        let ret=quantity
        for(const i in this.slots){
            ret=this.slots[i].add(item,ret)
            if(ret==0){
                break
            }
        }
        return ret
    }
    //#region normal consume and remove
    /**
     * Consume Inventory Item
     * @param item `Item` To Consume
     * @param quantity Needed Quantity
     * @returns Success
     */
    consume(item:ItemBase,quantity:number=1):boolean{
        const has_slots:number[]=[]
        let has=0
        for(const i in this.slots){
            // deno-lint-ignore ban-ts-comment
            //@ts-expect-error
            if(this.slots[i].item!=null&&this.slots[i].item.is(item)){
                has=Math.min(has+this.slots[i].quantity,quantity)
                has_slots.push(parseInt(i))
                if(has==quantity){
                    for(const j of has_slots){
                        has=this.slots[j].remove(has)
                        if(has==0){break}
                    }
                    return true
                }
            }
        }
        return false
    }
    /**
     * Remove Item From `Inventory`
     * @param quantity Remove amount
     * @returns The `Inventory` debt
     */
    remove(item:ItemBase,quantity:number=1):number{
        let ret=quantity
        for(const i in this.slots){
            // deno-lint-ignore ban-ts-comment
            //@ts-expect-error
            if(this.slots[i].item!=null&&this.slots[i].item.is(item)){
                ret=this.slots[i].remove(ret)
                if(ret==0){
                    break
                }
            }
        }
        return ret
    }
    //#endregion
    //#region tag consume and remove
    /**
     * Consume Inventory Item
     * @param tag `Tag` Needed To Consume
     * @param quantity Needed Quantity
     * @returns Success
     */
    consumeTag(tag:string,quantity:number=1):boolean{
        const has_slots:number[]=[]
        let has=0
        for(const i in this.slots){
            // deno-lint-ignore ban-ts-comment
            //@ts-expect-error
            if(this.slots[i].item!=null&&hasTag(this.slots[i].item,tag)){
                has=Math.min(has+this.slots[i].quantity,quantity)
                has_slots.push(parseInt(i))
                if(has==quantity){
                    for(const j of has_slots){
                        has=this.slots[j].remove(has)
                        if(has==0){break}
                    }
                    return true
                }
            }
        }
        return false
    }
    /**
     * Remove Item From `Inventory`
     * @param tag `Tag` Needed To Consume
     * @param quantity Remove amount
     * @returns The `Inventory` debt
     */
    removeTag(tag:string,quantity:number=1):number{
        let ret=quantity
        for(const i in this.slots){
            // deno-lint-ignore ban-ts-comment
            //@ts-expect-error
            if(this.slots[i].item!=null&&hasTag(this.slots[i].item,tag)){
                ret=this.slots[i].remove(ret)
                if(ret==0){
                    break
                }
            }
        }
        return ret
    }
    //#endregion
}