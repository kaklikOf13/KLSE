import { CATEGORYS, Game as GameBase } from "common/scripts/game.ts"
import { DefaultSignals, Renderer } from "KLSE/CLIENT";
import { JoinPacket } from "common/scripts/packets/join_packet.ts"
import { GameConstants, PacketManager } from "common/scripts/constants.ts"
import { Player } from "./gameObjects/player.ts";
import {Client} from "KLSE/CLIENT"
export class Game extends GameBase{
    renderer:Renderer
    client:Client
    constructor(game:string,renderer:Renderer,threads:number,chunckSize:number){
        super(threads,chunckSize)
        this.renderer=renderer
        this.client=new Client(new WebSocket(game+"/ws"),PacketManager)
        this.client.on(DefaultSignals.CONNECT,()=>{
            console.log(this.client.ID)
            this.client.emit(new JoinPacket(this.client.ID,GameConstants.player.defaultName))
        })
        this.client.on("join",(j:JoinPacket)=>{
            console.log(j)
            this.addPlayer(j)
        })
    }
    addPlayer(joinpacket:JoinPacket):Player{
        const player=new Player()
        player.renderer=this.renderer
        player.useJoinPacket(joinpacket)
        this.manager.add_object(CATEGORYS.PLAYERS,player,player.id)
        return player
    }
}
export async function getGame(server:string){
    return `/api/${await(await fetch(`${server}/api/get-game`)).text()}`
}