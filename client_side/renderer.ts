import { v3 } from "../mod.ts";
import { NullVec2, NullVec3, Vec2, Vec3 } from "../utils/geometry.ts"
import { CircleHitbox2D, Hitbox2D, HitboxType2D,HitboxType3D, RectHitbox2D, BoxHitbox3D } from "../utils/hitbox.ts"
import { Model3D } from "../utils/models.ts";
import { type Sprite } from "./resources.ts";

export interface Color {
    r: number; // Red
    g: number; // Green
    b: number; // Blue
    a: number; // Alpha
}

export const RGBA = Object.freeze({
    /**
     * Create The Color RGBA, limit=`(0 To 255)`
     * @param r Red
     * @param g Green
     * @param b Blue
     * @param a Alpha
     * @returns A New Color
     */
    new(r: number, g: number, b: number, a: number = 255): Color {
        return { r: r / 255, g: g / 255, b: b / 255, a: a / 255 };
    },
    from(json:RGBAT): Color{
        return {r:json.r/255,g:json.g/255,b:json.b/255,a:(json.a??255)/255}
    }
})
export const HEXCOLOR=Object.freeze({
    new(hex:string):Color{
        let result:RegExpExecArray|null
        switch(hex.length){
            case 4:
                result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex)
                if(!result){
                    throw new Error("Invalid Hex")
                }
                return {
                    r:parseInt(result[1], 16)/15,
                    g:parseInt(result[2], 16)/15,
                    b:parseInt(result[3], 16)/15,
                    a:1
                }
            case 5:
                result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex)
                if(!result){
                    throw new Error("Invalid Hex")
                }
                return {
                    r:parseInt(hex[1], 16)/15,
                    g:parseInt(hex[2], 16)/15,
                    b:parseInt(hex[3], 16)/15,
                    a:parseInt(hex[4], 16)/15
                }
                case 7:
                    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
                    if(!result){
                        throw new Error("Invalid Hex")
                    }
                    return {
                        r:parseInt(result[1], 16)/255,
                        g:parseInt(result[2], 16)/255,
                        b:parseInt(result[3], 16)/255,
                        a:1
                    }
                case 9:
                    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
                    if(!result){
                        throw new Error("Invalid Hex")
                    }
                    return {
                        r:parseInt(result[1], 16)/255,
                        g:parseInt(result[2], 16)/255,
                        b:parseInt(result[3], 16)/255,
                        a:parseInt(result[4], 16)/255
                    }
            default:
                throw new Error("Invalid Hex")
        }
      }
})
export type RGBAT={r: number, g: number, b: number, a?: number}

export abstract class Renderer {
    canvas: HTMLCanvasElement
    meter_size: number
    constructor(canvas: HTMLCanvasElement, meter_size: number = 100) {
        this.canvas = canvas
        this.meter_size = meter_size
    }
    abstract draw_rect2D(rect: RectHitbox2D, color: Color,offset?:Vec2): void
    abstract draw_circle2D(circle: CircleHitbox2D, color: Color,offset?:Vec2): void
    abstract draw_hitbox2D(hitbox: Hitbox2D, color: Color,offset?:Vec2): void
    abstract draw_image2D(image: Sprite, position: Vec2, size: Vec2,offset?:Vec2): void

    abstract draw_iso_rect(rect: BoxHitbox3D, color: Color): void
    abstract color_draw_iso_model(m:Model3D,position:Vec3,scale:Vec3,rot:Vec3,color:Color,wireframe?:boolean,simple_shadow?:boolean):void
    abstract clear(): void
}

const rectVertexShaderSource = `
attribute vec2 a_Position;
uniform mat4 u_ProjectionMatrix;

void main() {
    gl_Position = u_ProjectionMatrix * vec4(a_Position, 0.0, 1.0);
}`;

const rectFragmentShaderSource = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 a_Color;

void main() {
    gl_FragColor = a_Color;
}`;

const isoVertexShaderSource = `
attribute vec3 a_Position;
uniform vec3 u_Translation;
uniform vec3 u_Scale;
uniform vec3 u_Rotation;
uniform mat4 u_ProjectionMatrix;
varying highp float v_SH;
varying vec3 translatedPosition;

