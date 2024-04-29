import { Packet, PacketsManager } from "../packets.ts";
import { NetStream } from "../stream.ts";
import { ID,random_id,SignalManager } from "../utils.ts";
import {serveTls} from "https://deno.land/std@0.224.0/http/server.ts"
// @deno-types="npm:@types/express"
import express from "npm:express"

export interface ClientMessage{
    client:Client,
    packet?:Packet
}

export class Client{
    ws:WebSocket
    opened:boolean=true
    id:ID
    signals:SignalManager<ClientMessage>
    _manager:ClientsManager
    constructor(ws:WebSocket,id:ID,manager:ClientsManager){
        this.ws=ws
        ws.addEventListener("message",(msg)=>{
            if (msg.data instanceof Uint8Array){
                this.signals.emit(DefaultSignals.message,{client:this,packet:this._manager.packets_manager.decode(new NetStream(msg.data))})
            }
        })
        this.id=id
        this.signals=new SignalManager
        this._manager=manager
    }
    send_stream(stream:NetStream){
        this.ws.send(stream.buffer)
    }
    send(packet:Packet){
        this.send_stream(this._manager.packets_manager.encode(packet))
    }
    close(){
        this.signals.emit(DefaultSignals.disconnect,{client:this})
        this.ws.close()
    }
}
export enum DefaultSignals{
    message="message", // on a send a packet. use in `client.on("message",callback)`
    disconnect="disconnect", // on a client close a connection. use in `client.on("disconnect",callback)`
    connection="connection", // on a client connect in ClientsManager. use in `manager.on("connection",callback)`
}
export class ClientsManager{
    clients:Map<ID,Client>
    packets_manager:PacketsManager
    signals:SignalManager<ClientMessage>
    constructor(){
        this.clients=new Map()
        this.packets_manager=new PacketsManager()
        this.signals=new SignalManager()
    }
    activate_ws(ws:WebSocket):ID{
        const client=new Client(ws,random_id(),this)
        while (client.id in this.clients){
            client.id=random_id()
        }
        this.clients.set(client.id,client)
        client.ws.addEventListener("close",()=>{
            client.opened=false
            this.clients.delete(client.id)
            client.signals.emit(DefaultSignals.disconnect,{client:client})
        })
        this.signals.emit(DefaultSignals.connection,{client:client})
        return client.id
    }
    // deno-lint-ignore no-explicit-any
    handler(req:any,res:any,next:any){
        if (req.headers.get("upgrade") === "websocket") {
            const sock = req.upgrade()
            sock.addEventListner("open",()=>this.activate_ws(sock))
        } else {
            res.send("Not Websocket")
        }
    
        next()
    }
}

export class Router {
    protected _router:express.Application

    constructor() {
        this._router=express()
    }

    router(url: string, router: Router) {
        this._router.use(url, router._router)
    }
    func(url: string, func: (req: express.Request, res: express.Response) => void) {
        this._router.get(url, func)
    }
    folder(url:string,folder:string){
        this._router.use(url,express.static(folder))
    }
    websocket(url: string): ClientsManager {
        const cm = new ClientsManager()
        this._router.use(url, cm.handler)
        return cm
    }
}

export class Server extends Router{
    port:number
    host:string
    https:boolean=false
    certFile:string
    keyFile:string
    constructor(port:number=5000,host:string="0.0.0.0",https:boolean=false,certFile:string="",keyFile:string=""){
        super()
        this.port=port
        this.host=host
        if(https){
            this.https=https
        }
        this.certFile=certFile
        this.keyFile=keyFile
    }
    run():void{
        if(this.https){
            let running:boolean=true
            serveTls(this._router,{port:this.port,hostname:this.host,cert:this.certFile,keyFile:this.keyFile}).then(()=>{running=false})
            while(running){/**/}
        }else{
            this._router.listen(this.port)
        }
    }
}