import { PacketsManager } from "KLSE";
import { JoinPacket } from "./packets/join_packet.ts";

export const GameConstants={
    player:{
        defaultName:"player"
    },
    tps:30,
}
export const PacketManager:PacketsManager=new PacketsManager()
PacketManager.add_packet(JoinPacket)