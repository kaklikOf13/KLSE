import { Vector,Vec } from "./geometry.ts";
import { ID } from "./types.ts";

export class NetStream {
    buffer: Uint8Array
    pos: number
    constructor(buffer:undefined|null|Uint8Array=null) {
        if (buffer instanceof Uint8Array){
            this.buffer=buffer
        }else{
            this.buffer = new Uint8Array()
        }
        this.pos = 0
    }

    insert(val: Uint8Array) {
        this.buffer = Uint8Array.from([...this.buffer, ...val])
        this.pos = this.buffer.length
    }

    walk(val: number) {
        this.pos += val
        if (this.pos > this.buffer.length) {
            this.pos = this.buffer.length
        }
    }

    goto(val: number) {
        this.pos = val
        if (this.pos > this.buffer.length) {
            this.pos = this.buffer.length
        }
    }

    writeUInt8(val: number) {
        this.insert(new Uint8Array([val]))
    }

    writeInt8(val: number) {
        const buf = new Uint8Array(1)
        buf[0] = val & 0xFF
        this.insert(buf)
    }

    writeUInt16(val: number) {
        const buf = new Uint8Array(2)
        buf[0] = (val & 0xFF00) >> 8
        buf[1] = val & 0xFF
        this.insert(buf)
    }

    writeInt16(val: number) {
        const buf = new Uint8Array(2)
        buf[0] = (val >> 8) & 0xFF
        buf[1] = val & 0xFF
        this.insert(buf)
    }

    writeUInt32(val: number) {
        const buf = new Uint8Array(4)
        buf[0] = (val & 0xFF000000) >>> 24
        buf[1] = (val & 0x00FF0000) >>> 16
        buf[2] = (val & 0x0000FF00) >>> 8
        buf[3] = val & 0x000000FF
        this.insert(buf);
    }

    writeInt32(val: number) {
        const buf = new Uint8Array(4)
        buf[0] = (val >> 24) & 0xFF
        buf[1] = (val >> 16) & 0xFF
        buf[2] = (val >> 8) & 0xFF
        buf[3] = val & 0xFF
        this.insert(buf)
    }

    writeUInt64(val: number) {
        const high = Math.floor(val / 0x100000000)
        const low = val & 0xFFFFFFFF
        this.writeUInt32(low)
        this.writeUInt32(high)
    }

    writeInt64(val: number) {
        const high = Math.floor(val / 0x100000000)
        const low = val & 0xFFFFFFFF
        this.writeInt32(low)
        this.writeInt32(high)
    }

    writeFloat32(val: number) {
        const buf = new Uint8Array(4)
        new DataView(buf.buffer).setFloat32(0, val, true)
        this.insert(buf)
    }

    writeFloat64(val: number) {
        const buf = new Uint8Array(8)
        new DataView(buf.buffer).setFloat64(0, val, true)
        this.insert(buf)
    }
    // deno-lint-ignore no-explicit-any
    writeArray(array: any, encodeFunc: (value:any) => void) {
        this.writeUInt32(array.length)
        for (const item of array) {
            encodeFunc(item)
        }
    }

    readUInt8(): number {
        const val = this.buffer[this.pos]
        this.walk(1)
        return val
    }

    readInt8(): number {
        const val = this.readUInt8()
        return (val & 0x80) ? val - 0x100 : val
    }

    readUInt16(): number {
        const val = (this.buffer[this.pos] << 8) | this.buffer[this.pos + 1]
        this.walk(2)
        return val
    }

    readInt16(): number {
        const val = this.readUInt16()
        return (val & 0x8000) ? val - 0x10000 : val
    }

    readUInt32(): number {
        const val = (this.buffer[this.pos] << 24) | (this.buffer[this.pos + 1] << 16) | (this.buffer[this.pos + 2] << 8) | this.buffer[this.pos + 3]
        this.walk(4)
        return val
    }

    readInt32(): number {
        const val = this.readUInt32()
        return (val & 0x80000000) ? val - 0x100000000 : val
    }

    readUInt64(): number {
        const low = this.readUInt32()
        const high = this.readUInt32()
        return (high * 0x100000000) + low
    }

    readInt64(): number {
        const low = this.readInt32()
        const high = this.readInt32()
        return (high * 0x100000000) + low
    }

    readFloat32(): number {
        const val = new DataView(this.buffer.buffer, this.pos).getFloat32(0, true)
        this.walk(4)
        return val
    }

    readFloat64(): number {
        const val = new DataView(this.buffer.buffer, this.pos).getFloat64(0, true)
        this.walk(8)
        return val
    }
    // deno-lint-ignore no-explicit-any
    readArray(decodeFunc: () => any): any[] {
        const length = this.readUInt32()
        // deno-lint-ignore no-explicit-any
        const array: any[] = []
        for (let i = 0; i < length; i++) {
            const item = decodeFunc()
            array.push(item)
        }
        return array
    }
    
    // Expecial Types
    writeVector(vec:Vector){
        this.writeFloat32(vec.x)
        this.writeFloat32(vec.y)
    }
    readVector():Vector{
        return Vec.new(this.readFloat32(),this.readFloat32())
    }

    writeID(id:ID){
        this.writeUInt32(id)
    }
    readID():ID{
        return this.readUInt32()
    }
}
