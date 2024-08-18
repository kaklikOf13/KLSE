import {IMCGameObject3D,Key,RGBA} from "KLSE/CLIENT"
import { m3,Model3D,Vec3,v3 } from "KLSE";
export class Player extends IMCGameObject3D{
    velocity:Vec3=v3.new(0,0,0)
    moveSpeed:number=.1
    gravity:number=.01
    jumpHeight:number=.2
    objectType:string="player"
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
        this.velocity.y+=this.gravity
        const colo=this.game.scene.cells.get_objects(this.hb,["walls"])
        let canJump=false
        for(const c in colo){
            for(const obj of colo[c]){
                const c=this.hb.overlapCollision(obj.hb)
                if(!c.collided)continue
                this.velocity=v3.mult(this.velocity,v3.sub(v3.new(1,1,1),v3.absolute(c.dire)))
                canJump=canJump||c.dire.y==1
                this.position=v3.sub(this.position,c.overlap)
            }
        }
        if(canJump&&this.game.key.keyPress(Key.Space)){
            this.velocity.y-=this.jumpHeight
        }
        this.position=v3.add(this.position,this.velocity)
        this.game.camera.rotation=v3.new(180,0,0)
        this.game.camera.position=v3.lerp(this.game.camera.position,v3.add(this.hb.transform.position,v3.new(0,-3,-10)),.1)
    }
    // deno-lint-ignore no-explicit-any
    create(_args: Record<string, any>): void {
        this.material=this.game.resources.get_material("player/material")
        this.model=this.game.resources.get_model3D("cube")
        this.hb=this.model.toRect()
    }
    onDestroy(): void {
      
    }
}
