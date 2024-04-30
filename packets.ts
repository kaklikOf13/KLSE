import { NetStream } from "./stream.ts"

export type PacketID=number

export abstract class Packet{
    abstract ID:PacketID
    _size:number=0
    abstract encode(stream:NetStream):void
    abstract decode(stream:NetStream):void
    toString():string{return `{ID:${this.ID}}`}
}

export class PacketsManager{
    packets:Map<PacketID,new () => Packet>
    constructor(){
        this.packets=new Map()
    }
    encode(packet:Packet,stream?:NetStream):NetStream{
        if(!stream){
            stream=new NetStream()
        }
        stream.writeUInt16(packet.ID)
        packet.encode(stream)
        return stream
    }
    decode(stream:NetStream):Packet{
        const id:PacketID=stream.readUInt16()
        if (this.packets.get(id)){
            // deno-lint-ignore ban-ts-comment
            //@ts-expect-error
            const pt:new () => Packet=this.packets.get(id)
            const p=new pt()
            p.decode(stream)
            p._size=stream.pos
            return p
        }else{
            throw new Error(`the Packet ${id} dont exist`)
        }
    }
    add_packet(pack:new () => Packet){
        this.packets.set(new pack().ID,pack)
    }
}