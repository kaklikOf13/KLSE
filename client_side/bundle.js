// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class SignalManager {
    listeners;
    constructor(){
        this.listeners = new Map();
    }
    on(signal, callback) {
        if (!this.listeners.has(signal)) {
            this.listeners.set(signal, []);
        }
        this.listeners.get(signal).push(callback);
    }
    off(signal, callback) {
        const signalListeners = this.listeners.get(signal);
        if (signalListeners) {
            const index = signalListeners.indexOf(callback);
            if (index !== -1) {
                signalListeners.splice(index, 1);
            }
        }
    }
    emit(signal, ...parameters) {
        const signalListeners = this.listeners.get(signal);
        if (signalListeners) {
            for (const listener of signalListeners){
                listener(...parameters);
            }
        }
    }
    clear(signal) {
        this.listeners.delete(signal);
    }
}
function float32ToUint32(value) {
    const floatView = new Float32Array(1);
    const intView = new Uint32Array(floatView.buffer);
    floatView[0] = value;
    return intView[0];
}
const prime1 = BigInt("2654435761");
const prime2 = BigInt("2246822519");
const Vec = Object.freeze({
    new (x, y) {
        return {
            x,
            y
        };
    },
    add (x, y) {
        return this.new(x.x + y.x, x.y + y.y);
    },
    sub (x, y) {
        return this.new(x.x - y.x, x.y - y.y);
    },
    mult (x, y) {
        return this.new(x.x * y.x, x.y * y.y);
    },
    div (x, y) {
        return this.new(x.x / y.x, x.y / y.y);
    },
    greater (x, y) {
        return x.x > y.x && x.y > y.y;
    },
    less (x, y) {
        return x.x < y.x && x.y < y.y;
    },
    scale (vector, scale) {
        return this.new(vector.x * scale, vector.y * scale);
    },
    dscale (vector, dscale) {
        return this.new(vector.x / dscale, vector.y / dscale);
    },
    min1 (vector, min) {
        return this.new(Math.max(vector.x, min), Math.max(vector.y, min));
    },
    min2 (x, y) {
        return this.new(Math.max(x.x, y.x), Math.max(x.y, y.y));
    },
    max1 (vector, max) {
        return this.new(Math.min(vector.x, max), Math.min(vector.y, max));
    },
    max2 (x, y) {
        return this.new(Math.min(x.x, y.x), Math.min(x.y, y.y));
    },
    clamp1 (vector, min, max) {
        return this.new(Math.max(Math.min(vector.x, max), min), Math.max(Math.min(vector.y, max), min));
    },
    clamp2 (vector, min, max) {
        return this.new(Math.max(Math.min(vector.x, max.x), min.x), Math.max(Math.min(vector.y, max.y), min.y));
    },
    lookTo (x, y) {
        return Math.atan2(x.y - y.y, x.x - y.x);
    },
    from_RadAngle (angle) {
        return this.new(Math.cos(angle), Math.sin(angle));
    },
    from_DegAngle (angle) {
        const a = Angle.deg2rad(angle);
        return this.new(Math.cos(a), Math.sin(a));
    },
    distance (x, y) {
        const dx = x.x - y.x;
        const dy = x.y - y.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    squared (vector) {
        return vector.x * vector.x + vector.y * vector.y;
    },
    length (vector) {
        return Math.sqrt(Vec.squared(vector));
    },
    absolute (vector) {
        return this.new(Math.abs(vector.x), Math.abs(vector.y));
    },
    floor (vector) {
        return this.new(Math.floor(vector.x), Math.floor(vector.y));
    },
    lerp (current, end, interpolation) {
        return Vec.add(Vec.scale(current, 1 - interpolation), Vec.scale(end, interpolation));
    },
    normalizeSafe (vector, fallback = NullVector) {
        fallback ??= this.new(1.0, 0.0);
        const len = Vec.length(vector);
        return len > 0.000001 ? {
            x: vector.x / len,
            y: vector.y / len
        } : Vec.duplicate(fallback);
    },
    normalize (vector) {
        const len = Vec.length(vector);
        return 0.000001 ? {
            x: vector.x / len,
            y: vector.y / len
        } : Vec.duplicate(vector);
    },
    duplicate (vector) {
        return this.new(vector.x, vector.y);
    },
    hash (vector) {
        let hash = BigInt(float32ToUint32(vector.x));
        hash = hash * prime1 & BigInt("4294967295");
        hash ^= BigInt(float32ToUint32(vector.y));
        hash = hash * prime2 & BigInt("4294967295");
        return hash;
    },
    toString (vector) {
        return `{${vector.x},${vector.y}}`;
    }
});
const NullVector = Vec.new(0, 0);
const Angle = Object.freeze({
    deg2rad (angle) {
        return angle * Math.PI / 180;
    },
    rad2deg (angle) {
        return angle * 180 / Math.PI;
    }
});
class NetStream {
    buffer;
    pos;
    encoder = new TextEncoder;
    decoder = new TextDecoder;
    constructor(buffer = null){
        if (buffer instanceof Uint8Array) {
            this.buffer = buffer;
        } else {
            this.buffer = new Uint8Array();
        }
        this.pos = 0;
    }
    insert(val) {
        this.buffer = Uint8Array.from([
            ...this.buffer,
            ...val
        ]);
        this.pos = this.buffer.length;
    }
    walk(val) {
        this.pos += val;
        if (this.pos > this.buffer.length) {
            this.pos = this.buffer.length;
        }
    }
    goto(val) {
        this.pos = val;
        if (this.pos > this.buffer.length) {
            this.pos = this.buffer.length;
        }
    }
    clear() {
        this.buffer = new Uint8Array;
    }
    writeString(string) {
        this.writeUInt16(string.length);
        this.insert(this.encoder.encode(string));
    }
    writeUInt8(val) {
        this.insert(new Uint8Array([
            val
        ]));
    }
    writeInt8(val) {
        const buf = new Uint8Array(1);
        buf[0] = val & 0xFF;
        this.insert(buf);
    }
    writeUInt16(val) {
        const buf = new Uint8Array(2);
        buf[0] = (val & 0xFF00) >> 8;
        buf[1] = val & 0xFF;
        this.insert(buf);
    }
    writeInt16(val) {
        const buf = new Uint8Array(2);
        buf[0] = val >> 8 & 0xFF;
        buf[1] = val & 0xFF;
        this.insert(buf);
    }
    writeUInt32(val) {
        const buf = new Uint8Array(4);
        buf[0] = (val & 0xFF000000) >>> 24;
        buf[1] = (val & 0x00FF0000) >>> 16;
        buf[2] = (val & 0x0000FF00) >>> 8;
        buf[3] = val & 0x000000FF;
        this.insert(buf);
    }
    writeInt32(val) {
        const buf = new Uint8Array(4);
        buf[0] = val >> 24 & 0xFF;
        buf[1] = val >> 16 & 0xFF;
        buf[2] = val >> 8 & 0xFF;
        buf[3] = val & 0xFF;
        this.insert(buf);
    }
    writeFloat32(val) {
        const buf = new Uint8Array(4);
        new DataView(buf.buffer).setFloat32(0, val, true);
        this.insert(buf);
    }
    writeFloat64(val) {
        const buf = new Uint8Array(8);
        new DataView(buf.buffer).setFloat64(0, val, true);
        this.insert(buf);
    }
    writeArray(array, encodeFunc) {
        this.writeUInt32(array.length);
        for (const item of array){
            encodeFunc(item);
        }
    }
    readString() {
        const size = this.readUInt16();
        const val = this.buffer.subarray(this.pos, this.pos + size);
        this.walk(size);
        return this.decoder.decode(val);
    }
    readUInt8() {
        const val = this.buffer[this.pos];
        this.walk(1);
        return val;
    }
    readInt8() {
        const val = this.readUInt8();
        return val & 0x80 ? val - 0x100 : val;
    }
    readUInt16() {
        const val = this.buffer[this.pos] << 8 | this.buffer[this.pos + 1];
        this.walk(2);
        return val;
    }
    readInt16() {
        const val = this.readUInt16();
        return val & 0x8000 ? val - 0x10000 : val;
    }
    readUInt32() {
        const val = this.buffer[this.pos] << 24 | this.buffer[this.pos + 1] << 16 | this.buffer[this.pos + 2] << 8 | this.buffer[this.pos + 3];
        this.walk(4);
        return val;
    }
    readInt32() {
        const val = this.readUInt32();
        return val & 0x80000000 ? val - 0x100000000 : val;
    }
    readUInt64() {
        const low = this.readUInt32();
        const high = this.readUInt32();
        return high * 0x100000000 + low;
    }
    readInt64() {
        const low = this.readInt32();
        const high = this.readInt32();
        return high * 0x100000000 + low;
    }
    readFloat32() {
        const val = new DataView(this.buffer.buffer, this.pos).getFloat32(0, true);
        this.walk(4);
        return val;
    }
    readFloat64() {
        const val = new DataView(this.buffer.buffer, this.pos).getFloat64(0, true);
        this.walk(8);
        return val;
    }
    readArray(decodeFunc) {
        const length = this.readUInt32();
        const array = [];
        for(let i = 0; i < length; i++){
            const item = decodeFunc();
            array.push(item);
        }
        return array;
    }
    writeVector(vec) {
        this.writeFloat32(vec.x);
        this.writeFloat32(vec.y);
    }
    readVector() {
        return Vec.new(this.readFloat32(), this.readFloat32());
    }
    writeID(id) {
        this.writeUInt32(id);
    }
    readID() {
        return this.readUInt32();
    }
}
class Packet {
    _size = 0;
    toString() {
        return `{ID:${this.ID}}`;
    }
}
class ConnectPacket extends Packet {
    client_id;
    ID = 65535;
    Name = "connect";
    constructor(id = 0){
        super();
        this.client_id = id;
    }
    encode(stream) {
        stream.writeID(this.client_id);
    }
    decode(stream) {
        this.client_id = stream.readID();
    }
}
class DisconnectPacket extends Packet {
    client_id;
    ID = 65534;
    Name = "disconnect";
    constructor(id = 0){
        super();
        this.client_id = id;
    }
    encode(stream) {
        stream.writeID(this.client_id);
    }
    decode(stream) {
        this.client_id = stream.readID();
    }
}
const DefaultSignals = {
    CONNECT: "connect",
    DISCONNECT: "disconnect"
};
class Client {
    ws;
    manager;
    opened;
    ID = 0;
    IP;
    signals;
    constructor(websocket, packet_manager, ip = ""){
        this.ws = websocket;
        this.opened = false;
        this.signals = new SignalManager;
        this.manager = packet_manager;
        this.ws.onopen = ()=>{
            this.opened = true;
        };
        this.ws.onclose = ()=>{
            this.opened = false;
            this.signals.emit(DefaultSignals.DISCONNECT, new DisconnectPacket(this.ID));
        };
        this.ws.onmessage = async (msg)=>{
            if (msg.data instanceof ArrayBuffer) {
                const packet = this.manager.decode(new NetStream(new Uint8Array(msg.data)));
                this.signals.emit(packet.Name, packet);
            } else if (msg.data instanceof Blob) {
                const packet = this.manager.decode(new NetStream(new Uint8Array(await msg.data.arrayBuffer())));
                this.signals.emit(packet.Name, packet);
            }
        };
        this.IP = ip;
        if (ip == "") {
            this.on(DefaultSignals.CONNECT, (packet)=>{
                this.ID = packet.client_id;
            });
        }
    }
    emit(packet) {
        this.ws.send(this.manager.encode(packet).buffer);
    }
    on(name, callback) {
        this.signals.on(name, callback);
    }
    disconnect() {
        this.ws.close();
    }
}
const RGBA = Object.freeze({
    new (r, g, b, a = 255) {
        return {
            r: r / 255,
            g: g / 255,
            b: b / 255,
            a: a / 255
        };
    }
});
class Renderer {
    canvas;
    meter_size;
    constructor(canvas, meter_size = 100){
        this.canvas = canvas;
        this.meter_size = meter_size;
    }
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
class WebglRenderer extends Renderer {
    gl;
    simple_program;
    background = RGBA.new(255, 255, 255);
    projectionMatrix;
    constructor(canvas, meter_size = 100, background = RGBA.new(255, 255, 255)){
        super(canvas, meter_size);
        const gl = this.canvas.getContext("webgl");
        this.background = background;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl = gl;
        const simple_program = gl.createProgram();
        gl.attachShader(simple_program, this.createShader(rectVertexShaderSource, gl.VERTEX_SHADER));
        gl.attachShader(simple_program, this.createShader(rectFragmentShaderSource, gl.FRAGMENT_SHADER));
        this.simple_program = simple_program;
        gl.linkProgram(this.simple_program);
        const scaleX = 2 / (this.canvas.width / this.meter_size);
        const scaleY = 2 / (this.canvas.height / this.meter_size);
        this.projectionMatrix = new Float32Array([
            scaleX,
            0,
            0,
            0,
            0,
            -scaleY,
            0,
            0,
            0,
            0,
            1,
            0,
            -1,
            1,
            0,
            1
        ]);
    }
    createShader(src, type) {
        const shader = this.gl.createShader(type);
        if (shader) {
            this.gl.shaderSource(shader, src);
            this.gl.compileShader(shader);
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                throw Error("" + this.gl.getShaderInfoLog(shader));
            }
            return shader;
        }
        throw Error("can't create shader");
    }
    _draw_vertices(vertices, color, mode = this.gl.TRIANGLES) {
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
    draw_rect(rect, color) {
        const x1 = rect.position.x;
        const y1 = rect.position.y;
        const x2 = rect.position.x + rect.size.x;
        const y2 = rect.position.y + rect.size.y;
        this._draw_vertices([
            x1,
            y1,
            x2,
            y1,
            x1,
            y2,
            x1,
            y2,
            x2,
            y1,
            x2,
            y2
        ], color);
    }
    draw_circle(circle, color, precision = 50) {
        const centerX = circle.position.x + circle.radius;
        const centerY = -circle.position.y - circle.radius;
        const angleIncrement = 2 * Math.PI / precision;
        const vertices = [];
        for(let i = 0; i < precision; i++){
            const angle = angleIncrement * i;
            const x = centerX + circle.radius * Math.cos(angle);
            const y = centerY + circle.radius * Math.sin(angle);
            vertices.push(x, y);
        }
        this._draw_vertices(vertices, color, this.gl.TRIANGLE_FAN);
    }
    clear() {
        this.gl.clearColor(this.background.r, this.background.g, this.background.b, this.background.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}
function createCanvas(size, pixelated = true, center = true) {
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
function applyBorder(elem) {
    elem.style.border = "1px solid #000";
}
function applyShadow(elem) {
    elem.style.boxShadow = "0px 4px 17px 0px rgba(0,0,0,0.19)";
    elem.style.webkitBoxShadow = "0px 4px 17px 0px rgba(0,0,0,0.19)";
}
export { Client as Client, ConnectPacket as ConnectPacket, DefaultSignals as DefaultSignals, DisconnectPacket as DisconnectPacket };
export { WebglRenderer as Renderer, RGBA as RGBA, createCanvas as createCanvas, applyBorder as applyBorder, applyShadow as applyShadow };
