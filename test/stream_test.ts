import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { NetStream } from "../stream.ts";
Deno.test("Stream Basics",()=>{
    var stream=new NetStream()
    stream.writeInt32(102)
    stream.writeUInt8(255)
    stream.writeInt8(-122)
    stream.goto(0)
    assertEquals(stream.readInt32(),102)
    assertEquals(stream.readUInt8(),255)
    assertEquals(stream.readInt8(),-122)
})
Deno.test("Stream Array",()=>{
    var stream=new NetStream()
    const arr=[[1000,5],[12,234],[15,255]]
    stream.writeArray(arr,(val)=>{
        stream.writeInt16(val[0])
        stream.writeUInt8(val[1])
    })
    stream.goto(0)
    assertEquals(stream.readArray(()=>{
        return [stream.readInt16(),stream.readUInt8()]
    }),arr)
})