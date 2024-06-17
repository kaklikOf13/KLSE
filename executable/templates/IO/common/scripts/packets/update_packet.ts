import { ID, NetStream, Packet, type ObjectKey } from "KLSE"
import { NewPlayer, UpdatedPlayer, decodeNewPlayer, encodeNewPlayer } from "common/scripts/gameObjects/objectsDefinitions.ts"
export class UpdatePacket extends Packet{
    ID=1
    Name="update"
    updatedPlayers:UpdatedPlayer[]
    newPlayers:NewPlayer[]
    removedObjects:ObjectKey[]
    constructor(){
        super()
        this.updatedPlayers=[]
        this.newPlayers=[]
        this.removedObjects=[]
    }
    encode(stream: NetStream): void {
        stream.writeArray(this.updatedPlayers,(val:UpdatedPlayer)=>{
            stream.writeID(val.id)
            stream.writeVector(val.pos)
        })
        stream.writeArray(this.newPlayers,(val:NewPlayer)=>{
            encodeNewPlayer(val,stream)
        })
        stream.writeArray(this.removedObjects,(val:ObjectKey)=>{
            stream.writeString(val.category)
            stream.writeID(val.id)
        })
    }
    decode(stream: NetStream): void {
        this.updatedPlayers=stream.readArray(()=>{
            const mp:UpdatedPlayer={
                id:stream.readID(),
                pos:stream.readVector()
            }
            return mp
        })
        this.newPlayers=stream.readArray(()=>{
            return decodeNewPlayer(stream)
        })
        this.removedObjects=stream.readArray(()=>{
            return {
                category:stream.readString(),
                id:stream.readID()
            }
        })
    }
}