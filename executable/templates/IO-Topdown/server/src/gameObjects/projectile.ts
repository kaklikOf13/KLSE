import { ProjectileBase } from "common/scripts/gameObjects/projectile.ts";
import { Game } from "../game.ts";


export class Projectile extends ProjectileBase{
    update(){
        ProjectileBase.prototype.update.call(this)
    }
}