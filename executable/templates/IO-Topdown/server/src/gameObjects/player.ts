import { PlayerBase } from "common/scripts/gameObjects/player.ts"
import { Game } from "../game.ts"
import { NullVector, Vec, Vector, random } from "KLSE"
import { ActionPacket } from "common/scripts/packets/action_packet.ts"

export class Player extends PlayerBase{
    velocity:Vector
    oldPosition:Vector
    angle:number
    constructor(){
        super()
        this.velocity=Vec.new(0,0)
        this.oldPosition=this.position
        this.angle=0
    }
    update(): void {
        //Shoot
        (this.parent as Game).addProjectile({angle:this.angle,id:random.id(),lifeTime:2,pos:this.position,speed:.1})

        this.hb.position=Vec.add(this.position,this.velocity)
        if(!Vec.is(this.position,this.oldPosition)){
            (this.parent as Game).update_packet.updatedPlayers.push({id:this.id,pos:this.position})
            this.oldPosition=this.position
        }
    }
    process_action(action:ActionPacket){
        action.Movement=Vec.normalizeSafe(Vec.clamp1(action.Movement,-1,1),NullVector)
        this.velocity=Vec.scale(action.Movement,(this.parent as Game).config.player.speed)
        this.angle=action.Angle
    }
}