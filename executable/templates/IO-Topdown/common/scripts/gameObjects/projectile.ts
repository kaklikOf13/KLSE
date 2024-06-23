import { CircleHitbox, BaseGameObject, Vec,Vector } from "KLSE";
import { GameConstants } from "../constants.ts";
import { ProjectileObj } from "common/scripts/gameObjects/objectsDefinitions.ts";

export abstract class ProjectileBase extends BaseGameObject{
    velocity:Vector
    lifeTime:number
    constructor(){
        super()
        this.hb=new CircleHitbox(Vec.new(0,0),.05)
        this.velocity=Vec.new(0,0)
        this.lifeTime=5
        this.calldestroy=false
    }
    update(){
        this.lifeTime-=1/GameConstants.tps
        if(this.lifeTime<0){
            this.destroyed=true
        }
        this.position=Vec.add(this.position,this.velocity)
    }
    fromObj(obj:ProjectileObj){
        this.lifeTime=obj.lifeTime
        this.id=obj.id
        this.velocity=Vec.scale(Vec.from_DegAngle(obj.angle),obj.speed)
        this.position=obj.pos
    }
}