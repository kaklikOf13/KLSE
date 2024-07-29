import { createCanvas,applyShadow, MousePosListener, KeyListener, ResourcesManager,ClientGame3D, WebglRenderer } from "KLSE/CLIENT"
import { loadScene3D, v2, m3 } from "KLSE"
import { Player } from "./objects/player.ts"
import { Wall } from "./objects/wall.ts"
(async() => {
    const cs=v2.new(1000,600)
    const cand=1
    const canvas=createCanvas(v2.dscale(cs,cand),false)
    canvas.style.width=`${cs.x}px`
    canvas.style.height=`${cs.y}px`
    applyShadow(canvas)

    document.body.appendChild(canvas)
    const renderer=new WebglRenderer(canvas,50/cand)

    const mouseML=new MousePosListener(renderer.meter_size)
    const KeyL=new KeyListener()
    mouseML.bind(canvas,canvas)
    KeyL.bind(document.body)

    const resources=new ResourcesManager()
    resources.set_model3D("cube",m3.cube(1))
    const game=new ClientGame3D(KeyL,mouseML,renderer,resources,60,{
        "player":Player,
        "wall":Wall
    })
    game.scene=game.instantiate(await loadScene3D("/data/scenes/initial.scene"))
    game.mainloop()
})()