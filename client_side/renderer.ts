import { Vector } from "../utils/geometry.ts"
import { CircleHitbox, RectHitbox } from "../utils/hitbox.ts"

export interface Color{
    r:number //Red
    b:number //Green
    g:number //Blue
    a:number //Alpha
}

export const RGBA = Object.freeze({
    /**
     * Create The Color RGBA, limit=`(0 To 255)`
     * @param r Red
     * @param g Green
     * @param b Blue
     * @param a Alpa
     * @returns A New Color
     */
    new(r:number,g:number,b:number,a:number=255):Color{
        return { r:r/255, g:g/255, b:b/255, a:a/255}
    }
})

export abstract class Renderer{
    canvas:HTMLCanvasElement
    meter_size:number
    constructor(canvas:HTMLCanvasElement,meter_size:number=100){
        this.canvas=canvas
        this.meter_size=meter_size
    }
    abstract draw_rect(rect:RectHitbox,color:Color):void
    abstract draw_circle(circle:CircleHitbox,color:Color):void
    abstract clear():void
}

const rectVertexShaderSource = `
attribute vec4 a_Position;
void main() {
    gl_Position = a_Position;
}`
const rectFragmentShaderSource = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 a_Color;

void main() {
    gl_FragColor = a_Color;
}`

export class WebglRenderer extends Renderer{
    gl:WebGLRenderingContext
    private simple_program:WebGLProgram
    background:Color=RGBA.new(255,255,255)
    constructor(canvas:HTMLCanvasElement,meter_size:number=100,background:Color=RGBA.new(255,255,255)){
        super(canvas,meter_size)
        const gl=this.canvas.getContext("webgl")
        this.background=background
        if(gl){
            gl.viewport(0, 0, this.canvas.width, this.canvas.height)
            this.gl=gl
            const simple_program=gl.createProgram()
            if (simple_program){
                gl.attachShader(simple_program,this.createShader(rectVertexShaderSource,gl.VERTEX_SHADER))
                gl.attachShader(simple_program,this.createShader(rectFragmentShaderSource,gl.FRAGMENT_SHADER))
                this.simple_program=simple_program
                gl.linkProgram(this.simple_program)
            }
            
        }
    }
    createShader(src:string, type:number):WebGLShader {
        const shader = this.gl.createShader(type);
        if(shader){
            this.gl.shaderSource(shader, src)
            this.gl.compileShader(shader)
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                throw Error(""+this.gl.getShaderInfoLog(shader))
            }
            return shader
        }
        throw Error("can't create shader")
    }
    _draw_vertices(vertices:number[],color:Color,mode:number=this.gl.TRIANGLES){
        // Criando um buffer de vértices
        const vertexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW)

        // Usando o programa WebGL
        this.gl.useProgram(this.simple_program)

        // Definindo o atributo a_position
        const positionAttributeLocation = this.gl.getAttribLocation(this.simple_program, "a_Position")
        this.gl.enableVertexAttribArray(positionAttributeLocation)
        this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)

        // Definindo a cor do retângulo
        const colorUniformLocation = this.gl.getUniformLocation(this.simple_program, "a_Color")
        this.gl.uniform4f(colorUniformLocation, color.r, color.g, color.b, color.a)

        // Desenhando o retângulo
        this.gl.drawArrays(mode, 0, vertices.length / 2)
    }
    draw_rect(rect: RectHitbox, color: Color) {
        const x1 = rect.position.x
        const y1 = -rect.position.y
        const x2 = (rect.position.x + rect.size.x)
        const y2 = -(rect.position.y + rect.size.y)

        this._draw_vertices([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2],color)
    }
    draw_circle(circle: CircleHitbox, color: Color,precision:number=50): void {
        const centerX = circle.position.x + circle.radius
        const centerY = -circle.position.y - circle.radius
    
        // Definindo a precisão do círculo
        const angleIncrement = (2 * Math.PI) / precision
    
        // Criando os vértices do círculo
        const vertices:number[] = []
        for (let i = 0; i < precision; i++) {
            const angle = angleIncrement * i
            const x = centerX + circle.radius * Math.cos(angle)
            const y = centerY + circle.radius * Math.sin(angle)
            vertices.push(x, y)
        }
        this._draw_vertices(vertices,color,this.gl.TRIANGLE_FAN)
    }
    override clear() {
        this.gl.clearColor(this.background.r,this.background.g,this.background.b,this.background.a)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }
}

export function createCanvas(size:Vector,pixelated:boolean=true,center:boolean=true):HTMLCanvasElement{
    const canvas=document.createElement("canvas")
    canvas.width=size.x
    canvas.height=size.y
    if(pixelated){
        canvas.style.imageRendering="pixelated"
        canvas.style.imageRendering="crisp-edges"
        canvas.style.imageRendering="-moz-crisp-edges"
    }
    if(center){
        canvas.style.position="absolute"
        canvas.style.left="0px"
        canvas.style.right="0px"
        canvas.style.top="0px"
        canvas.style.bottom="0px"
        canvas.style.margin="auto"
    }
    return canvas
}