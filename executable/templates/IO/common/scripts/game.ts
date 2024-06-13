import { BaseGameObject, Game, ID } from "KLSE"
import { JoinPacket } from "common/scripts/packets/join_packet.ts";

export enum CATEGORYS{
    PLAYERS="players"
}

export abstract class MainGame extends Game{
    constructor(tps:number,thread:number,chunckSize:number){
        super(tps,thread,chunckSize)
        this.add_category(CATEGORYS.PLAYERS)
    }
    abstract addPlayer(joinpacket:JoinPacket):BaseGameObject
    havePlayer(id:ID):boolean{
        return this.exist_object(CATEGORYS.PLAYERS,id)
    }
}