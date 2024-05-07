import { ClientsManager, Server } from "../../server_side/mod.ts"

const server=new Server(8000)
server.folder("",".")
const cm=new ClientsManager((c)=>{console.log(c.ID)})
server.route("/websocket",cm.handler())
server.run()