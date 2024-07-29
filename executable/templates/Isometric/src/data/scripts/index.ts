import { createCanvas,applyShadow, MousePosListener, KeyListener, ResourcesManager,ClientGame3D, WebglRenderer } from "KLSE/CLIENT"
import { loadScene3D, v2 } from "KLSE"
import { Player } from "./objects/player.ts";
import { Wall } from "./objects/wall.ts";
(async() => {
    const canvas=createCanvas(v2.new(1000,600))
    
    applyShadow(canvas)

    document.body.appendChild(canvas)
    const renderer=new WebglRenderer(canvas,50)

    const mouseML=new MousePosListener(renderer.meter_size)
    const KeyL=new KeyListener()
    mouseML.bind(canvas,canvas)
    KeyL.bind(document.body)

    const resources=new ResourcesManager()
    const game=new ClientGame3D(KeyL,mouseML,renderer,resources,30,{
        "player":Player,
        "wall":Wall
    })
    game.scene=game.instantiate(await loadScene3D("/data/scenes/initial.scene"))
    game.mainloop()
})()