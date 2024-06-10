import { GameObject, GameObjectsManager, ID } from "KLSE"
import { JoinPacket } from "./packets/join_packet.ts"

export enum CATEGORYS{
    PLAYERS="players"
}
export abstract class Game{
    manager:GameObjectsManager
    constructor(thread:number,chunksize:number){
        this.manager=new GameObjectsManager(thread,chunksize)
        this.manager.add_category(CATEGORYS.PLAYERS)
    }
    update(){
        this.manager.update()
    }
    abstract addPlayer(joinpacket:JoinPacket):GameObject
    getPlayer(id:ID):GameObject{
        return this.manager.categorys[CATEGORYS.PLAYERS].objs[id]
    }
    havePlayer(id:ID):boolean{
        return Object.hasOwn(this.manager.categorys[CATEGORYS.PLAYERS].objs,id)
    }
}