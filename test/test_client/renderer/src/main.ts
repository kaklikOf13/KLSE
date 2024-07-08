import { RGBA, Renderer, createCanvas } from "../../../../client_side/mod.ts"
import { RectHitbox, CircleHitbox, v2 } from "../../../../mod.ts"
const canvas=createCanvas(v2.new(500,500),true)
document.body.appendChild(canvas)
const renderer=new Renderer(canvas,50)
renderer.clear()
console.log("begin",new Date().getMilliseconds())
for(let i=0;i<5000;i++){
    const circle=new CircleHitbox(v2.new(2,1),1)
    renderer.draw_circle(circle,RGBA.new(0,255,0))
}
for(let i=0;i<5000;i++){
    const rect=new RectHitbox(v2.new(0,0),v2.new(1,1))
    renderer.draw_rect(rect,RGBA.new(255,0,0,255))
}
console.log("end",new Date().getMilliseconds())
//rect with rect
setTimeout(()=>{
    console.log("begin",new Date().getMilliseconds())
    const rhb1=new RectHitbox(v2.new(2,2),v2.new(1,1))
    const rhb2=new RectHitbox(v2.new(2,2),v2.new(1,1))
    const interval=setInterval(()=>{
        renderer.clear()
        const collision=rhb1.overlapCollision(rhb2)
        rhb1.position=v2.sub(rhb1.position,v2.scale(collision.overlap,.05))
        renderer.draw_hitbox(rhb1,RGBA.new(255,0,0))
        renderer.draw_hitbox(rhb2,RGBA.new(255,0,0))
        console.log(collision)
        if(!collision.collided){
            setTimeout(circle_with_rect,800)
            clearInterval(interval)
            console.log("end",new Date().getMilliseconds())
        }
    },5)
},1000)
//circle with rect
function circle_with_rect(){
    console.log("begin",new Date().getMilliseconds())
    const rhb1=new RectHitbox(v2.new(2,2),v2.new(1,1))
    const chb1=new CircleHitbox(v2.new(2,2),1)
    const interval=setInterval(()=>{
        renderer.clear()
        const collision=rhb1.overlapCollision(chb1)
        rhb1.position=v2.sub(rhb1.position,v2.scale(collision.overlap,.05))
        chb1.position=v2.add(chb1.position,v2.scale(collision.overlap,.05))
        renderer.draw_hitbox(rhb1,RGBA.new(255,0,0))
        renderer.draw_hitbox(chb1,RGBA.new(255,0,0))
        console.log(collision)
        if(!collision.collided){
            setTimeout(circle_with_circle,800)
            clearInterval(interval)
            console.log("end",new Date().getMilliseconds())
        }
    },5)
}
//circle with circle
function circle_with_circle(){
    console.log("begin",new Date().getMilliseconds())
    const chb1=new CircleHitbox(v2.new(2,2),1)
    const chb2=new CircleHitbox(v2.new(2,2),1)
    const interval=setInterval(()=>{
        renderer.clear()
        const collision=chb1.overlapCollision(chb2)
        chb1.position=v2.sub(chb1.position,v2.scale(collision.overlap,.05))
        chb2.position=v2.add(chb2.position,v2.scale(collision.overlap,.05))
        renderer.draw_hitbox(chb1,RGBA.new(255,0,0))
        renderer.draw_hitbox(chb2,RGBA.new(255,0,0))
        console.log(collision)
        if(!collision.collided){
            clearInterval(interval)
            console.log("end",new Date().getMilliseconds())
        }
    },5)
}