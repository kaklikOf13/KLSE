import {IMCGameObject3D,Key,RGBA} from "KLSE/CLIENT"
import { m3,Model3D,Vec3,v3 } from "KLSE";
export class Player extends IMCGameObject3D{
    color=RGBA.new(255,0,0,255)
    model: Model3D=m3.cube(1)
    velocity:Vec3=v3.new(0,0,0)
    moveSpeed:number=.1
    gravity:number=.01
    update(): void {
        if(this.game.key.keyPress(Key.A)){
            this.velocity.x=-this.moveSpeed
        }else if(this.game.key.keyPress(Key.D)){
            this.velocity.x=this.moveSpeed
        }else{
            this.velocity.x*=.5
        }
        if(this.game.key.keyPress(Key.S)){
            this.velocity.z=-this.moveSpeed
        }else if(this.game.key.keyPress(Key.W)){
            this.velocity.z=this.moveSpeed
        }else{
            this.velocity.z*=.5
        }
        this.velocity.y-=this.gravity
        const colo=this.game.scene.cells.get_objects(this.hb,["walls"])
        for(const c in colo){
            for(const obj of colo[c]){
                const c=this.hb.overlapCollision(obj.hb)
                if(!c.collided)continue
                this.velocity=v3.mult(this.velocity,v3.sub(v3.new(1,1,1),v3.absolute(c.dire)))
                this.position=v3.sub(this.position,c.overlap)
            }
        }
        this.position=v3.add(this.position,this.velocity)
        this.game.camera.position=v3.lerp(this.game.camera.position,this.game.getCameraCenter(this.hb.center()),.1)
    }
    // deno-lint-ignore no-explicit-any
    create(_args: Record<string, any>): void {
        this.hb=this.model.toRect()
    }
    onDestroy(): void {
      
    }
}
