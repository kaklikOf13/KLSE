import { GameObjectsManager } from "https://deno.land/x/klse/mod.ts"
export class Game{
    manager:GameObjectsManager
    constructor(thread:number,chunksize:number){
        this.manager=new GameObjectsManager(thread,chunksize)
    }
}