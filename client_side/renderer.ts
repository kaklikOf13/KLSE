import { Vec2, Vec3 } from "../utils/geometry.ts"
import { CircleHitbox2D, Hitbox2D, HitboxType, RectHitbox2D, RectHitbox3D } from "../utils/hitbox.ts"
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
    }
});

export abstract class Renderer {
    canvas: HTMLCanvasElement
    meter_size: number
    constructor(canvas: HTMLCanvasElement, meter_size: number = 100) {
        this.canvas = canvas
        this.meter_size = meter_size
    }
    abstract draw_rect2D(rect: RectHitbox2D, color: Color): void
    abstract draw_circle2D(circle: CircleHitbox2D, color: Color): void
    abstract draw_hitbox2D(hitbox: Hitbox2D, color: Color): void
    abstract draw_image2D(image: Sprite, position: Vec2, size: Vec2): void

    abstract draw_iso_rect(rect: RectHitbox3D, color: Color): void
    abstract color_draw_iso_model(m:Model3D,position:Vec3,scale:Vec3,color:Color,wireframe?:boolean):void
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
uniform mat4 u_ProjectionMatrix;

void main() {
    vec3 scaledPosition = a_Position * u_Scale; // Aplica a escala
    vec3 translatedPosition = scaledPosition + u_Translation; // Adiciona a translação
    vec2 isoPosition = vec2(translatedPosition.x - translatedPosition.z, (translatedPosition.y + translatedPosition.z)+translatedPosition.x);
    gl_Position = u_ProjectionMatrix * vec4(isoPosition, 0.0, 1.0);
}
`;

export class WebglRenderer extends Renderer {
    gl: WebGLRenderingContext;
    private simple_program: WebGLProgram;
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
        gl!.attachShader(isometric_simple_program!, this.createShader(rectFragmentShaderSource, gl!.FRAGMENT_SHADER));
        this.isometric_simple_program = isometric_simple_program!;
        gl!.linkProgram(this.isometric_simple_program);

        // Configurando a matriz de projeção para coordenadas de pixel
        const scaleX = 2 / (this.canvas.width / this.meter_size);
        const scaleY = 2 / (this.canvas.height / this.meter_size);
        this.projectionMatrix = new Float32Array([
            scaleX, 0, 0, 0,
            0, -scaleY, 0, 0,
            0, 0, 1, 0,
            -1, 1, 0, 1
        ]);
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

    draw_rect2D(rect: RectHitbox2D, color: Color) {
        const x1 = rect.position.x;
        const y1 = rect.position.y;
        const x2 = rect.position.x + rect.size.x;
        const y2 = rect.position.y + rect.size.y;

        this._draw_vertices([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ], color);
    }

    draw_circle2D(circle: CircleHitbox2D, color: Color, precision: number = 50): void {
        const centerX = circle.position.x;
        const centerY = circle.position.y;
        const radius = circle.radius;

        const angleIncrement = (2 * Math.PI) / precision;

        const vertices: number[] = [];
        vertices.push(centerX, centerY);
        for (let i = 0; i <= precision; i++) {
            const angle = angleIncrement * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            vertices.push(x, y);
        }
        this._draw_vertices(vertices, color, this.gl.TRIANGLE_FAN);
    }

    draw_hitbox2D(hitbox: Hitbox2D, color: Color): void {
        switch (hitbox.type) {
            case HitboxType.circle:
                this.draw_circle2D(hitbox, color);
                break;
            case HitboxType.rect:
                this.draw_rect2D(hitbox, color);
                break;
            default:
                return;
        }
    }

    draw_image2D(image: Sprite, position: Vec2, size: Vec2): void {
        const x1 = position.x;
        const y1 = position.y;
        const x2 = position.x + size.x;
        const y2 = position.y + size.y;
    
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
    
    _iso_draw_vertices(vertices: number[], indices: number[],pos:Vec3,scale:Vec3, color: Color, wireframe: boolean = false, mode: number = this.gl.TRIANGLES) {
        const gl = this.gl;

        const vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
        
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

        gl.useProgram(this.isometric_simple_program)

        const positionAttributeLocation = gl.getAttribLocation(this.isometric_simple_program, "a_Position")
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        const colorUniformLocation = gl.getUniformLocation(this.isometric_simple_program, "a_Color");
        gl.uniform4f(colorUniformLocation, color.r, color.g, color.b, color.a);

        const projectionMatrixLocation = gl.getUniformLocation(this.isometric_simple_program, "u_ProjectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix);

        const translationLocation = gl.getUniformLocation(this.isometric_simple_program, "u_Translation");
        gl.uniform3f(translationLocation, pos.x, -pos.y, -pos.z)

        const scaleLocation = gl.getUniformLocation(this.isometric_simple_program, "u_Scale")
        gl.uniform3f(scaleLocation, scale.x, scale.y, scale.z)

        if (wireframe) {
            const wireframeIndices = [];
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
    draw_iso_rect(rect: RectHitbox3D, color: Color, wireframe: boolean = false){
        this._iso_draw_vertices([
            0, 0, 0, // 0
            1, 0, 0, // 1
            0, -1, 0, // 2
            1, -1, 0, // 3
            0, 0, 1, // 4
            1, 0, 1, // 5
            0, -1, 1, // 6
            1, -1, 1  // 7
        ],[
            0, 1, 2, 1, 3, 2,
            4, 5, 6, 5, 7, 6,
            0, 1, 4, 1, 5, 4,
            2, 3, 6, 3, 7, 6,
            0, 2, 4, 2, 6, 4,
            1, 3, 5, 3, 7, 5
        ],rect.position,rect.size, color, wireframe)
    }
    color_draw_iso_model(m:Model3D,position:Vec3,scale:Vec3,color:Color,wireframe:boolean=false){
        this._iso_draw_vertices(m._vertices,m._indices,position,scale,color,wireframe)
    }

    clear() {
        this.gl.clearColor(this.background.r, this.background.g, this.background.b, this.background.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}

export function createCanvas(size: Vec2, pixelated: boolean = true, center: boolean = true): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = size.x;
    canvas.height = size.y;
    if (pixelated) {
        canvas.style.imageRendering = "pixelated";
        canvas.style.imageRendering = "crisp-edges";
        canvas.style.imageRendering = "-moz-crisp-edges";
    }
    if (center) {
        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        canvas.style.right = "0px";
        canvas.style.top = "0px";
        canvas.style.bottom = "0px";
        canvas.style.margin = "auto";
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
