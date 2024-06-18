
import { ConnectPacket, DisconnectPacket, PacketsManager,Packet } from "../utils/packets.ts"
import { ID } from "../utils/_utils.ts"
import { Client } from "../client_side/client.ts"
import { DefaultSignals } from "./mod.ts";
import { random } from "../utils/random.ts";
export * from "../client_side/client.ts"
export class ClientsManager{
    clients:Map<ID,Client>
    packets_manager:PacketsManager
    onconnection:(client:Client)=>void
    constructor(onconnection:(client:Client)=>void){
        this.clients=new Map()
        this.packets_manager=new PacketsManager()
        this.onconnection=onconnection
    }
    private activate_ws(ws:WebSocket,ip:string):ID{
        const client=new Client(ws,this.packets_manager,ip)
        while (this.clients.has(client.ID)){
            client.ID=random.id()
        }
        client.on(DefaultSignals.DISCONNECT,(packet:DisconnectPacket)=>{
            this.clients.delete(packet.client_id)
        })
        client.emit(new ConnectPacket(client.ID))
        this.clients.set(client.ID,client)
        this.onconnection(client)
        return client.ID
    }
    emit(packet:Packet){
        for(const i of this.clients.keys()){
            try{
                this.clients.get(i)!.emit(packet)
            // deno-lint-ignore no-empty
            }catch{
                
            }
        }
    }
    handler():(req:Request,url:string[],info:Deno.ServeHandlerInfo)=>Response|null{
        return (req:Request,url:string[],info:Deno.ServeHandlerInfo)=>{
            if(url.length>1&&url[url.length-1]!="index.html"){
                return null
            }
            const upgrade = req.headers.get("upgrade") || ""
            if (upgrade.toLowerCase() != "websocket") {
                return new Response("request isn't trying to upgrade to websocket.",{status:406})
            }
            const { socket, response } = Deno.upgradeWebSocket(req)
            socket.onopen = () => {this.activate_ws(socket,info.remoteAddr.hostname)}
            return response
        }
    }
}
