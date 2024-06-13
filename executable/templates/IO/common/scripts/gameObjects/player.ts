import { CircleHitbox, BaseGameObject, Vec } from "KLSE";
import { GameConstants } from "../constants.ts";
import { JoinPacket } from "../packets/join_packet.ts";

export abstract class PlayerBase extends BaseGameObject{
    Name:string
    constructor(){
        super()
        this.hb=new CircleHitbox(Vec.new(0,0),1)
        this.Name=GameConstants.player.defaultName
    }
    useJoinPacket(joinpacket:JoinPacket){
        this.Name=joinpacket.playerName
        this.hb.position=joinpacket.playerPosition
        this.id=joinpacket.playerId
    }
    update(): void {
      
    }
}