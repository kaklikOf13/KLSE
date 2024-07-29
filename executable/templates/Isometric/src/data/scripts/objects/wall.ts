import { Color, IMCGameObject3D, RGBA,RGBAT } from "KLSE/CLIENT";
import { Model3D, BoxHitbox3D, m3, v3 } from "KLSE";

export class Wall extends IMCGameObject3D{
    model: Model3D=m3.cube(1)
    color: Color=RGBA.new(0,255,20)
    create(args: {color?:RGBAT}): void {
        if(args.color)this.color=RGBA.from(args.color)
        this.hb=new BoxHitbox3D(this.position,v3.new(1,1,1))
    }
    update(): void {
      
    }
}