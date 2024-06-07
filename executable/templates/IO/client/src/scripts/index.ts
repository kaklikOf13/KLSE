import { createCanvas,Renderer,RGBA } from "KLSE/CLIENT"
import { Vec } from "KLSE"
import { Game, getGame } from "./game.ts"
(async() => {
    const canvas=createCanvas(Vec.new(1000,500))
    document.body.appendChild(canvas)
    const renderer=new Renderer(canvas)

    console.log(await getGame("http://localhost:8080"))
    const g=new Game(new WebSocket(await getGame("http://localhost:8080")),renderer,10,10)
    function loop(){
        g.update()
        window.requestAnimationFrame(loop)
    }
    loop()
})()