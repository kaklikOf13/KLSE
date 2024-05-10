import { RGBA, Renderer, createCanvas } from "../../../../client_side/mod.ts"
import { RectHitbox, CircleHitbox, Vec } from "../../../../mod.ts"
const canvas=createCanvas(Vec.new(400,400),true)
document.body.appendChild(canvas)
const renderer=new Renderer(canvas)
const rect=new RectHitbox(Vec.new(-1,-1),Vec.new(.1,.1))
renderer.clear()
renderer.draw_rect(rect,RGBA.new(255,0,0))

console.log("begin",new Date().getMilliseconds())
for(let i=0;i<5000;i++){
    const circle=new CircleHitbox(Vec.new(-1,-1),1)
    renderer.draw_circle(circle,RGBA.new(0,255,0,200))
}
for(let i=0;i<5000;i++){
    const rect=new RectHitbox(Vec.new(-.7,-1),Vec.new(.1,.1))
    renderer.draw_rect(rect,RGBA.new(255,0,0))
}
console.log("end",new Date().getMilliseconds())