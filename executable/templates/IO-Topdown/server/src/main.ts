import { GameServerConfig,GameServer } from "./server.ts"
import { Server } from "KLSE/SERVER"


//Definitions
export interface HostConfig{
  port:number,
  name?:string,
  https?:boolean,
  cert?:string,
  key?:string,
}
export interface Config{
  site?:{
    enable:boolean,
    host:HostConfig,
    dir:string
  },
  game:GameServerConfig
  game_server?:{
    enable:boolean,
    host:HostConfig
  }
}
function new_server_from_hc(hc:HostConfig):Server{
  if(hc.https){
    return new Server(hc.port,hc.https,hc.cert,hc.key)
  }
  return new Server(hc.port)
}

// Site Server
function hostSite(){
  return new Promise(()=>{
    if(config.site){
      const server=new_server_from_hc(config.site.host)
      server.folder("","../dist/client")
      server.run()
    }
  })
}

// Game Server
function hostGame(){
  return new Promise(()=>{
    if(config.game_server){
      const server=new GameServer(new_server_from_hc(config.game_server.host),config.game)
      server.run()
    }
  })
}

//Execute
const config:Config=JSON.parse(await Deno.readTextFile("config.json"))
if (import.meta.main) {
  const s=config.site&&config.site.enable
  const g=config.game_server&&config.game_server.enable
  if(s&&g){
    hostSite()
    hostGame()
  }else if(s){
    hostSite()
  }else if(g){
    hostGame()
  }
}
