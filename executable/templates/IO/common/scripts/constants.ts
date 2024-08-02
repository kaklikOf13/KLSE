import { PacketsManager } from "KLSE";
import { JoinPacket } from "./packets/join_packet.ts";
import { ActionPacket } from "common/scripts/packets/action_packet.ts";

export const GameConstants={
    player:{
        defaultName:"player",
    },
    tps:30,
    collision:{
        threads:2,
        chunckSize:32
    }
}
export enum CATEGORYS{
    PLAYERS="players"
}

export const PacketManager:PacketsManager=new PacketsManager()
PacketManager.add_packet(JoinPacket)
PacketManager.add_packet(ActionPacket)