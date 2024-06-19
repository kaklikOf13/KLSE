import { PlayerBase } from "common/scripts/gameObjects/player.ts"
import { Renderer, RGBA } from "KLSE/CLIENT";

export class Player extends PlayerBase{
    renderer:Renderer|undefined=undefined
    update(){
        //this.renderer!.draw_circle(this.hb as CircleHitbox,RGBA.new(255,0,0))
        this.renderer!.draw_hitbox(this.hb,RGBA.new(255,0,0))
    }
}