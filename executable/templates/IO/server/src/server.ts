import { Server } from "https://deno.land/x/KLSE/server_side/server.ts"
import {GameConfig} from "./game.ts"
export interface GameServerConfig{
    config:GameConfig,
}

export class GameServer{
    server:Server
    config:GameServerConfig
    constructor(server:Server,config:GameServerConfig){
        this.server=server
        this.config=config
    }
    run(){
        this.server.run()
    }
}