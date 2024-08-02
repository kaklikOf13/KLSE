import { Client,ServerGame2D as GameBase } from "KLSE/SERVER"
import { ID, GameObjectManager2D } from "KLSE";
import { CATEGORYS, GameConstants, PacketManager } from "common/scripts/constants.ts";
import { Player } from "./gameObjects/player.ts";
import { JoinPacket } from "common/scripts/packets/join_packet.ts";
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
        this.scene.objects.add_category(CATEGORYS.PLAYERS)
        this.config=config
        this.clients
    }

    handleConnections(client:Client){
        client.on("join",(_packet:JoinPacket)=>{
            if (this.allowJoin&&!this.scene.objects.exist({id:client.ID,category:CATEGORYS.PLAYERS})){
                this.scene.objects.add_object(new Player(),CATEGORYS.PLAYERS,client.ID)
            }
            client.emit(this.scene.objects.encode())
        })
        /*client.on("action",(p:ActionPacket)=>{
            if(this.havePlayer(client.ID)){
                (this.get_object(CATEGORYS.PLAYERS,client.ID) as Player).process_action(p)
            }
        })
        client.on(DefaultSignals.DISCONNECT,()=>{
            if(this.havePlayer(client.ID)){
                this.categorys[CATEGORYS.PLAYERS].objs[client.ID].destroyed=true
            }
        })*/
    }
}