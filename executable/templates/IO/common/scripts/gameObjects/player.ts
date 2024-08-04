import { BaseGameObject2D, CircleHitbox2D, NetStream, v2 } from "KLSE";
import { GameConstants } from "../constants.ts";

export abstract class PlayerBase extends BaseGameObject2D{
    Name:string
    constructor(){
        super()
        this.hb=new CircleHitbox2D(v2.new(0,0),.5)
        //this.hb=new RectHitbox(v2.new(1,1),v2.new(5,5))
        this.Name=GameConstants.player.defaultName
    }
    create(): void {
        
    }
    update(): void {
        
    }
    encodePart(stream: NetStream): void {
        stream.writeVec2(this.hb.position)
    }
    encodeComplete(stream: NetStream): void {
        stream.writeString(this.Name)
    }
    decodePart(stream: NetStream): void {
        this.hb.position=stream.readVec2()
    }
    decodeComplete(stream:NetStream){
        this.Name=stream.readString()
    }
}