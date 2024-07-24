import { RGBA, WebglRenderer, createCanvas } from "../../../../client_side/renderer.ts"
import { ResourcesManager } from "../../../../client_side/resources.ts";
import { v2, v3 } from "../../../../utils/geometry.ts";
import { RectHitbox2D, CircleHitbox2D, RectHitbox3D } from "../../../../utils/hitbox.ts"
import { m3 } from "../../../../utils/models.ts";
const canvas=createCanvas(v2.new(500,500),true)
document.body.appendChild(canvas)
const renderer=new WebglRenderer(canvas,50)
renderer.clear()
console.log("begin",new Date().getMilliseconds())
for(let i=0;i<5000;i++){
    const circle=new CircleHitbox2D(v2.new(2,1),1)
    renderer.draw_circle2D(circle,RGBA.new(0,255,0))
}
for(let i=0;i<5000;i++){
    const rect=new RectHitbox2D(v2.new(0,0),v2.new(1,1))
    renderer.draw_rect2D(rect,RGBA.new(255,0,0,255))
}
for(let i=0;i<1000;i++){
    const rect=new RectHitbox3D(v3.new(5,-1,1),v3.new(1,1,1))
    renderer.draw_iso_rect(rect,RGBA.new(255,0,0,255),true)
}
console.log("end",new Date().getMilliseconds())
//rect with rect
setTimeout(()=>{
    console.log("begin",new Date().getMilliseconds())
    const rhb1=new RectHitbox2D(v2.new(2,2),v2.new(1,1))
    const rhb2=new RectHitbox2D(v2.new(2,2),v2.new(1,1))
    const interval=setInterval(()=>{
        renderer.clear()
        const collision=rhb1.overlapCollision(rhb2)
        rhb1.position=v2.sub(rhb1.position,v2.scale(collision.overlap,.05))
        renderer.draw_hitbox2D(rhb1,RGBA.new(255,0,0))
        renderer.draw_hitbox2D(rhb2,RGBA.new(255,0,0))
        console.log(collision)
        if(!collision.collided){
            setTimeout(rect_with_rect2,800)
            clearInterval(interval)
            console.log("end",new Date().getMilliseconds())
        }
    },5)
},1000)
//rect with rect 2
function rect_with_rect2(){
    console.log("begin",new Date().getMilliseconds())
    const hb:RectHitbox2D[]=[]
    for(let i=0;i<20;i++){
        hb.push(new RectHitbox2D(v2.random(2,6),v2.new(1,1)))
    }
    const f=()=>{
        renderer.clear()
        let collided=false
        for(let i=0;i<hb.length;i++){
            for(let j=0;j<hb.length;j++){
                if(i==j) continue
                const col=hb[i].overlapCollision(hb[j])
                hb[i].position=v2.sub(hb[i].position,v2.scale(col.overlap,1))
                hb[j].position=v2.add(hb[j].position,v2.scale(col.overlap,1))
                collided=collided||col.collided
                console.log(col)
            }
        }
        for(let i=0;i<hb.length;i++){
            renderer.draw_hitbox2D(hb[i],RGBA.new(255,0,0))
        }
        if(!collided){
            setTimeout(circle_with_rect,800)
            console.log("end",new Date().getMilliseconds())
        }else{
            console.log(collided,"a")
            self.requestAnimationFrame(f)
        }
    }
    f()
}
//circle with rect
function circle_with_rect(){
    console.log("begin",new Date().getMilliseconds())
    const rhb1=new RectHitbox2D(v2.new(2,2),v2.new(1,1))
    const chb1=new CircleHitbox2D(v2.new(2,2),1)
    const interval=setInterval(()=>{
        renderer.clear()
        const collision=rhb1.overlapCollision(chb1)
        rhb1.position=v2.sub(rhb1.position,v2.scale(collision.overlap,.05))
        chb1.position=v2.add(chb1.position,v2.scale(collision.overlap,.05))
        renderer.draw_hitbox2D(rhb1,RGBA.new(255,0,0))
        renderer.draw_hitbox2D(chb1,RGBA.new(255,0,0))
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
    const chb1=new CircleHitbox2D(v2.new(2,2),1)
    const chb2=new CircleHitbox2D(v2.new(2,2),1)
    const interval=setInterval(()=>{
        renderer.clear()
        const collision=chb1.overlapCollision(chb2)
        chb1.position=v2.sub(chb1.position,v2.scale(collision.overlap,.05))
        chb2.position=v2.add(chb2.position,v2.scale(collision.overlap,.05))
        renderer.draw_hitbox2D(chb1,RGBA.new(255,0,0))
        renderer.draw_hitbox2D(chb2,RGBA.new(255,0,0))
        console.log(collision)
        if(!collision.collided){
            clearInterval(interval)
            setTimeout(test_image,800)
            console.log("end",new Date().getMilliseconds())
        }
    },5)
}
async function test_image(){
    const svg=`<svg version="1.1" baseProfile="full" width="300" height="200"
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="100" r="80" fill="green" />
    <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text></svg>`
    const source=new ResourcesManager()
    // deno-lint-ignore ban-ts-comment
    //@ts-expect-error
    const img=await source.load_svg("svg.img",source.domp.parseFromString(svg, 'image/svg+xml').querySelector("svg"),.3)
    document.body.appendChild(img.source)
    renderer.clear()
    renderer.draw_image2D(img,v2.new(0,0),v2.new(1,1))
    setTimeout(rect_iso,1000)
}
//rect iso
function rect_iso(){
    console.log("begin",new Date().getMilliseconds())
    const chb1=new RectHitbox3D(v3.new(2,0,-5),v3.new(1,1,1))
    const chb2=new RectHitbox3D(v3.new(2,0,-1),v3.new(1,1,1))
    let ok=false
    const interval=setInterval(()=>{
        renderer.clear()
        const collision=chb1.overlapCollision(chb2)
        if(!ok){
            chb1.position.z+=.1
        }
        chb1.position=v3.sub(chb1.position,v3.scale(collision.overlap,.05))
        renderer.draw_iso_rect(chb1,RGBA.new(255,0,0),true)
        renderer.draw_iso_rect(chb2,RGBA.new(255,0,0))
        ok=ok||collision.collided
        console.log(collision)
        if(!collision.collided&&ok){
            clearInterval(interval)
            setTimeout(rect_iso2,800)
            console.log("end",new Date().getMilliseconds())
        }
    },5)
}
//rect iso2
function rect_iso2(){
    console.log("begin",new Date().getMilliseconds())
    const chb1=new RectHitbox3D(v3.new(2,0,1),v3.new(1,1,1))
    const chb2=new RectHitbox3D(v3.new(2,0,3),v3.new(1,1,1))
    let ok=false
    const interval=setInterval(()=>{
        renderer.clear()
        const collision=chb1.overlapCollision(chb2)
        if(!ok){
            chb2.position.z-=.1
        }
        chb2.position=v3.add(chb2.position,v3.scale(collision.overlap,.05))
        renderer.draw_iso_rect(chb1,RGBA.new(255,0,0),true)
        renderer.draw_iso_rect(chb2,RGBA.new(255,0,0))
        ok=ok||collision.collided
        console.log(collision)
        if(!collision.collided&&ok){
            clearInterval(interval)
            setTimeout(model_iso,800)
            console.log("end",new Date().getMilliseconds())
        }
    },5)
}

//model iso
function model_iso(){
    console.log("begin",new Date().getMilliseconds())
    const model=m3.cube(1)
    const chb1=model.toRect()
    chb1.position=v3.new(4,0,3)
    const chb2=new RectHitbox3D(v3.new(7,0,3),v3.new(1,1,1))
    let ok=false
    const interval=setInterval(()=>{
        renderer.clear()
        const collision=chb1.overlapCollision(chb2)
        if(!ok){
            chb2.position.x-=.1
        }
        chb2.position=v3.add(chb2.position,v3.scale(collision.overlap,.05))
        renderer.color_draw_iso_model(model,chb1.position,v3.new(1,1,1),RGBA.new(255,0,0))
        renderer.draw_iso_rect(chb2,RGBA.new(255,0,0))
        ok=ok||collision.collided
        console.log(collision)
        if(!collision.collided&&ok){
            clearInterval(interval)
            setTimeout(model_obj_iso,800)
            console.log("end",new Date().getMilliseconds())
        }
    },5)
}
//model obj iso
function model_obj_iso(){
    console.log("begin",new Date().getMilliseconds())
    const model=m3.parseObj(`
v 1.000000 1.000000 0
v 1.000000 0 0
v 1.000000 1.000000 1.000000
v 1.000000 0 1.000000
v 0 1.000000 0
v 0 0 0
v 0 1.000000 1.000000
v 0 0 1.000000
vn 0.0000 1.0000 0.0000
vn 0.0000 0.0000 1.0000
vn -1.0000 0.0000 0.0000
vn 0.0000 -1.0000 0.0000
vn 1.0000 0.0000 0.0000
vn 0.0000 0.0000 -1.0000
vt 0.875000 0.500000
vt 0.625000 0.750000
vt 0.625000 0.500000
vt 0.375000 1.000000
vt 0.375000 0.750000
vt 0.625000 0.000000
vt 0.375000 0.250000
vt 0.375000 0.000000
vt 0.375000 0.500000
vt 0.125000 0.750000
vt 0.125000 0.500000
vt 0.625000 0.250000
vt 0.875000 0.750000
vt 0.625000 1.000000
s 0
f 5/1/1 3/2/1 1/3/1
f 3/2/2 8/4/2 4/5/2
f 7/6/3 6/7/3 8/8/3
f 2/9/4 8/10/4 6/11/4
f 1/3/5 4/5/5 2/9/5
f 5/12/6 2/9/6 6/7/6
f 5/1/1 7/13/1 3/2/1
f 3/2/2 7/14/2 8/4/2
f 7/6/3 5/12/3 6/7/3
f 2/9/4 4/5/4 8/10/4
f 1/3/5 3/2/5 4/5/5
f 5/12/6 1/3/6 2/9/6
`)
    const chb1=model.toRect()
    chb1.position=v3.new(6,0,3)
    const chb2=new RectHitbox3D(v3.new(3,0,3),v3.new(1,1,1))
    let ok=false
    const interval=setInterval(()=>{
        renderer.clear()
        const collision=chb1.overlapCollision(chb2)
        if(!ok){
            chb2.position.x+=.1
        }
        chb2.position=v3.add(chb2.position,v3.scale(collision.overlap,.05))
        renderer.wireframe_draw_iso_model(model,chb1.position,v3.new(1,1,1),RGBA.new(255,0,0))
        renderer.draw_iso_rect(chb2,RGBA.new(255,0,0))
        ok=ok||collision.collided
        console.log(collision)
        if(!collision.collided&&ok){
            model.addFace3({p1:v3.new(1,1,1),p2:v3.new(-4,-1,-4),p3:v3.new(-4,-4,4)})
            renderer.color_draw_iso_model(model,chb1.position,v3.new(1,1,1),RGBA.new(0,0,255))
            clearInterval(interval)
            console.log("end",new Date().getMilliseconds())
        }
    },5)
}