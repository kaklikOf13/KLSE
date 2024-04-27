import { dirname } from"https://deno.land/std/path/mod.ts"
import { GameServerConfig,GameServer } from "./server.ts"
import { Server } from "https://deno.land/x/KLSE/server_side/server.ts"

//Init
if(import.meta.dirname&&Deno.cwd()!=dirname(import.meta.dirname)){
  Deno.chdir(dirname(import.meta.dirname))
}


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
  let host="0.0.0.0"
  if(hc.name){
    host=hc.name
  }
  if(hc.https){
    return new Server(hc.port,host,hc.https,hc.cert,hc.key)
  }
  return new Server(hc.port,host)
}

// Site Server
function hostSite(){
  return new Promise(()=>{
    if(config.site){
      const server=new_server_from_hc(config.site.host)
      server.static()
      server.run
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
    await hostGame()
  }else if(s){
    await hostSite()
  }else if(g){
    await hostGame()
  }
}