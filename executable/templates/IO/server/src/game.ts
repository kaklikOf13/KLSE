import {CATEGORYS, Game as GameBase} from "common/scripts/game.ts" 
import { Client, ClientsManager, DefaultSignals } from "KLSE/SERVER"
import { JoinPacket } from "common/scripts/packets/join_packet.ts";
import { Player } from "./gameObjects/player.ts";
import { ID } from "KLSE";
import { PacketManager } from "common/scripts/constants.ts";
export interface GameConfig{
    maxPlayers:number
}

export class Game extends GameBase{
    public clients:ClientsManager
    public can_join:boolean
    public config:GameConfig
    public id:ID=1
    constructor(id:ID,config:GameConfig,threads:number,chunck_size:number){
        super(threads,chunck_size)
        this.id=id
        this.can_join=true
        this.config=config
        this.clients=new ClientsManager((client:Client)=>{
            client.on("join",(packet:JoinPacket)=>{
                if (this.can_join&&!this.havePlayer(client.ID)){
                    this.addPlayer(packet)
                }
            })
            client.on(DefaultSignals.DISCONNECT,()=>{
                if(this.havePlayer(client.ID)){
                    console.log(this.getPlayer(client.ID),"disconnect")
                    this.manager.categorys[CATEGORYS.PLAYERS].objs[client.ID].destroyed=true
                }
            })
        })
        this.clients.packets_manager=PacketManager
    }
    addPlayer(joinpacket: JoinPacket): Player {
        const player=new Player
        player.useJoinPacket(joinpacket)
        this.manager.add_object(CATEGORYS.PLAYERS,player,player.id)
        if(this.manager.categorys[CATEGORYS.PLAYERS].orden.length>=this.config.maxPlayers){
            this.can_join=false
        }
        this.clients.emit(joinpacket)
        console.log(player.Name,"join")
        return player
    }
}