import { Vec3 } from "../mod.ts";
import { splitPath } from "../utils/_utils.ts";
import { type DefaultEvents, type DefaultEventsMap2D, Game2D, BaseGameObject2D, Game3D, BaseGameObject3D, DefaultEventsMap3D } from "../utils/game.ts";
import { Vec2, v2, v3 } from "../utils/geometry.ts";
import { Model3D } from "../utils/models.ts";
import { NetStream } from "../utils/stream.ts";
import { KeyListener, MousePosListener } from "./keys.ts";
import { Color, Renderer } from "./renderer.ts";
import { ResourcesManager, Sprite } from "./resources.ts";
export interface Camera2D{
    position:Vec2
}
export interface Camera3D{
    position:Vec3
    rotation:Vec3
}
export abstract class ClientGameObject2D extends BaseGameObject2D{
    // deno-lint-ignore no-explicit-any
    declare game:ClientGame2D<any,any>
    
    constructor(){
        super()
    }
    abstract render(camera:Camera2D,renderer:Renderer):void
    override encodePart(_stream:NetStream){

    }
    override decodePart(_stream:NetStream){

    }
    override encodeComplete(_stream:NetStream){

    }
    override decodeComplete(_stream:NetStream){

    }
}
export abstract class ClientGameObject3D extends BaseGameObject3D{
    // deno-lint-ignore no-explicit-any
    declare game:ClientGame3D<any,any>
    
    constructor(){
        super()
    }
    abstract render(camera:Camera2D,renderer:Renderer):void
    override encodePart(_stream:NetStream){

    }
    override decodePart(_stream:NetStream){

    }
    override encodeComplete(_stream:NetStream){

    }
    override decodeComplete(_stream:NetStream){

    }
}
export abstract class FormGameObject2D extends ClientGameObject2D{
    // deno-lint-ignore no-explicit-any
    declare game:ClientGame2D<any,any>
    abstract color:Color
    constructor(){
        super()
    }
    render(camera:Camera2D,renderer:Renderer){
        renderer.draw_hitbox2D(this.hb,this.color,camera.position)
    }
}
export abstract class IMCGameObject3D extends ClientGameObject3D{
    // deno-lint-ignore no-explicit-any
    declare game:ClientGame3D<any,any>
    abstract color:Color
    abstract model:Model3D
    constructor(){
        super()
    }
    render(camera:Camera3D,renderer:Renderer){
        renderer.color_draw_iso_model(this.model,v3.sub(this.position,camera.position),this.hb.transform.scale,v3.sub(this.rotation,camera.rotation),this.color,false,true)
    }
}
export class ClientGame2D<Events extends DefaultEvents = DefaultEvents, EMap extends DefaultEventsMap2D = DefaultEventsMap2D> extends Game2D<ClientGameObject2D,Events,EMap>{
    camera:Camera2D={position:v2.new(0,0)}
    renderer:Renderer
    key:KeyListener
    mouse:MousePosListener
    resource:ResourcesManager
    constructor(keyl:KeyListener,mouse:MousePosListener,resource:ResourcesManager,renderer:Renderer,...args:any[]){
        // deno-lint-ignore ban-ts-comment
        //@ts-expect-error
        super(...args)
        this.mouse=mouse
        this.key=keyl
        this.renderer=renderer
        this.resource=resource
    }
    draw(renderer:Renderer){
        renderer.clear()
        for(const c in this.scene.objects.objects){
            for(const o of this.scene.objects.objects[c].orden){
                this.scene.objects.objects[c].objects[o].render(this.camera,renderer)
            }
        }
    }
    update(){
        Game2D.prototype.update.call(this)
        this.draw(this.renderer)
        this.key.tick()
    }
}
export class ClientGame3D<Events extends DefaultEvents = DefaultEvents, EMap extends DefaultEventsMap3D = DefaultEventsMap3D> extends Game3D<ClientGameObject3D,Events,EMap>{
    camera:Camera3D={position:v3.new(0,0,0),rotation:v3.new(0,0,0)}
    renderer:Renderer
    key:KeyListener
    mouse:MousePosListener
    resource:ResourcesManager
    constructor(keyl:KeyListener,mouse:MousePosListener,renderer:Renderer,resource:ResourcesManager,...args:any[]){
        // deno-lint-ignore ban-ts-comment
        //@ts-expect-error
        super(...args)
        this.mouse=mouse
        this.key=keyl
        this.renderer=renderer
        this.resource=resource
    }
    draw(renderer:Renderer){
        renderer.clear()
        for(const c in this.scene.objects.objects){
            for(const o of this.scene.objects.objects[c].orden){
                this.scene.objects.objects[c].objects[o].render(this.camera,renderer)
            }
        }
    }
    getCameraCenter(center:Vec3):Vec3{
        return v3.sub(center,v3.new((this.renderer.canvas.width/2)/this.renderer.meter_size,0,-((this.renderer.canvas.height/2)/this.renderer.meter_size)))
    }
    update(){
        Game3D.prototype.update.call(this)
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