import { BaseGameObject, Game, ID } from "KLSE"
import { NewPlayer, ProjectileObj } from "common/scripts/gameObjects/objectsDefinitions.ts";

export enum CATEGORYS{
    PLAYERS="players",
    PROJECTILES="projectiles"
}

export abstract class MainGame extends Game{
    constructor(tps:number,thread:number,chunckSize:number){
        super(tps,thread,chunckSize)
        this.add_category(CATEGORYS.PLAYERS)
        this.add_category(CATEGORYS.PROJECTILES)
    }
    abstract addPlayer(np:NewPlayer):BaseGameObject
    abstract addProjectile(proj:ProjectileObj):BaseGameObject
    havePlayer(id:ID):boolean{
        return this.exist_object(CATEGORYS.PLAYERS,id)
    }
}