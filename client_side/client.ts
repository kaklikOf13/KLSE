import { ID, SignalManager } from "../utils/_utils.ts"
import { Packet, PacketsManager,ConnectPacket, DisconnectPacket } from "../utils/packets.ts"
export { ConnectPacket, DisconnectPacket } from "../utils/packets.ts"
import { NetStream } from "../utils/stream.ts"
export const DefaultSignals={
    CONNECT:"connect",
    DISCONNECT:"disconnect"
}
export class Client{
    ws:WebSocket
    protected manager:PacketsManager
    opened:boolean // Client Is Connected
    ID:ID=0 // Client ID Sysed With Server And Client
    IP:string // Clinet IP
    protected signals:SignalManager
    constructor(websocket:WebSocket,packet_manager:PacketsManager,ip:string=""){
        this.ws=websocket
        this.opened=false
        this.signals=new SignalManager
        this.manager=packet_manager
        this.ws.onopen=()=>{
            this.opened=true
        }
        this.ws.onclose=()=>{
            this.opened=false
            this.signals.emit(DefaultSignals.DISCONNECT,new DisconnectPacket(this.ID))
        }
        this.ws.onmessage=async(msg)=>{
            if (msg.data instanceof Blob){
                const packet=this.manager.decode(new NetStream(new Uint8Array(await msg.data.arrayBuffer())))
                this.signals.emit(packet.Name,packet)
            }
        }
        this.IP=ip
        if(ip==""){
            this.on("connect",(packet:ConnectPacket)=>{
                this.ID=packet.client_id
            })
        }
    }
    /**
     * Send A `Packet` To `Server/Client`
     * @param packet To Send
     */
    emit(packet:Packet):void{
        this.ws.send(this.manager.encode(packet).buffer)
    }
    /**
     * On Recev A `Packet` From `Server/Client`
     * @param name Name Of `Packet`, you can change the Packet Name In Property `MyPacket.Name`(readonly)
     * @param callback Callback `(packet:MyPacket)=>void`
     */
    // deno-lint-ignore ban-types
    on(name:string,callback:Function){
        this.signals.on(name,callback)
    }
    /**
     * Disconnect Websocket
     */
    disconnect():void{
        this.ws.close()
    }
}