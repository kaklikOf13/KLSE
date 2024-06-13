import { createCanvas,Renderer,RGBA } from "KLSE/CLIENT"
import { Vec } from "KLSE"
import { Game, getGame } from "./game.ts"
import { Server } from "./config.ts";
(async() => {
    const canvas=createCanvas(Vec.new(1000,500))
    document.body.appendChild(canvas)
    const renderer=new Renderer(canvas,0.01)

    const g=new Game(`ws${new Server("localhost",8080)}/${await getGame("http://localhost:8080")}`,renderer)
    function loop(){
        g.update()
        self.requestAnimationFrame(loop)
    }
    loop()
})()