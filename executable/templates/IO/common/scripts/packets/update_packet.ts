import { ID, NetStream, Packet, Vec, Vector } from "KLSE"
export interface MovedPlayer {id:ID,pos:Vector}
export class UpdatePacket extends Packet{
    ID=1
    Name="update"
    movedPlayers:MovedPlayer[]
    constructor(movedPlayers:MovedPlayer[]){
        super()
        this.movedPlayers=movedPlayers
    }
    encode(stream: NetStream): void {
        stream.writeArray(this.movedPlayers,(val:MovedPlayer)=>{
            stream.writeID(val.id)
            stream.writeVector(val.pos)
        })
    }
    decode(stream: NetStream): void {
        stream.writeArray(this.movedPlayers,(val:MovedPlayer)=>{
            stream.writeID(val.id)
            stream.writeVector(val.pos)
        })
    }
}