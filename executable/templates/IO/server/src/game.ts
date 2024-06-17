import {CATEGORYS, MainGame as GameBase} from "common/scripts/game.ts" 
import { Client, ClientsManager, DefaultSignals } from "KLSE/SERVER"
import { JoinPacket } from "common/scripts/packets/join_packet.ts";
import { Player } from "./gameObjects/player.ts";
import { BaseGameObject, ID } from "KLSE";
import { GameConstants, PacketManager } from "common/scripts/constants.ts";
import { UpdatePacket } from "common/scripts/packets/update_packet.ts";
import { ActionPacket } from "common/scripts/packets/action_packet.ts";
import { StatePacket } from "common/scripts/packets/state_packet.ts";
import { NewPlayer } from "common/scripts/gameObjects/objectsDefinitions.ts";
export interface GameConfig{
    maxPlayers:number,
    player:{
        speed:number,
    }
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
        this.update_packet=new UpdatePacket()
        this.clients=new ClientsManager(this.handleConnections.bind(this))
        this.clients.packets_manager=PacketManager
    }
    destroyCallback(obj:BaseGameObject){
        this.update_packet.removedObjects.push({id:obj.id,category:obj.category})
    }
    update(): void {
        const np=this.update_packet.newPlayers
        this.update_packet=new UpdatePacket()
        if(np.length>0){
            this.update_packet.newPlayers=np
        }
        GameBase.prototype.update.call(this)
        this.clients.emit(this.update_packet)
        this.update_packet.newPlayers=[]
    }
    addPlayer(np:NewPlayer): Player {
        const player=new Player
        player.fromNewPlayer(np)
        this.add_object(CATEGORYS.PLAYERS,player,player.id)
        if(this.categorys[CATEGORYS.PLAYERS].orden.length>=this.config.maxPlayers){
            this.can_join=false
        }
        this.update_packet.newPlayers.push({Position:player.position,Name:player.Name,Id:player.id})
        console.log(player.Name,"join :",np.Id)
        return player
    }

    get_state():StatePacket{
        const state=new StatePacket()
        for(const i of this.categorys[CATEGORYS.PLAYERS].orden){
            state.players.push((this.get_object(CATEGORYS.PLAYERS,i) as Player).toNewPlayer())
        }
        return state
    }

    handleConnections(client:Client){
        client.on("join",(packet:JoinPacket)=>{
            if (this.can_join&&!this.havePlayer(client.ID)){
                packet.np.Id=client.ID
                this.addPlayer(packet.np)
                client.emit(this.get_state())
            }
        })
        client.on("action",(p:ActionPacket)=>{
            if(this.havePlayer(client.ID)){
                (this.get_object(CATEGORYS.PLAYERS,client.ID) as Player).process_action(p)
            }
        })
        client.on(DefaultSignals.DISCONNECT,()=>{
            if(this.havePlayer(client.ID)){
                this.categorys[CATEGORYS.PLAYERS].objs[client.ID].destroyed=true
            }
        })
    }
}