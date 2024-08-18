import { EaseFunction, ease } from "../utils/_utils.ts";
import { m3, Model3D } from "../utils/models.ts";
import { type GLMaterial } from "./renderer.ts";

export interface SoundDef{
    volume:number
    src:string
}
export class Sprite{
    source:HTMLImageElement
    readonly resourceType:SourceType.Sprite=SourceType.Sprite
    constructor(source:HTMLImageElement){
        this.source=source
    }
}
export interface KeyFrame{
    ease:EaseFunction
    // deno-lint-ignore no-explicit-any
    value:any
    dest:string
    delay:number
}
export type Animation={
    resourceType:SourceType.Animation
    keys:Record<string,KeyFrame[]>
}
export interface Sound extends SoundDef{
    volume:number
    buffer:AudioBuffer
    resourceType:SourceType.Sound
}
export enum SourceType{
    Sprite,
    Animation,
    Sound,
    Model3D,
    GLMaterial
}
export type Source=Sprite|Animation|Sound|Model3D|GLMaterial
function getSvgUrl(svg:string) {
    return  URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
}
export class ResourcesManager{
    sources:Record<string,Source>
    canvas:HTMLCanvasElement
    ctx:CanvasRenderingContext2D
    audioCtx:AudioContext
    domp=new DOMParser()
    dome=new XMLSerializer()
    constructor(){ 
        this.sources={}
        this.canvas=document.createElement("canvas")
        this.ctx=this.canvas.getContext("2d")!
        this.audioCtx=new AudioContext()
    }
    get_sprite(id:string):Sprite{
        return this.sources[id] as Sprite
    }
    load_sprite(id:string,src:string):Promise<Sprite>{
        return new Promise<Sprite>((resolve, _reject) => {
            if(this.sources[id]){
                resolve(this.sources[id] as Sprite)
            }
            this.sources[id]=new Sprite(new Image());
            (this.sources[id] as Sprite).source.onload=()=>{resolve(this.sources[id] as Sprite)}
            (this.sources[id] as Sprite).source.src=src;
        })
    }
    load_svg(id:string,svg:SVGAElement,scale:number=1):Promise<Sprite>{
        return new Promise<Sprite>((resolve, _reject) => {
            if(this.sources[id]){
                resolve(this.sources[id] as Sprite)
            }
            svg.setAttribute("currentScale", scale.toString())
            const img=new Image()
            img.onload=()=>{
                this.canvas.width=img.naturalWidth
                this.canvas.height=img.naturalHeight
                this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
                this.ctx.drawImage(img, 0, 0)
                this.sources[id]=new Sprite(new Image());
                (this.sources[id] as Sprite).source.onload=()=>{resolve(this.sources[id] as Sprite)}
                (this.sources[id] as Sprite).source.src=this.canvas.toDataURL()
            }
            img.src=getSvgUrl(this.dome.serializeToString(svg))
        })
    }
    get_audio(id:string):Sound{
        return this.sources[id] as Sound
    }
    load_audio(id:string,def:SoundDef):Promise<SoundDef>{
        return new Promise<SoundDef>((resolve, reject) => {
            if (this.sources[id] != undefined) {
                resolve(this.sources[id] as Sound)
            }
    
            const xhr = new XMLHttpRequest();
            xhr.open("GET", def.src);
            xhr.responseType = "arraybuffer";
            const onfailure = function onfailure(_event:ProgressEvent<XMLHttpRequestEventTarget>) {
                reject(`Failed loading sound file: ${id}`)
            };
            xhr.addEventListener("load", (event) => {
                const arrayBuffer = xhr.response;
                if (!arrayBuffer) {
                    onfailure(event);
                    return;
                }
                this.audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
                    (this.sources[id] as Sound)={buffer:audioBuffer,...def,resourceType:SourceType.Sound};
                    resolve(this.sources[id] as Sound)
                }, () => {
                    reject(`Failed decoding sound: ${id}`);
                });
            });
            xhr.addEventListener("abort", onfailure);
            xhr.addEventListener("error", onfailure);
            xhr.addEventListener("timeout", onfailure);
            xhr.send();
        })
    }
    get_animation(id:string):Animation{
        return this.sources[id] as Animation
    }
    async load_animation(id:string,path:string):Promise<Animation>{
        const json=await(await fetch(path)).json()
        let anim!:Animation
        for(const k of Object.keys(json["keys"])){
            anim={resourceType:SourceType.Animation,keys:{}}
            anim.keys[k]=[]
            for(const f of json.keys){
                anim.keys[k].push({ease:ease[f.ease as (keyof typeof ease)],delay:f.delay,value:f.value,dest:f.dest})
            }
        }
        this.sources[id]=anim
        return this.sources[id] as Animation
    }
    load_model3D(id:string,path:string):Promise<Model3D>{
        return new Promise<Model3D>((resolve, reject) => {
            if (this.sources[id] != undefined) {
                resolve(this.sources[id] as Model3D)
            }
    
            fetch(path).then((v)=>{return v.text()}).then((v:string)=>{
                let model:Model3D=new Model3D()
                if(path.endsWith(".obj")){
                    model=m3.parseObj(v)
                }
                Object.defineProperty(model,"type",{
                    value:SourceType.Model3D,
                    writable:false
                })
                resolve(model)
            }).catch(()=>{
                reject(`Failed loading model file: ${id}`)
            })
        })
    }
    set_model3D(id:string,model:Model3D):void{
        this.sources[id]=model
    }
    get_model3D(id:string):Model3D{
        return this.sources[id] as Model3D
    }
    set_material(id:string,material:GLMaterial):void{
        this.sources[id]=material
    }
    get_material(id:string):GLMaterial{
        return this.sources[id] as GLMaterial
    }
    delete_source(id:string){
        delete this.sources[id]
    }
    unload(id:string){
        delete this.sources[id]
    }
}
export enum AudioState{
    finished,
    playing,
    succeeded,
    failed,
    inited,
    interrupt
}