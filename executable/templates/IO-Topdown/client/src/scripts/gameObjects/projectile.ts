import { ProjectileBase } from "common/scripts/gameObjects/projectile.ts";
import { Angle } from "KLSE";
import { RGBA, Renderer } from "KLSE/CLIENT";
import { Game } from "../game.ts";

export class Projectile extends ProjectileBase{
    renderer:Renderer|undefined=undefined
    update(){
        ProjectileBase.prototype.update.call(this)
        //this.renderer!.draw_circle(this.hb as CircleHitbox,RGBA.new(255,0,0))
        this.renderer!.draw_hitbox(this.hb,RGBA.new(0,0,0))
    }
}