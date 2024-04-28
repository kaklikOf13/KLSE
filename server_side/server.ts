import { NetStream } from "../stream.ts";
import { ID,random_id } from "../utils.ts";
import {serveTls} from "https://deno.land/std@0.224.0/http/server.ts"
// @deno-types="npm:@types/express"
import express from "npm:express"

export class Client{
    ws:WebSocket
    opened:boolean=true
    id:ID
    _streams:NetStream[]
    get streams():NetStream[]{
        const st=this.streams
        this._streams=[]
        return st
    }
    constructor(ws:WebSocket,id:ID){
        this.ws=ws
        ws.addEventListener("message",(msg)=>{
            if (msg.data instanceof Uint8Array){
                this._streams.push(new NetStream(msg.data))
            }
        })
        this.id=id
        this._streams=[]
    }
    send_stream(stream:NetStream){
        this.ws.send(stream.buffer)
    }
    close(){
        this.ws.close()
    }
}

export class ClientsManager{
    clients:Map<ID,Client>
    constructor(){
        this.clients=new Map()
    }
    activate_ws(ws:WebSocket):ID{
        const client=new Client(ws,random_id())
        while (client.id in this.clients){
            client.id=random_id()
        }
        this.clients.set(client.id,client)
        client.ws.addEventListener("close",()=>{
            client.opened=false
            this.clients.delete(client.id)
        })
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