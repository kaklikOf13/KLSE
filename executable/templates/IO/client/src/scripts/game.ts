import {Client, ClientGame2D, type MousePosListener, type KeyListener, Renderer, DefaultSignals, ResourcesManager} from "KLSE/CLIENT"
import { CATEGORYS, PacketManager } from "common/scripts/constants.ts";
import { ObjectsPacket } from "KLSE";
import { JoinPacket } from "common/scripts/packets/join_packet.ts";
export class Game extends ClientGame2D{
  client:Client
  constructor(ip:string,keyl:KeyListener,mp:MousePosListener,renderer:Renderer,resources:ResourcesManager,...args:any[]){
      super(keyl,mp,resources,renderer,...args)
      for(const i of Object.keys(CATEGORYS)){
        this.scene.objects.add_category(CATEGORYS[i])
      }
      this.client=new Client(new WebSocket(ip),PacketManager)
      this.client.on(DefaultSignals.OBJECTS,(obj:ObjectsPacket)=>{
        this.scene.objects.proccess(obj)
      })
  }
  connect(playerName:string){
    this.client.on("connect",()=>{
      this.client.emit(new JoinPacket(playerName))
      setTimeout(this.client.disconnect.bind(this.client),1000)
    })
  }
}
export async function getGame(server:string){
    return `api/${await(await fetch(`${server}/api/get-game`)).text()}/ws`
}