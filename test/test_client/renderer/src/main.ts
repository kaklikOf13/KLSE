import { RGBA, Renderer, createCanvas } from "../../../../client_side/mod.ts"
import { RectHitbox, CircleHitbox, Vec } from "../../../../mod.ts"
const canvas=createCanvas(Vec.new(500,500),true)
document.body.appendChild(canvas)
const renderer=new Renderer(canvas,100)
renderer.clear()
console.log("begin",new Date().getMilliseconds())
for(let i=0;i<5000;i++){
    const circle=new CircleHitbox(Vec.new(2,1),1)
    renderer.draw_circle(circle,RGBA.new(0,255,0))
}
for(let i=0;i<5000;i++){
    const rect=new RectHitbox(Vec.new(0,0),Vec.new(1,1))
    renderer.draw_rect(rect,RGBA.new(255,0,0,255))
}
console.log("end",new Date().getMilliseconds())