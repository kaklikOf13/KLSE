import { Server,Cors, HandlerFunc } from "KLSE/SERVER"
import { Game, GameConfig } from "./game.ts"
import { ID } from "KLSE"
export interface GameServerConfig{
    config:GameConfig,
    threads?:number,
    chunckSize?:number
}

export class GameServer{
    server:Server
    config:GameServerConfig
    games:Record<ID,Game>
    game_handles:Record<ID,HandlerFunc>
    constructor(server:Server,config:GameServerConfig){
        this.server=server
        this.config=config
        this.server.route("/api/get-game",(_req:Request,_url:string[], _info: Deno.ServeHandlerInfo)=>{
            return Cors(new Response("game/0",{status:200}))
        })
        this.games={}
        this.game_handles={}
        this.addGame(0)
    }
    addGame(id:ID,config?:GameConfig):Game{
        this.games[id]=new Game(id,config ?? this.config.config)
        this.games[id].mainloop()
        console.log(`Game ${id} Started`)
        const handler=this.games[id].clients.handler()
        this.server.route(`api/game/${id}/ws`,handler)
        this.game_handles[id]=handler
        return this.games[id]
    }
    removeGame(id:ID){
        this.server.remove_route(this.game_handles[id]) ? this.game_handles[id] : null
    }
    run(){
        this.server.run()
    }
}
