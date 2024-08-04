import { PlayerBase } from "common/scripts/gameObjects/player.ts"
import { Color, FormGameObject2D, Key, RGBA } from "KLSE/CLIENT";
import { Classes } from "KLSE";
import { ActionPacket } from "common/scripts/packets/action_packet.ts";

export class Player extends Classes([FormGameObject2D,PlayerBase]){
    color:Color
    objectType:string="player"
    constructor(){
        super()
        this.color=RGBA.new(0,0,0)
    }
    update(){
        if(this.game.client.ID==this.id){
            const a=new ActionPacket()
            if(this.game.key.keyPress(Key.A)){
                a.Movement.x=-1
            }else if(this.game.key.keyPress(Key.D)){
                a.Movement.x=1
            }else{
                a.Movement.x=0
            }

            if(this.game.key.keyPress(Key.W)){
                a.Movement.y=-1
            }else if(this.game.key.keyPress(Key.S)){
                a.Movement.y=1
            }else{
                a.Movement.y=0
            }
            this.game.client.emit(a)
        }
    }
}