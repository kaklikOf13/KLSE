import { CircleHitbox, BaseGameObject, Vec } from "KLSE";
import { GameConstants } from "../constants.ts";
import { NewPlayer } from "common/scripts/gameObjects/objectsDefinitions.ts";

export abstract class PlayerBase extends BaseGameObject{
    Name:string
    constructor(){
        super()
        this.hb=new CircleHitbox(Vec.new(0,0),.5)
        this.Name=GameConstants.player.defaultName
    }
    fromNewPlayer(np:NewPlayer){
        this.Name=np.Name
        this.position=np.Position
        this.id=np.Id
    }
    toNewPlayer():NewPlayer{
        return {
            Id:this.id,
            Name:this.Name,
            Position:this.position,
        }
    }
}