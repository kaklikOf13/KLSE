import { join, extname, basename, resolve } from "https://deno.land/std/path/mod.ts"
import { splitPath } from "../utils/_utils.ts"
import { existsSync } from "https://deno.land/std/fs/mod.ts"
import { serveFile } from "https://deno.land/std/http/file_server.ts"

export type HandlerFunc = (req: Request, url_path: string[], info: Deno.ServeHandlerInfo) => Response | null
export type HandlerFuncAsync = (req: Request, url_path: string[], info: Deno.ServeHandlerInfo) => Promise<Response | null>

export function Cors(res:Response):Response{
  res.headers.append("Access-Control-Allow-Origin", "*")
  res.headers.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.headers.append("Access-Control-Allow-Headers", "origin, content-type, accept, x-requested-with")
  res.headers.append("Access-Control-Max-Age", "3600")
  return res
}

const FilesResponse: Record<string, (name: string) => Promise<Response | null>> = {
  ".html": async (name) => {
    try {
      const content = await Deno.readTextFile(name)
      return new Response(content, { status: 200, headers: { "Content-Type": "text/html" } })
    } catch {
      return null
    }
  },
  "": async (name) => {
    try {
      const content = await Deno.readTextFile(join(name, "index.html"))
      return new Response(content, { status: 200, headers: { "Content-Type": "text/html" } })
    } catch {
      return null
    }
  },
  ".js": async (name) => {
    try {
      const content = await Deno.readTextFile(name)
      return new Response(content, { status: 200, headers: { "Content-Type": "application/javascript" } })
    } catch {
      return null
    }
  },
  ".ts": async (name) => {
    try {
      const content = await Deno.readTextFile(name.replace(".ts",".ts"))
      return new Response(content, { status: 200, headers: { "Content-Type": "application/javascript" } })
    } catch {
      return null
    }
  },
  ".png": async (name) => {
    try {
      const content = await Deno.readFile(name)
      return new Response(content, { status: 200, headers: { "Content-Type": "image/png" } })
    } catch {
      return null
    }
  },
}

export class Router {
  private routes: Map<string, (HandlerFunc | HandlerFuncAsync)[]> = new Map()
  private sub_routers: Map<string, Router> = new Map()
  failCallback: HandlerFunc | HandlerFuncAsync

  constructor(failCallback: HandlerFunc | HandlerFuncAsync = (_req) => new Response("Not Found :(", { status: 404 })) {
    this.failCallback = failCallback
  }

  protected add_route(url: string, handler: HandlerFunc | HandlerFuncAsync): void {
    if (!this.routes.has(url)) {
      this.routes.set(url, [])
    }
    this.routes.get(url)!.push(handler)
  }

  private _route(url: string[], handler: HandlerFunc | HandlerFuncAsync | Router) {
    if (url.length == 1) {
      if (handler instanceof Router) {
        this.sub_routers.set(url[0], handler)
        this.add_route(url[0], handler._handler())
      } else {
        this.add_route(url[0], handler)
      }
    } else if(url.length>1){
      const name = url[0]
      url.shift()
      if (this.sub_routers.has(name)) {
        this.sub_routers.get(name)!._route(url, handler)
      } else {
        this.sub_routers.set(name, new Router(this.failCallback))
        this.sub_routers.get(name)!._route(url, handler)
        this.add_route(name,this.sub_routers.get(name)!._handler())
      }
    }
  }

  route(url: string, ...handlers: (HandlerFunc | HandlerFuncAsync | Router)[]) {
    handlers.forEach(handler => {
      this._route(splitPath(url), handler)
    })
  }

  folder(url: string, path: string) {
    this.route(url, async (req, url_path, info: Deno.ServeHandlerInfo) => {
      const filePath = join(path, ...url_path)
      if (!existsSync(filePath)) {
        if(!filePath.endsWith("index.html")){
          return await this._handler()(req,[...url_path,"index.html"],info)
        }
        return null
      }
      const ext = extname(filePath)
      if (FilesResponse[ext]) {
        return await FilesResponse[ext](filePath)
      }
      return await serveFile(req, filePath)
    })
  }

  protected _handler(): (req:Request,path:string[],info:Deno.ServeHandlerInfo)=>Promise<Response|null>{
    return async(req,path,info)=>{
      path.shift()
      const handlers = (this.routes.get(path[0]) ?? [])
      handlers.push(...(this.routes.get("")??[]))
      for (const handler of handlers) {
        const ret = handler(req, [...path], info)
        if (ret instanceof Promise) {
          const response = await ret
          if (response) {
            return response
          }
        } else if (ret) {
          return ret
        }
      }
      return null
    }
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
    run() {
        if(this.https){
            this.server=Deno.serve({
                port:this.port,
                cert:Deno.readTextFileSync(this.certFile),
                key:Deno.readTextFileSync(this.keyFile)
            },async(req:Request,info:Deno.ServeHandlerInfo)=>{
                const url = new URL(req.url)
                const path = [""]
                path.push(...splitPath(url.pathname))
                let val=(await this._handler()(req,path,info))
                if(!val){
                    const re=this.failCallback(req,path,info)
                    if(re instanceof Promise){
                        val=(await re) ?? new Response("fail")
                    }else{
                        val=re ?? new Response("fail")
                    }
                }
                return val as Response
            })
        }else{
            this.server=Deno.serve({
                port:this.port,
            },async(req:Request,info:Deno.ServeHandlerInfo)=>{
                const url = new URL(req.url)
                const path = [url.host]
                path.push(...splitPath(url.pathname))
                let val=(await this._handler()(req,path,info))
                if(!val){
                    const re=this.failCallback(req,path,info)
                    if(re instanceof Promise){
                        val=(await re) ?? new Response("fail")
                    }else{
                        val=re ?? new Response("fail")
                    }
                }
                return val as Response
            })
        }
    }
    async stop(){
        if(this.server){
            await this.server.shutdown()
        }
    }
}
