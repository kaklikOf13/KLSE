import { IMCGameObject3D,HEXCOLOR } from "KLSE/CLIENT";
import { Model3D, BoxHitbox3D, v3 } from "KLSE";

export class Wall extends IMCGameObject3D{
    model!: Model3D
    objectType="wall"
    create(args: {color?:string}): void {
        this.material=this.game.resources.get_material("wall/material")
        if(args.color){
            this.material=this.game.renderer.material.normal.generateMaterial(HEXCOLOR.new(args.color))
        }
        this.model=this.game.resources.get_model3D("cube")
        this.hb=new BoxHitbox3D(this.position,v3.new(1,1,1))
    }
    update(): void {
      
    }
}