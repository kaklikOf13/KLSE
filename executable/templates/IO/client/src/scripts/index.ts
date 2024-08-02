import { createCanvas,WebglRenderer,applyShadow, MousePosListener, KeyListener, ResourcesManager } from "KLSE/CLIENT"
import { v2 } from "KLSE"
import { Game, getGame } from "./game.ts"
import { server } from "./config.ts";
import { Player } from "./gameObjects/player.ts";
(async() => {
    const canvas=createCanvas(v2.new(1000,600))
    
    applyShadow(canvas)

    document.body.appendChild(canvas)
    const renderer=new WebglRenderer(canvas,100)
    const resources=new ResourcesManager
    const mouseML=new MousePosListener(renderer.meter_size)
    const KeyL=new KeyListener()
    mouseML.bind(canvas,canvas)
    KeyL.bind(document.body)

    const g=new Game(`ws${server.toString()}/${await getGame("http://localhost:8080")}`,KeyL,mouseML,renderer,resources,60,{
        "player":Player
    })
    g.connect("kaklik")
    g.mainloop()
})()