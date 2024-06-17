import { NetStream, NullVector, Packet } from "KLSE"
import { NewPlayer, decodeNewPlayer, encodeNewPlayer } from "common/scripts/gameObjects/objectsDefinitions.ts";
export class JoinPacket extends Packet{
    ID=0
    Name="join"
    np:NewPlayer
    constructor(np:NewPlayer={Id:0,Name:"",Position:NullVector}){
        super()
        this.np=np
    }
    encode(stream: NetStream): void {
      encodeNewPlayer(this.np,stream)
    }
    decode(stream: NetStream): void {
      this.np=decodeNewPlayer(stream)
    }
}