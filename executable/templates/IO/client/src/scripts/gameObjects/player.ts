import { PlayerBase } from "common/scripts/gameObjects/player.ts"
import { Renderer, RGBA } from "KLSE/CLIENT";

export class Player extends PlayerBase{
    renderer:Renderer|undefined=undefined
    update(){
        this.renderer!.draw_circle(this.hb,RGBA.new(255,0,0))
    }
}