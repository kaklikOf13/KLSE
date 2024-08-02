import { PlayerBase } from "common/scripts/gameObjects/player.ts"
import { Game } from "../game.ts"
import { NullVec2, v2, Vec2 } from "KLSE"
import { ActionPacket } from "common/scripts/packets/action_packet.ts"

export class Player extends PlayerBase{
    velocity:Vec2
    oldPosition:Vec2
    objectType:string="player"
    constructor(){
        super()
        this.velocity=v2.new(0,0)
        this.oldPosition=this.position
    }
    update(): void {
        this.hb.position=v2.add(this.position,this.velocity)
        if(!v2.is(this.position,this.oldPosition)){
            this.dirtyPart=true
        }
    }
    process_action(action:ActionPacket){
        action.Movement=v2.normalizeSafe(v2.clamp1(action.Movement,-1,1),NullVec2)
        this.velocity=v2.scale(action.Movement,(this.game as Game).config.player.speed)
    }
}