import { Color, IMCGameObject3D, RGBA,RGBAT } from "KLSE/CLIENT";
import { Model3D, BoxHitbox3D, v3 } from "KLSE";

export class Wall extends IMCGameObject3D{
    model!: Model3D
    color: Color=RGBA.new(0,255,20)
    create(args: {color?:RGBAT}): void {
        if(args.color)this.color=RGBA.from(args.color)
        this.model=this.game.resource.get_model3D("cube")
        this.hb=new BoxHitbox3D(this.position,v3.new(1,1,1))
    }
    update(): void {
      
    }
}