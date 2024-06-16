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
attribute vec2 a_Position;
uniform mat4 u_ProjectionMatrix;

void main() {
    gl_Position = u_ProjectionMatrix * vec4(a_Position, 0.0, 1.0);
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
    private projectionMatrix: Float32Array
    constructor(canvas:HTMLCanvasElement,meter_size:number=100,background:Color=RGBA.new(255,255,255)){
        super(canvas,meter_size)
        const gl=this.canvas.getContext("webgl")
        this.background=background
        gl!.viewport(0, 0, this.canvas.width, this.canvas.height)
        this.gl=gl!
        const simple_program=gl!.createProgram()
        gl!.attachShader(simple_program!,this.createShader(rectVertexShaderSource,gl!.VERTEX_SHADER))
        gl!.attachShader(simple_program!,this.createShader(rectFragmentShaderSource,gl!.FRAGMENT_SHADER))
        this.simple_program=simple_program!
        gl!.linkProgram(this.simple_program)

        // Configurando a matriz de projeção para coordenadas de pixel
        const scaleX = 2 / (this.canvas.width / this.meter_size)
        const scaleY = 2 / (this.canvas.height / this.meter_size)
        this.projectionMatrix = new Float32Array([
            scaleX, 0, 0, 0,
            0, -scaleY, 0, 0,
            0, 0, 1, 0,
            -1, 1, 0, 1
        ])
    }
    createShader(src:string, type:number):WebGLShader {
        const shader = this.gl.createShader(type)
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
    _draw_vertices(vertices: number[], color: Color, mode: number = this.gl.TRIANGLES) {
        const vertexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW)
        this.gl.useProgram(this.simple_program)

        const positionAttributeLocation = this.gl.getAttribLocation(this.simple_program, "a_Position")
        this.gl.enableVertexAttribArray(positionAttributeLocation)
        this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)

        const colorUniformLocation = this.gl.getUniformLocation(this.simple_program, "a_Color")
        this.gl.uniform4f(colorUniformLocation, color.r, color.g, color.b, color.a)

        const projectionMatrixLocation = this.gl.getUniformLocation(this.simple_program, "u_ProjectionMatrix")
        this.gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix)

        this.gl.drawArrays(mode, 0, vertices.length / 2)
    }
    draw_rect(rect: RectHitbox, color: Color) {
        const x1 = rect.position.x
        const y1 = rect.position.y
        const x2 = (rect.position.x + rect.size.x)
        const y2 = (rect.position.y + rect.size.y)

        this._draw_vertices([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ], color)
    }
    draw_circle(circle: CircleHitbox, color: Color, precision: number = 50): void {
        const centerX = circle.position.x
        const centerY = circle.position.y
        const radius = circle.radius

        const angleIncrement = (2 * Math.PI) / precision

        const vertices: number[] = []
        vertices.push(centerX, centerY)
        for (let i = 0; i <= precision; i++) {
            const angle = angleIncrement * i
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            vertices.push(x, y)
        }
        this._draw_vertices(vertices, color, this.gl.TRIANGLE_FAN)
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

export function applyBorder(elem:HTMLElement){
    elem.style.border="1px solid #000"
}
export function applyShadow(elem:HTMLElement){
    elem.style.boxShadow="0px 4px 17px 0px rgba(0,0,0,0.19)"
    elem.style.webkitBoxShadow="0px 4px 17px 0px rgba(0,0,0,0.19)"
}