mat3 rotationMatrix(vec3 r) {
    vec3 radians = r * 3.14159265 / 180.0;
    mat3 rotX = mat3(
        1.0, 0.0, 0.0,
        0.0, cos(radians.x), -sin(radians.x),
        0.0, sin(radians.x), cos(radians.x)
    );
    
    mat3 rotY = mat3(
        cos(radians.y), 0.0, sin(radians.y),
        0.0, 1.0, 0.0,
        -sin(radians.y), 0.0, cos(radians.y)
    );
    
    mat3 rotZ = mat3(
        cos(radians.z), -sin(radians.z), 0.0,
        sin(radians.z), cos(radians.z), 0.0,
        0.0, 0.0, 1.0
    );

    return rotZ * rotY * rotX;
}
const float camRot=0.05;
const float camRot2=1.5;
void main() {
    translatedPosition = ((rotationMatrix(u_Rotation)*a_Position) * u_Scale) + u_Translation;
    vec2 isoP = vec2((translatedPosition.z*camRot+translatedPosition.x*camRot2), (translatedPosition.x*camRot-translatedPosition.z)-translatedPosition.y);
    v_SH=isoP.y;
    gl_Position = u_ProjectionMatrix * vec4(isoP, (translatedPosition.z/1000.0), 1.0);
}
`;
const isoSimpleFragShaderSource = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 a_Color;
varying vec3 translatedPosition;
void main() {
    float depth = translatedPosition.z;
    gl_FragColor = gl_FragColor = a_Color;
}
`;
const isoSimpleShadowFragShaderSource = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 a_Color;
varying float v_SH;
void main() {
    float shadowIntensity = smoothstep(0.0, 0.4, (v_SH/100.0));
    gl_FragColor = mix(a_Color, vec4(0, 0, 0, 1), 0.4-shadowIntensity);
}
`;

export class WebglRenderer extends Renderer {
    gl: WebGLRenderingContext;
    private simple_program: WebGLProgram;
    private isometric_simple_shadow_program: WebGLProgram
    private isometric_simple_program: WebGLProgram
    background: Color = RGBA.new(255, 255, 255);
    private projectionMatrix: Float32Array;
    
    constructor(canvas: HTMLCanvasElement, meter_size: number = 100, background: Color = RGBA.new(255, 255, 255)) {
        super(canvas, meter_size);
        const gl = this.canvas.getContext("webgl");
        this.background = background;
        gl!.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl = gl!;

        const simple_program = gl!.createProgram();
        gl!.attachShader(simple_program!, this.createShader(rectVertexShaderSource, gl!.VERTEX_SHADER));
        gl!.attachShader(simple_program!, this.createShader(rectFragmentShaderSource, gl!.FRAGMENT_SHADER));
        this.simple_program = simple_program!;
        gl!.linkProgram(this.simple_program);

        const isometric_simple_program = gl!.createProgram();
        gl!.attachShader(isometric_simple_program!, this.createShader(isoVertexShaderSource, gl!.VERTEX_SHADER));
        gl!.attachShader(isometric_simple_program!, this.createShader(isoSimpleFragShaderSource, gl!.FRAGMENT_SHADER));
        this.isometric_simple_program = isometric_simple_program!;
        gl!.linkProgram(this.isometric_simple_program);

        const isometric_simple_shadow_program = gl!.createProgram();
        gl!.attachShader(isometric_simple_shadow_program!, this.createShader(isoVertexShaderSource, gl!.VERTEX_SHADER));
        gl!.attachShader(isometric_simple_shadow_program!, this.createShader(isoSimpleShadowFragShaderSource, gl!.FRAGMENT_SHADER));
        this.isometric_simple_shadow_program = isometric_simple_shadow_program!;
        gl!.linkProgram(this.isometric_simple_shadow_program);

        // Configurando a matriz de projeção para coordenadas de pixel
        const scaleX = 2 / (this.canvas.width / this.meter_size);
        const scaleY = 2 / (this.canvas.height / this.meter_size);
        this.projectionMatrix = new Float32Array([
            scaleX, 0, 0, 0,
            0, -scaleY, 0, 0,
            0, 0, 1, 0,
            -1, 1, 0, 1
        ]);

        gl!.enable(gl!.DEPTH_TEST);
    }

    createShader(src: string, type: number): WebGLShader {
        const shader = this.gl.createShader(type);
        if (shader) {
            this.gl.shaderSource(shader, src);
            this.gl.compileShader(shader);
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                throw Error("" + this.gl.getShaderInfoLog(shader));
            }
            return shader;
        }
        throw Error("Can't create shader");
    }

    _draw_vertices(vertices: number[], color: Color, mode: number = this.gl.TRIANGLES) {
        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.gl.useProgram(this.simple_program);

        const positionAttributeLocation = this.gl.getAttribLocation(this.simple_program, "a_Position");
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);

        const colorUniformLocation = this.gl.getUniformLocation(this.simple_program, "a_Color");
        this.gl.uniform4f(colorUniformLocation, color.r, color.g, color.b, color.a);

        const projectionMatrixLocation = this.gl.getUniformLocation(this.simple_program, "u_ProjectionMatrix");
        this.gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix);

        this.gl.drawArrays(mode, 0, vertices.length / 2);
    }

    draw_rect2D(rect: RectHitbox2D, color: Color,offset:Vec2=NullVec2) {
        const x1 = rect.position.x-offset.x
        const y1 = rect.position.y-offset.y
        const x2 = (rect.position.x-offset.x) + rect.size.x
        const y2 = (rect.position.y-offset.y) + rect.size.y

        this._draw_vertices([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ], color);
    }

    draw_circle2D(circle: CircleHitbox2D, color: Color,offset:Vec2=NullVec2 , precision: number = 50): void {
        const centerX = circle.position.x-offset.x
        const centerY = circle.position.y-offset.y
        const radius = circle.radius

        const angleIncrement = (2 * Math.PI) / precision

        const vertices: number[] = []
        vertices.push(centerX, centerY);
        for (let i = 0; i <= precision; i++) {
            const angle = angleIncrement * i
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            vertices.push(x, y)
        }
        this._draw_vertices(vertices, color, this.gl.TRIANGLE_FAN)
    }

    draw_hitbox2D(hitbox: Hitbox2D, color: Color,offset:Vec2=NullVec2): void {
        switch (hitbox.type) {
            case HitboxType2D.circle:
                this.draw_circle2D(hitbox, color,offset)
                break;
            case HitboxType2D.rect:
                this.draw_rect2D(hitbox, color,offset)
                break;
            default:
                return;
        }
    }

    draw_image2D(image: Sprite, position: Vec2, size: Vec2,offset:Vec2=NullVec2): void {
        const x1 = position.x-offset.x
        const y1 = position.y-offset.y
        const x2 = (position.x-offset.x) + size.x
        const y2 = (position.y-offset.y) + size.y
    
        const vertices: number[] = [
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ];
    
        const textureCoordinates: number[] = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0
        ];
    
        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    
        const textureCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), this.gl.STATIC_DRAW);
    
        this.gl.useProgram(this.simple_program);
    
        const positionAttributeLocation = this.gl.getAttribLocation(this.simple_program, "a_Position");
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    
        const texCoordAttributeLocation = this.gl.getAttribLocation(this.simple_program, "a_TexCoord");
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
        this.gl.enableVertexAttribArray(texCoordAttributeLocation);
        this.gl.vertexAttribPointer(texCoordAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image.source);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    
        const colorUniformLocation = this.gl.getUniformLocation(this.simple_program, "u_Color");
        this.gl.uniform4f(colorUniformLocation, 1.0, 1.0, 1.0, 1.0);
    
        const projectionMatrixLocation = this.gl.getUniformLocation(this.simple_program, "u_ProjectionMatrix");
        this.gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix);
    
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length / 2);
    }
    
    _iso_draw_vertices_color(vertices: number[], indices: number[],pos:Vec3,scale:Vec3,rot:Vec3, color: Color, wireframe: boolean = false,simple_shadow:boolean=false, mode: number = this.gl.TRIANGLES) {
        const gl = this.gl;

        const vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
        
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

        let program:WebGLProgram=this.isometric_simple_program
        if(simple_shadow&&!wireframe){
            program=this.isometric_simple_shadow_program
        }
        gl.useProgram(program)

        const positionAttributeLocation = gl.getAttribLocation(program,"a_Position")
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        const colorUniformLocation = gl.getUniformLocation(program, "a_Color");
        gl.uniform4f(colorUniformLocation, color.r, color.g, color.b, color.a);

        const projectionMatrixLocation = gl.getUniformLocation(program, "u_ProjectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix);

        const translationLocation = gl.getUniformLocation(program, "u_Translation");
        gl.uniform3f(translationLocation, pos.x, pos.y, pos.z)

        const scaleLocation = gl.getUniformLocation(program, "u_Scale")
        gl.uniform3f(scaleLocation, scale.x, scale.y, scale.z)

        const rotLocation = gl.getUniformLocation(program, "u_Rotation")
        gl.uniform3f(rotLocation, rot.x, rot.y, rot.z)

        if (wireframe) {
            const wireframeIndices:number[] = [];
            for (let i = 0; i < indices.length; i += 3) {
                wireframeIndices.push(indices[i], indices[i + 1]);
                wireframeIndices.push(indices[i + 1], indices[i + 2]);
                wireframeIndices.push(indices[i + 2], indices[i]);
            }
            const wireframeIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireframeIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(wireframeIndices), gl.STATIC_DRAW);
            gl.drawElements(gl.LINES, wireframeIndices.length, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawElements(mode, indices.length, gl.UNSIGNED_SHORT, 0);
        }
    }
    draw_iso_rect(rect: BoxHitbox3D, color: Color, wireframe: boolean = false,simple_shadow:boolean=false){
        this._iso_draw_vertices_color([
            // Front face
             0, 0, 1,
             0, 0, 1,
            -1, 1, 1,
             0, 1, 1,
    
            // Back face
             0, 0, 0,
            -1, 0, 0,
            -1, 1, 0,
             0, 1, 0,
        ],[
            // Front face
            0, 1, 2, 0, 2, 3,
            // Back face
            4, 5, 6, 4, 6, 7,
            // Top face
            3, 2, 6, 3, 6, 7,
            // Bottom face
            0, 1, 5, 0, 5, 4,
            // Right face
            1, 2, 6, 1, 6, 5,
            // Left face
            0, 3, 7, 0, 7, 4
        ],rect.transform.position,v3.mult(rect.size,rect.transform.scale),NullVec3, color, wireframe,simple_shadow)
    }
    color_draw_iso_model(m:Model3D,position:Vec3,scale:Vec3,rot:Vec3,color:Color,wireframe:boolean=false,simple_shadow:boolean=true){
        this._iso_draw_vertices_color(m._vertices,m._indices,position,scale,rot,color,wireframe,simple_shadow)
    }

    clear() {
        this.gl.clearDepth(100.0);
        this.gl.depthFunc(this.gl.LEQUAL); // Teste de profundidade
        this.gl.clearColor(this.background.r, this.background.g, this.background.b, this.background.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}

export function createCanvas(size: Vec2, pixelated: boolean = true, center: boolean = true): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = size.x;
    canvas.height = size.y;
    if (pixelated) {
        canvas.style.imageRendering = "pixelated"
        canvas.style.imageRendering = "crisp-edges"
        canvas.style.imageRendering = "-moz-crisp-edges"
    }
    if (center) {
        canvas.style.position = "absolute"
        canvas.style.left = "0px"
        canvas.style.right = "0px"
        canvas.style.top = "0px"
        canvas.style.bottom = "0px"
        canvas.style.margin = "auto"
    }
    return canvas;
}

export function applyBorder(elem: HTMLElement) {
    elem.style.border = "1px solid #000";
}

export function applyShadow(elem: HTMLElement) {
    elem.style.boxShadow = "0px 4px 17px 0px rgba(0,0,0,0.19)";
    elem.style.webkitBoxShadow = "0px 4px 17px 0px rgba(0,0,0,0.19)";
}
