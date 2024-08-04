import { Client,DefaultSignals,ServerGame2D as GameBase } from "KLSE/SERVER"
import { ID } from "KLSE";
import { CATEGORYS, GameConstants, PacketManager } from "common/scripts/constants.ts";
import { Player } from "./gameObjects/player.ts";
import { JoinPacket } from "common/scripts/packets/join_packet.ts";
import { ActionPacket } from "common/scripts/packets/action_packet.ts";
export interface GameConfig{
    maxPlayers:number,
    player:{
        speed:number,
    }
}

export class Game extends GameBase{
    config:GameConfig
    constructor(id:ID,config:GameConfig){
        super(GameConstants.tps,id,PacketManager,{
            "player":Player
        })
        for(const i of Object.keys(CATEGORYS)){
            this.scene.objects.add_category(CATEGORYS[i])
        }
        this.config=config
        this.clients
    }

    handleConnections(client:Client){
        const objId={id:client.ID,category:CATEGORYS.PLAYERS}
        client.on("join",(_packet:JoinPacket)=>{
            if (this.allowJoin&&!this.scene.objects.exist(objId)){
                this.scene.objects.add_object(new Player(),CATEGORYS.PLAYERS,client.ID)
            }
            client.emit(this.scene.objects.encode())
        })
        client.on("action",(p:ActionPacket)=>{
            if(this.scene.objects.exist(objId)){
                (this.scene.objects.get_object({category:CATEGORYS.PLAYERS,id:client.ID}) as Player).process_action(p)
            }
        })
        client.on(DefaultSignals.DISCONNECT,()=>{
            if(this.scene.objects.exist(objId)){
                this.scene.objects.get_object(objId).destroyed=true
            }
        })
    }
}