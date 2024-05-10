import { join,extname } from "https://deno.land/std/path/mod.ts"
import { splitPath } from "../utils/_utils.ts"
import { existsSync } from "https://deno.land/std/fs/mod.ts"
import { serveFile } from "https://deno.land/std@0.224.0/http/mod.ts";
export type HandlerFunc = (req: Request,url_path:string[], info: Deno.ServeHandlerInfo) => Response
export type HandlerFuncAsync = (req: Request,url_path:string[], info: Deno.ServeHandlerInfo) => Promise<Response>
const FilesResponse:Record<string,(name:string)=>Response>={
    ".html":(n)=>{
        return new Response(new Blob([Deno.readTextFileSync(n)],{type:"text/html"}),{status:200})
    },
    "":(n)=>{
        return new Response(new Blob([Deno.readTextFileSync(n+"/index.html")],{type:"text/html"}),{status:200})
    },
    ".js":(n)=>{
        return new Response(new Blob([Deno.readTextFileSync(n)],{type:"text/javascript"}),{status:200})
    },
    ".png":(n)=>{
        return new Response(new Blob([Deno.readFileSync(n)],{type:"image/png"}),{status:200})
    }
}
export class Router {
    private routes: Map<string, HandlerFunc|HandlerFuncAsync> = new Map
    private sub_routers:Map<string, Router>=new Map
    private failCallback: HandlerFunc|HandlerFuncAsync

    constructor(failCallback: HandlerFunc|HandlerFuncAsync = (_req) => new Response("Not Found :(", { status: 404 })) {
        this.failCallback = failCallback
    }

    protected add_route(url: string, handler: HandlerFunc|HandlerFuncAsync): void {
        this.routes.set(url, handler)
    }
    _route(url: string[], handler: HandlerFunc|HandlerFuncAsync|Router){
        if(url.length==1){
            if(handler instanceof Router){
                this.sub_routers.set(url[0],handler)
                this.add_route(url[0],handler._handler())
            }else{
                this.add_route(url[0],handler)
            }
            
        }else{
            const name=url[0]
            url.shift()
            if(this.sub_routers.has(name)){
                this.sub_routers.get(name)!._route(url,handler)
            }else{
                this.sub_routers.set(name,new Router(this.failCallback))
                this.sub_routers.get(name)!._route(url,handler)
            }
        }
    }
    route(url: string, handler: HandlerFunc|HandlerFuncAsync|Router){
        this._route(splitPath(url),handler)
    }
    folder(url:string,path:string){
        this.route(url,async (req,url_path,info:Deno.ServeHandlerInfo)=>{
            let filePath = join(path,...url_path)
            const ext=extname(filePath)
            if(ext==""&&!filePath.endsWith("index.html")){
                filePath+="/index.html"
            }
            if (!existsSync(filePath)) {
                return this.failCallback(req,url_path,info)
            }
            if(FilesResponse[ext]){
                return FilesResponse[ext](filePath)
            }
            return await serveFile(req, filePath)
        })
    }
    _handler():(req: Request,path:string[],info:Deno.ServeHandlerInfo)=>Promise<Response> {
        return (async(req: Request,path:string[],info:Deno.ServeHandlerInfo)=>{
            if (this.routes.has(path[0])) {
                const handler = this.routes.get(path[0])
                path.shift()
                const ret=handler!(req,path,info)
                if(ret instanceof Promise){
                    return await ret
                }
                return ret
            } else if(this.routes.has("")){
                const handler = this.routes.get("")
                const ret=handler!(req,path,info)
                if(ret instanceof Promise){
                    return await ret
                }
                return ret
            }
            return this.failCallback(req,path,info)
        })
    }
}
export class Server extends Router {
    port: number
    https: boolean = false
    certFile: string
    keyFile: string
    server:Deno.HttpServer|null
    constructor(port: number = 5000, https: boolean = false, certFile: string = "", keyFile: string = "") {
        super()
        this.port = port
        this.https = https
        this.certFile = certFile
        this.keyFile = keyFile
        this.server=null
    }
    async run() {
        if(this.https){
            this.server=Deno.serve({
                port:this.port,
                cert:this.certFile,
                key:this.keyFile
            },async(req:Request,info)=>{
                const url = new URL(req.url)
                const path = url.pathname
                return await this._handler()(req,splitPath(path),info)
            })
        }else{
            this.server=await Deno.serve({
                port:this.port
            },async(req:Request,info)=>{
                const url = new URL(req.url)
                const path = url.pathname
                return await this._handler()(req,splitPath(path),info)
            })
        }
    }
    async stop(){
        if(this.server){
            await this.server.shutdown()
        }
    }
}