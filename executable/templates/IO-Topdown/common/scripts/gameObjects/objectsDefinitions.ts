import { DegAngle, ID, NetStream, Vector } from "KLSE";

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

export interface ProjectileObj {
    id:ID,
    pos:Vector,
    angle:DegAngle,
    speed:number,
    lifeTime:number
}
export function encodeProjectileObj(def:ProjectileObj,stream:NetStream){
    stream.writeID(def.id)
    stream.writeVector(def.pos)
    stream.writeInt16(def.angle)
    stream.writeFloat32(def.speed)
    stream.writeFloat32(def.lifeTime)
}
export function decodeProjectileDef(stream:NetStream):ProjectileObj{
    return {
        id:stream.readID(),
        pos:stream.readVector(),
        angle:stream.readInt16(),
        speed:stream.readFloat32(),
        lifeTime:stream.readFloat32()
    }
}