import { createCanvas,Renderer,applyShadow, MousePosListener, KeyListener } from "KLSE/CLIENT"
import { Vec } from "KLSE"
import { Game, getGame } from "./game.ts"
import { server } from "./config.ts";
(async() => {
    const canvas=createCanvas(Vec.new(1000,600))
    
    applyShadow(canvas)

    document.body.appendChild(canvas)
    const renderer=new Renderer(canvas,100)

    const mouseML=new MousePosListener(renderer.meter_size)
    const KeyL=new KeyListener()
    mouseML.bind(canvas)
    KeyL.bind(document.body)

    const g=new Game(`ws${server.toString()}/${await getGame("http://localhost:8080")}`,KeyL,mouseML,renderer)
    g.mainloop()
})()