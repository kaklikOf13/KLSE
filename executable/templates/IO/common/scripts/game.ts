import { BaseGameObject, Game, ID } from "KLSE"
import { NewPlayer } from "common/scripts/gameObjects/objectsDefinitions.ts";

export enum CATEGORYS{
    PLAYERS="players"
}

export abstract class MainGame extends Game{
    constructor(tps:number,thread:number,chunckSize:number){
        super(tps,thread,chunckSize)
        this.add_category(CATEGORYS.PLAYERS)
    }
    abstract addPlayer(np:NewPlayer):BaseGameObject
    havePlayer(id:ID):boolean{
        return this.exist_object(CATEGORYS.PLAYERS,id)
    }
}