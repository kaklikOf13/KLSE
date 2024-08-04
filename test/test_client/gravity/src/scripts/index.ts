import { createCanvas,WebglRenderer,applyShadow, MousePosListener, KeyListener, ResourcesManager, FormGameObject2D, ClientGame2D, Color, RGBA } from "../../../../../client_side/mod"
import { HEXCOLOR } from "../../../../../client_side/renderer"
import { CircleHitbox2D, loadScene2D, NetStream, v2, Vec2 } from "../../../../../mod"
(async() => {
    const G=.00001
    class Body extends FormGameObject2D{
        objectType: string="body"
        mass!:number
        color: Color
        motion:Vec2
        create(args: Record<string, any>): void {
            this.mass=args["mass"]??1
            this.hb=new CircleHitbox2D(v2.new(0,0),args["radius"]??1)
            this.motion=args["motion"]??v2.new(0,0)
            this.color=args["color"]?HEXCOLOR.new(args["color"]):RGBA.new(0,0,0)
        }
        decodeComplete(_stream: NetStream): void {
            
        }
        encodeComplete(_stream: NetStream): void {
            
        }
        encodePart(_stream: NetStream): void {
            
        }
        decodePart(_stream: NetStream): void {
            
        }
        update(): void {
            for(const o of this.game.scene.objects.objects[this.category].orden){
                const obj=this.game.scene.objects.objects[this.category].objects[o] as Body
                const dist=v2.distance(obj.position,this.position)||1
                const f=G*(this.mass*obj.mass)/dist
                const ang=v2.dscale(v2.sub(this.position,obj.position),dist)
                this.motion=v2.sub(this.motion,v2.dscale(v2.scale(ang,f),this.mass))
            }
            this.position=v2.add(this.position,this.motion)
        }
    }
    const canvas=createCanvas(v2.new(1000,600))
    
    applyShadow(canvas)

    document.body.appendChild(canvas)
    const renderer=new WebglRenderer(canvas,10)
    const resources=new ResourcesManager
    const mouseML=new MousePosListener(renderer.meter_size)
    const KeyL=new KeyListener()
    mouseML.bind(canvas,canvas)
    KeyL.bind(document.body)

    const g=new ClientGame2D(KeyL,mouseML,resources,renderer,60,{
        "body":Body
    })
    const scene=g.instantiate(await loadScene2D("scenes/solar.scene"))
    g.scene=scene
    g.mainloop()
})()