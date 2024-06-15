import { createCanvas,Renderer,applyShadow } from "KLSE/CLIENT"
import { Vec } from "KLSE"
import { Game, getGame } from "./game.ts"
import { Server } from "./config.ts";
(async() => {
    const canvas=createCanvas(Vec.new(1000,600))
    
    applyShadow(canvas)

    document.body.appendChild(canvas)
    const renderer=new Renderer(canvas,100)

    const g=new Game(`ws${new Server("localhost",8080)}/${await getGame("http://localhost:8080")}`,renderer)
    function loop(){
        g.update()
        self.requestAnimationFrame(loop)
    }
    loop()
})()