import { v2 } from "../mod.ts";
import { splitPath } from "../utils/_utils.ts";
import { type DefaultEvents, type DefaultEventsMap2D, Game2D, BaseGameObject2D } from "../utils/game.ts";
import { NullVec2, Vec2 } from "../utils/geometry.ts";
import { KeyListener, MousePosListener } from "./keys.ts";
import { Color, Renderer } from "./renderer.ts";
import { Sprite } from "./resources.ts";
export interface Camera2D{
    position:Vec2
}
export abstract class ClientGameObject2D extends BaseGameObject2D{
    // deno-lint-ignore no-explicit-any
    declare game:ClientGame2D<any,any>
    
    constructor(){
        super()
    }
    abstract render(camera:Camera2D,renderer:Renderer):void
}
export abstract class FormGameObject2D extends ClientGameObject2D{
    // deno-lint-ignore no-explicit-any
    declare game:ClientGame2D<any,any>
    abstract color:Color
    constructor(){
        super()
    }
    render(camera:Camera2D,renderer:Renderer){
        this.hb.position=v2.sub(this.hb.position,camera.position)
        renderer.draw_hitbox2D(this.hb,this.color)
        this.hb.position=v2.add(this.hb.position,camera.position)
    }
}
export class ClientGame2D<Events extends DefaultEvents = DefaultEvents, Map extends DefaultEventsMap2D = DefaultEventsMap2D> extends Game2D<ClientGameObject2D,Events,Map>{
    camera:Camera2D={position:NullVec2}
    renderer:Renderer
    key:KeyListener
    mouse:MousePosListener
    constructor(keyl:KeyListener,mouse:MousePosListener,renderer:Renderer,...args:[]){
        // deno-lint-ignore ban-ts-comment
        //@ts-expect-error
        super(...args)
        this.mouse=mouse
        this.key=keyl
        this.renderer=renderer
    }
    draw(renderer:Renderer){
        for(const c in this.objects.objects){
            for(const o of this.objects.objects[c].orden){
                this.objects.objects[c].objects[o].render(this.camera,renderer)
            }
        }
    }
    update(){
        Game2D.prototype.update.call(this)
        this.draw(this.renderer)
        this.key.tick()
    }
}

export class ContainerSprite{
    pos:Vec2
    size:Vec2
    sprite:Sprite
    visible:boolean
    childs:Record<string,ContainerSprite>
    constructor(sprite:Sprite,pos:Vec2,size:Vec2){
        this.pos=pos
        this.sprite=sprite
        this.size=size
        this.childs={}
        this.visible=true
    }
    add_child(id:string,c:ContainerSprite){
        this.childs[id]=c
    }
    //Tree System. a/bc/def/ghij
    get_child(id:string):ContainerSprite{
        return this._get_child(splitPath(id))
    }
    protected _get_child(id:string[]):ContainerSprite{
        if(id.length===1){
            return this.childs[id[0]]
        }
        return this.childs[id[id.length-1]]._get_child(id)
    }
    draw(camera:Camera2D,renderer:Renderer){
        if(!this.visible){
            return
        }
        renderer.draw_image2D(this.sprite,v2.sub(this.pos,camera.position),this.size)
        for(const c of Object.values(this.childs)){
            c.draw(camera,renderer)
        }
    }
}