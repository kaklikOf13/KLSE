import { RGBA, WebglRenderer, createCanvas,Camera3D } from "../../../../client_side/renderer.ts"
import { Angle, NullVec3, Vec3, v2, v3 } from "../../../../utils/geometry.ts"
import { Model3D, m3 } from "../../../../utils/models.ts"
(async()=>{
const canvas=createCanvas(v2.new(700,700),true)
canvas.id="maincanvas"
document.body.appendChild(canvas)
const renderer=new WebglRenderer(canvas,40,RGBA.new(255,255,255))
renderer.clear()
console.log("begin",new Date().getMilliseconds())
const camera:Camera3D=new Camera3D()
const rot:Vec3=v3.new(0,0,0)
const model=m3.parseObj(await(await(fetch("/terrain.obj"))).text())

const material=renderer.material.normal.generateMaterial(RGBA.new(255,0,0))
webglLessonsUI.setupSlider("#x", {value: camera.position.x, slide: updatePosition(0), min: -100,max:100,step:.1})
webglLessonsUI.setupSlider("#y", {value: camera.position.y, slide: updatePosition(1), min: -100,max:100,step:.1})
webglLessonsUI.setupSlider("#z", {value: camera.position.z, slide: updatePosition(2), max: 100, min: -100,step:.1})
webglLessonsUI.setupSlider("#angleX", {value: camera.rotation.x, slide: updateRotation(0), max: 360})
webglLessonsUI.setupSlider("#angleY", {value: camera.rotation.y, slide: updateRotation(1), max: 360})
webglLessonsUI.setupSlider("#angleZ", {value: camera.rotation.z, slide: updateRotation(2), max: 360})

function updatePosition(index:number) {
    return function(event:any, ui:any) {
        switch(index){
            case 0:
                camera.position.x=ui.value
                break
            case 1:
                camera.position.y=ui.value
                break
            case 2:
                camera.position.z=ui.value
                break
        }
    };
}

function updateRotation(index:number) {
    return function(event:any, ui:any) {
        switch(index){
            case 0:
                camera.rotation.x=ui.value
                break
            case 1:
                camera.rotation.y=ui.value
                break
            case 2:
                camera.rotation.z=ui.value
                break
        }
    };
    /*return function(event:any, ui:any) {
        switch(index){
            case 0:
                rot.x=ui.value
                break
            case 1:
                rot.y=ui.value
                break
            case 2:
                rot.z=ui.value
                break
        }
    };*/
}


function Update(){
    renderer.clear()
    camera.update(renderer)
    renderer.draw_model3D(model,NullVec3,v3.new(.5,.5,.5),rot,camera,material)
    self.requestAnimationFrame(Update)
}
Update()
})()