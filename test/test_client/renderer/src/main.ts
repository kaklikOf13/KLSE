import { RGBA, WebglRenderer, createCanvas } from "../../../../client_side/renderer"
import { Vec } from "../../../../geometry"
import { CircleHitbox, RectHitbox } from "../../../../hitbox"
const canvas=createCanvas(Vec.new(400,400),true)
document.body.appendChild(canvas)
const renderer=new WebglRenderer(canvas)
const rect=new RectHitbox(Vec.new(-1,-1),Vec.new(.1,.1))
renderer.clear()
renderer.draw_rect(rect,RGBA.new(255,0,0))

console.log("begin",new Date().getMilliseconds())
for(let i=0;i<5000;i++){
    const circle=new CircleHitbox(Vec.new(-1,-1),1)
    renderer.draw_circle(circle,RGBA.new(0,255,0,200))
}
console.log("end",new Date().getMilliseconds())