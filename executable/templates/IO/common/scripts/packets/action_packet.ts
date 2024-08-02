import { NetStream, Packet, v2, Vec2 } from "KLSE"
export class ActionPacket extends Packet{
    ID=1
    Name="action"
    Movement:Vec2
    constructor(movement:Vec2=v2.new(0,0)){
        super()
        this.Movement=movement
    }
    encode(stream: NetStream): void {
      stream.writeVec2(this.Movement)
    }
    decode(stream: NetStream): void {
      this.Movement=stream.readVec2()
    }
}