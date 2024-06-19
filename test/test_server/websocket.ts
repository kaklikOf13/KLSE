import { Client, DefaultSignals,ConnectPacket } from "../../client_side/client.ts"
import { PacketsManager } from "../../mod.ts";

const client=new Client(new WebSocket("ws://localhost:8000/websocket"),new PacketsManager())
client.on(DefaultSignals.CONNECT,(packet:ConnectPacket)=>{
    console.log(packet.client_id,client.ID)
    client.disconnect()
})