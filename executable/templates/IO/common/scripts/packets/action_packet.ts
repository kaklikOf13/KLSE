import { NetStream, Packet, Vec, Vector } from "KLSE"
export class ActionPacket extends Packet{
    ID=2
    Name="action"
    Movement:Vector
    constructor(movement:Vector=Vec.new(0,0)){
        super()
        this.Movement=movement
    }
    encode(stream: NetStream): void {
      stream.writeVector(this.Movement)
    }
    decode(stream: NetStream): void {
      this.Movement=stream.readVector()
    }
}