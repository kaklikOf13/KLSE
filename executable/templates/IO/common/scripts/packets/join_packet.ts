import { ID, NetStream, Packet, Vec, Vector } from "KLSE"
export class JoinPacket extends Packet{
    ID=0
    Name="join"
    playerId:ID
    playerName:string=""
    playerPosition:Vector
    constructor(playerId:ID=0,playerName:string="",playerPosition:Vector=Vec.new(0,0)){
        super()
        this.playerId=playerId
        this.playerName=playerName
        this.playerPosition=playerPosition
    }
    encode(stream: NetStream): void {
      stream.writeID(this.playerId)
      stream.writeString(this.playerName)
      stream.writeVector(this.playerPosition)
    }
    decode(stream: NetStream): void {
      this.playerId=stream.readID()
      this.playerName=stream.readString()
      this.playerPosition=stream.readVector()
    }
}