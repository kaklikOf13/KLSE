import { CircleHitbox, BaseGameObject, Vec } from "KLSE";
import { GameConstants } from "../constants.ts";
import { NewPlayer } from "common/scripts/gameObjects/objectsDefinitions.ts";

export abstract class PlayerBase extends BaseGameObject{
    Name:string
    constructor(){
        super()
        this.hb=new CircleHitbox(Vec.new(0,0),.25)
        //this.hb=new RectHitbox(Vec.new(0,0),Vec.new(.25,.25))
        this.Name=GameConstants.player.defaultName
    }
    /*start(){
        this.hb=(this.parent as Game).categorys[CATEGORYS.PLAYERS].orden.length==1?new CircleHitbox(Vec.new(0,0),.25):new RectHitbox(Vec.new(0,0),Vec.new(.25,.25))
    }*/
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