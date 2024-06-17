import { ID, NetStream, Vector } from "KLSE";

export interface UpdatedPlayer {id:ID,pos:Vector}
export interface NewPlayer {
    Name:string,
    Position:Vector,
    Id:ID
}
export function encodeNewPlayer(np:NewPlayer,stream:NetStream){
    stream.writeID(np.Id)
    stream.writeString(np.Name)
    stream.writeVector(np.Position)
}
export function decodeNewPlayer(stream:NetStream):NewPlayer{
    return {
        Id:stream.readID(),
        Name:stream.readString(),
        Position:stream.readVector()
    }
}