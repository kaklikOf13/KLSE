import { NetStream, Packet } from "KLSE"
import { NewPlayer, decodeNewPlayer, encodeNewPlayer } from "common/scripts/gameObjects/objectsDefinitions.ts";

export class StatePacket extends Packet{
    ID=3
    Name="state"
    players:NewPlayer[]
    constructor(){
        super()
        this.players=[]
    }
    encode(stream: NetStream): void {
        stream.writeArray(this.players,(val:NewPlayer)=>{
            encodeNewPlayer(val,stream)
        })
    }
    decode(stream: NetStream): void {
        this.players=stream.readArray(()=>{
            return decodeNewPlayer(stream)
        })
    }
}