import {CATEGORYS, MainGame as GameBase} from "common/scripts/game.ts" 
import { Client, ClientsManager, DefaultSignals } from "KLSE/SERVER"
import { JoinPacket } from "common/scripts/packets/join_packet.ts";
import { Player } from "./gameObjects/player.ts";
import { ID } from "KLSE";
import { GameConstants, PacketManager } from "common/scripts/constants.ts";
import { UpdatePacket } from "common/scripts/packets/update_packet.ts";
export interface GameConfig{
    maxPlayers:number
}

export class Game extends GameBase{
    public clients:ClientsManager
    public can_join:boolean
    public config:GameConfig
    public id:ID=1
    public update_packet:UpdatePacket
    constructor(id:ID,config:GameConfig){
        super(GameConstants.tps,GameConstants.collision.threads,GameConstants.collision.chunckSize)
        this.id=id
        this.can_join=true
        this.config=config
        this.update_packet=new UpdatePacket([])
        this.clients=new ClientsManager((client:Client)=>{
            client.on("join",(packet:JoinPacket)=>{
                if (this.can_join&&!this.havePlayer(client.ID)){
                    packet.ID=client.ID
                    this.addPlayer(packet)
                }
            })
            client.on(DefaultSignals.DISCONNECT,()=>{
                if(this.havePlayer(client.ID)){
                    this.categorys[CATEGORYS.PLAYERS].objs[client.ID].destroyed=true
                }
            })
        })
        this.clients.packets_manager=PacketManager
    }
    update(): void {
        GameBase.prototype.update.call(this)
        this.clients.emit(this.update_packet)
        this.update_packet=new UpdatePacket([])
    }
    addPlayer(joinpacket: JoinPacket): Player {
        const player=new Player
        player.useJoinPacket(joinpacket)
        this.add_object(CATEGORYS.PLAYERS,player,player.id)
        if(this.categorys[CATEGORYS.PLAYERS].orden.length>=this.config.maxPlayers){
            this.can_join=false
        }
        this.clients.emit(joinpacket)
        console.log(player.Name,"join :",player.id)
        return player
    }
}