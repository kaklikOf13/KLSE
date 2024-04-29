import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { Packet,PacketsManager } from "../packets.ts"
import { NetStream } from "../stream.ts"
class TestPacket1 extends Packet{
    number1:number
    ID=5
    constructor(n1:number=0){
        super()
        this.number1=n1
    }
    encode(stream:NetStream):void{
        stream.writeInt64(this.number1)
    }
    decode(stream: NetStream): void {
      this.number1=stream.readInt64()
    }
    toString():string{
        return `${this.number1}`
    }
}
class TestPacket2 extends Packet{
    number1:number
    number2:number
    ID=10
    constructor(n1:number=0,n2:number=0){
        super()
        this.number1=n1
        this.number2=n2
    }
    encode(stream:NetStream):void{
        stream.writeInt64(this.number1)
        stream.writeUInt16(this.number2)
    }
    decode(stream: NetStream): void {
      this.number1=stream.readInt64()
      this.number2=stream.readUInt16()
    }
    toString():string{
        return `${this.number1},${this.number2}`
    }
}
Deno.test("Packets",()=>{
    const manager=new PacketsManager()
    const pack1=new TestPacket1(3)
    const pack2=new TestPacket2(1,5)
    manager.add_packet(TestPacket1)
    manager.add_packet(TestPacket2)
    const st=manager.encode(pack1)
    manager.encode(pack2,st)
    st.goto(0)
    const pr1=manager.decode(st)
    const pr2=manager.decode(st)
    assertEquals(pr1.toString(),pack1.toString())
    console.log(pr1.toString())
    assertEquals(pr2.toString(),pack2.toString())
    console.log(pr2.toString())
})