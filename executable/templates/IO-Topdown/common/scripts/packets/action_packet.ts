import { NetStream, Packet, Vec, Vector } from "KLSE"
export class ActionPacket extends Packet{
    ID=2
    Name="action"
    Movement:Vector
    Angle:number
    constructor(movement:Vector=Vec.new(0,0),rotation:number=0){
        super()
        this.Movement=movement
        this.Angle=rotation
    }
    encode(stream: NetStream): void {
      stream.writeVector(this.Movement)
      stream.writeInt16(Math.floor(this.Angle))
    }
    decode(stream: NetStream): void {
      this.Movement=stream.readVector()
      this.Angle=stream.readInt16()
    }
}