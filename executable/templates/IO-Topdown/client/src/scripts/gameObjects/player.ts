import { PlayerBase } from "common/scripts/gameObjects/player.ts"
import { Renderer, RGBA } from "KLSE/CLIENT";
import { Game } from "../game.ts";
import { Angle, Vec } from "KLSE";

export class Player extends PlayerBase{
    renderer:Renderer|undefined=undefined
    update(){
        //this.renderer!.draw_circle(this.hb as CircleHitbox,RGBA.new(255,0,0))
        if((this.parent as Game).client.ID==this.id){
            (this.parent as Game).action_packet.Angle=Angle.rad2deg(Vec.lookTo(this.position,(this.parent as Game).mouse.position))
        }
        this.renderer!.draw_hitbox(this.hb,RGBA.new(255,0,0))
    }
}