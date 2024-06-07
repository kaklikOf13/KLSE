import { ClientsManager, Server } from "../../server_side/mod.ts"
const server=new Server(80)
server.folder("","test/test_server")
server.route("/aaa",(_res,_url,_info)=>{
    return new Response("aaaaaa")
})
server.route("a/bb/ws",new ClientsManager((c)=>{
    console.log(c.ID,c.IP)
}).handler())
server.run()