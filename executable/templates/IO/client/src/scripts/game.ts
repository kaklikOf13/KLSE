import { Game as GameBase } from "common/scripts/game.ts"
import { Renderer } from "KLSE/CLIENT";
import { JoinPacket } from "common/scripts/packets/join_packet.ts"
import { PacketManager } from "common/scripts/constants.ts"
import { Player } from "./gameObjects/player.ts";
import {Client} from "KLSE/CLIENT"
export class Game extends GameBase{
    renderer:Renderer
    client:Client
    constructor(ws:WebSocket,renderer:Renderer,threads:number,chunckSize:number){
        super(threads,chunckSize)
        this.renderer=renderer
        this.client=new Client(ws,PacketManager)
    }
    addPlayer(joinpacket:JoinPacket):Player{
        const player=new Player()
        player.renderer=this.renderer
        player.useJoinPacket(joinpacket)
        this.manager.add_object(player,player.id)
        return player
    }
}
export async function getGame(server:string){
    return `${server}/api/${await(await (await fetch(`${server}/api/get-game`)).blob()).text()}`
}