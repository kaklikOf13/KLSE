import { Server } from "KLSE/SERVER"
import { Game, GameConfig } from "./game.ts"
import { ID } from "KLSE";
export interface GameServerConfig{
    config:GameConfig,
    threads?:number,
    chunckSize?:number
}

export class GameServer{
    server:Server
    config:GameServerConfig
    games:Record<ID,Game>
    constructor(server:Server,config:GameServerConfig){
        this.server=server
        this.config=config
        this.server.route("/api/get-game",(_req:Request,_url:string[], _info: Deno.ServeHandlerInfo)=>{
            console.log("aaa")
            return new Response("game/0",{status:200})
        })
        this.games={}
    }
    addGame(id:ID,config?:GameConfig):Game{
        this.games[id]=new Game(id,config ?? this.config.config,this.config.threads ?? 10,this.config.chunckSize ?? 15)
        this.server.route(`api/game/${id}/ws`,this.games[id].clients.handler())
        return this.games[id]
    }
    run(){
        this.server.run()
    }
}
