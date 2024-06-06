import { GameObjectsManager } from "KLSE"
export class Game{
    manager:GameObjectsManager
    constructor(thread:number,chunksize:number){
        this.manager=new GameObjectsManager(thread,chunksize)
    }
}