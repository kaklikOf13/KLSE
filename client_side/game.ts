import { v2 } from "../mod.ts";
import { splitPath } from "../utils/_utils.ts";
import { type DefaultEvents, type DefaultEventsMap, Game, BaseGameObject2D } from "../utils/game.ts";
import { Vec2 } from "../utils/geometry.ts";
import { Renderer } from "./renderer.ts";
import { Sprite } from "./resources.ts";
export interface Camera2D{
    position:Vec2
}
// deno-lint-ignore ban-ts-comment
//@ts-expect-error
export abstract class ClientGameObject2D extends Omit<BaseGameObject2D,"game">{
    // deno-lint-ignore no-explicit-any
    game!:ClientGame2D<any,any>
    constructor(){
        super()
    }
    abstract render(camera:Camera2D,renderer:Renderer):void
}
// deno-lint-ignore ban-ts-comment
//@ts-expect-error
export type ClientGame2D<Events extends DefaultEvents = DefaultEvents, Map extends DefaultEventsMap = DefaultEventsMap> = Game<ClientGameObject2D,Events,Map>

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
        renderer.draw_image(this.sprite,v2.sub(this.pos,camera.position),this.size)
        for(const c of Object.values(this.childs)){
            c.draw(camera,renderer)
        }
    }
}