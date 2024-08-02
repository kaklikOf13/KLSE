import { PlayerBase } from "common/scripts/gameObjects/player.ts"
import { Color, FormGameObject2D, RGBA } from "KLSE/CLIENT";
import { Classes } from "KLSE";

export class Player extends Classes([FormGameObject2D,PlayerBase]){
    color:Color
    objectType:string="player"
    constructor(){
        super()
        this.color=RGBA.new(0,0,0)
    }
    update(){
        
    }
}