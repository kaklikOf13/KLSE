import { PlayerBase } from "common/scripts/gameObjects/player.ts";
import { Game } from "../game.ts";
import { Vec, Vector } from "KLSE";

export class Player extends PlayerBase{
    velocity:Vector
    constructor(){
        super()
        this.velocity=Vec.new(0,.1)
    }
    update(): void {
        this.hb.position=Vec.add(this.position,this.velocity)
        if(!(this.velocity.x==0&&this.velocity.y==0)){
            (this.parent as Game).update_packet.movedPlayers.push({id:this.id,pos:this.position})
        }
    }
}