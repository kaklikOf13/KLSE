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
        const centerX = circle.position.x;
        const centerY = circle.position.y;
        const radius = circle.radius;
        const angleIncrement = 2 * Math.PI / precision;
        const vertices = [];
        vertices.push(centerX, centerY);
        for(let i = 0; i <= precision; i++){
            const angle = angleIncrement * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
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
const Collision = Object.freeze({
    circle_with_rect (hb1, hb2) {
        const cp = Vec.clamp2(hb1.position, hb2.position, Vec.add(hb2.position, hb2.size));
        const dist = Vec.distance(hb1.position, cp);
        return dist < hb1.radius * hb1.radius || hb1.position.x >= hb2.position.x && hb1.position.x <= hb2.position.x + hb2.size.x && hb1.position.x >= hb2.position.x && hb1.position.x <= hb2.position.x + hb2.size.x;
    },
    circle_with_rect_ov (hb1, hb2) {
        if (hb2.position.x <= hb1.position.x && hb1.position.x <= hb2.position.x + hb2.size.x && hb2.position.y <= hb1.position.y && hb1.position.y <= hb2.position.y + hb2.size.y) {
            const halfDim = Vec.dscale(Vec.sub(Vec.add(hb2.position, hb2.size), hb2.position), 2);
            const p = Vec.sub(hb1.position, Vec.add(hb2.position, halfDim));
            const p2 = Vec.sub(Vec.sub(Vec.absolute(p), halfDim), Vec.new(hb1.radius, hb1.radius));
            return p2.x > p2.y ? [
                Vec.new(p.x > 0 ? 1 : -1, 0),
                -p2.x
            ] : [
                Vec.new(0, p.y > 0 ? 1 : -1),
                -p2.y
            ];
        }
        const dir = Vec.sub(Vec.clamp2(hb1.position, hb2.position, Vec.add(hb2.position, hb2.size)), hb1.position);
        const dstSqr = Vec.squared(dir);
        if (dstSqr < hb1.radius * hb1.radius) {
            const dst = Math.sqrt(dstSqr);
            return [
                Vec.normalizeSafe(dir),
                hb1.radius - dst
            ];
        }
        return null;
    }
});
var HitboxType;
(function(HitboxType) {
    HitboxType[HitboxType["circle"] = 0] = "circle";
    HitboxType[HitboxType["rect"] = 1] = "rect";
    HitboxType[HitboxType["null"] = 2] = "null";
})(HitboxType || (HitboxType = {}));
class BaseHitbox {
    position;
    constructor(position){
        this.position = position;
    }
    is_null() {
        return false;
    }
}
class NullHitbox extends BaseHitbox {
    constructor(){
        super(NullVector);
    }
    type = HitboxType.null;
    collidingWith(_other) {
        return false;
    }
    pointInside(_point) {
        return false;
    }
    overlapCollision(_other) {
        return false;
    }
    center() {
        return NullVector;
    }
    scale(_scale) {}
    is_null() {
        return true;
    }
}
class CircleHitbox extends BaseHitbox {
    type = HitboxType.circle;
    radius;
    constructor(position, radius){
        super(position);
        this.radius = radius;
    }
    collidingWith(other) {
        switch(other.type){
            case HitboxType.circle:
                return Vec.distance(this.position, other.position) < this.radius + other.radius;
            case HitboxType.rect:
                return Collision.circle_with_rect(this, other);
        }
        return false;
    }
    overlapCollision(other) {
        if (other) {
            switch(other.type){
                case HitboxType.circle:
                    {
                        const r = this.radius + other.radius;
                        const dis = Vec.sub(this.position, other.position);
                        const dist = Vec.squared(dis);
                        if (dist < r * r) {
                            this.position = Vec.sub(this.position, Vec.scale(Vec.normalizeSafe(dis), r - Math.sqrt(dist)));
                            return true;
                        }
                        break;
                    }
                case HitboxType.rect:
                    {
                        const result = Collision.circle_with_rect_ov(this, other);
                        if (result) {
                            this.position = Vec.sub(this.position, Vec.scale(result[0], result[1]));
                            return true;
                        }
                        break;
                    }
            }
        }
        return false;
    }
    pointInside(point) {
        return Vec.distance(this.position, point) < this.radius;
    }
    center() {
        return this.position;
    }
    scale(scale) {
        this.radius *= scale;
    }
}
class RectHitbox extends BaseHitbox {
    type = HitboxType.rect;
    size;
    constructor(position, size){
        super(position);
        this.size = size;
    }
    collidingWith(other) {
        if (other) {
            switch(other.type){
                case HitboxType.rect:
                    return this.position.x + this.size.x > other.position.x && this.position.x < other.position.x + other.size.x && this.position.y + this.size.y > other.position.y && this.position.y < other.position.y + other.size.y;
                case HitboxType.circle:
                    return Collision.circle_with_rect(other, this);
            }
        }
        return false;
    }
    overlapCollision(other) {
        if (other) {
            switch(other.type){
                case HitboxType.rect:
                    {
                        const ss = Vec.dscale(Vec.add(this.position, other.position), 2);
                        const dist = Vec.sub(this.center(), other.center());
                        if (Vec.less(Vec.absolute(dist), ss)) {
                            const overlap = Vec.sub(ss, Vec.absolute(dist));
                            if (overlap.x < overlap.y) {
                                this.position.x = dist.x > 0 ? this.position.x + overlap.x : this.position.x - overlap.x;
                            } else {
                                this.position.y = dist.y > 0 ? this.position.y + overlap.y : this.position.y - overlap.y;
                            }
                            return true;
                        }
                        break;
                    }
                case HitboxType.circle:
                    {
                        const result = Collision.circle_with_rect_ov(other, this);
                        if (result) {
                            this.position = Vec.sub(this.position, Vec.scale(result[0], result[1]));
                            return true;
                        }
                        break;
                    }
            }
        }
        return false;
    }
    pointInside(point) {
        return this.position.x + this.size.x >= point.x && this.position.x <= point.x && this.position.y + this.size.y >= point.y && this.position.y <= point.y;
    }
    center() {
        return Vec.add(this.position, Vec.dscale(this.size, 2));
    }
    scale(scale) {
        this.size = Vec.scale(this.size, scale);
    }
}
var CATEGORYS;
(function(CATEGORYS) {
    CATEGORYS["PLAYERS"] = "players";
})(CATEGORYS || (CATEGORYS = {}));
var GenericEvents;
(function(GenericEvents) {
    GenericEvents["GameStart"] = "Game Start";
    GenericEvents["GameTick"] = "Game Tick";
})(GenericEvents || (GenericEvents = {}));
var Key;
(function(Key) {
    Key[Key["A"] = 0] = "A";
    Key[Key["B"] = 1] = "B";
    Key[Key["C"] = 2] = "C";
    Key[Key["D"] = 3] = "D";
    Key[Key["E"] = 4] = "E";
    Key[Key["F"] = 5] = "F";
    Key[Key["G"] = 6] = "G";
    Key[Key["H"] = 7] = "H";
    Key[Key["I"] = 8] = "I";
    Key[Key["J"] = 9] = "J";
    Key[Key["K"] = 10] = "K";
    Key[Key["L"] = 11] = "L";
    Key[Key["M"] = 12] = "M";
    Key[Key["N"] = 13] = "N";
    Key[Key["O"] = 14] = "O";
    Key[Key["P"] = 15] = "P";
    Key[Key["Q"] = 16] = "Q";
    Key[Key["R"] = 17] = "R";
    Key[Key["S"] = 18] = "S";
    Key[Key["T"] = 19] = "T";
    Key[Key["U"] = 20] = "U";
    Key[Key["V"] = 21] = "V";
    Key[Key["W"] = 22] = "W";
    Key[Key["X"] = 23] = "X";
    Key[Key["Y"] = 24] = "Y";
    Key[Key["Z"] = 25] = "Z";
    Key[Key["Number_0"] = 26] = "Number_0";
    Key[Key["Number_1"] = 27] = "Number_1";
    Key[Key["Number_2"] = 28] = "Number_2";
    Key[Key["Number_3"] = 29] = "Number_3";
    Key[Key["Number_4"] = 30] = "Number_4";
    Key[Key["Number_5"] = 31] = "Number_5";
    Key[Key["Number_6"] = 32] = "Number_6";
    Key[Key["Number_7"] = 33] = "Number_7";
    Key[Key["Number_8"] = 34] = "Number_8";
    Key[Key["Number_9"] = 35] = "Number_9";
    Key[Key["Enter"] = 36] = "Enter";
    Key[Key["Backspace"] = 37] = "Backspace";
    Key[Key["Space"] = 38] = "Space";
    Key[Key["Delete"] = 39] = "Delete";
    Key[Key["Tab"] = 40] = "Tab";
    Key[Key["LShift"] = 41] = "LShift";
    Key[Key["RShift"] = 42] = "RShift";
    Key[Key["LCtrl"] = 43] = "LCtrl";
    Key[Key["RCtrl"] = 44] = "RCtrl";
    Key[Key["LALT"] = 45] = "LALT";
    Key[Key["RALT"] = 46] = "RALT";
    Key[Key["Arrow_Up"] = 47] = "Arrow_Up";
    Key[Key["Arrow_Down"] = 48] = "Arrow_Down";
    Key[Key["Arrow_Left"] = 49] = "Arrow_Left";
    Key[Key["Arrow_Right"] = 50] = "Arrow_Right";
    Key[Key["Mouse_Left"] = 51] = "Mouse_Left";
    Key[Key["Mouse_Middle"] = 52] = "Mouse_Middle";
    Key[Key["Mouse_Right"] = 53] = "Mouse_Right";
    Key[Key["Mouse_Option1"] = 54] = "Mouse_Option1";
    Key[Key["Mouse_Option2"] = 55] = "Mouse_Option2";
})(Key || (Key = {}));
const JSKeys = {
    [Key.A]: 65,
    [Key.B]: 66,
    [Key.C]: 67,
    [Key.D]: 68,
    [Key.E]: 69,
    [Key.F]: 70,
    [Key.G]: 71,
    [Key.H]: 72,
    [Key.I]: 73,
    [Key.J]: 74,
    [Key.K]: 75,
    [Key.L]: 76,
    [Key.M]: 77,
    [Key.N]: 78,
    [Key.O]: 79,
    [Key.P]: 80,
    [Key.Q]: 81,
    [Key.R]: 82,
    [Key.S]: 83,
    [Key.T]: 84,
    [Key.U]: 85,
    [Key.V]: 86,
    [Key.W]: 87,
    [Key.X]: 88,
    [Key.Y]: 89,
    [Key.Z]: 100,
    [Key.Number_0]: 48,
    [Key.Number_1]: 49,
    [Key.Number_2]: 50,
    [Key.Number_3]: 51,
    [Key.Number_4]: 52,
    [Key.Number_5]: 53,
    [Key.Number_6]: 54,
    [Key.Number_7]: 55,
    [Key.Number_8]: 56,
    [Key.Number_9]: 57,
    [Key.Enter]: 13,
    [Key.Backspace]: 8,
    [Key.Space]: 32,
    [Key.Delete]: 46,
    [Key.Tab]: 9,
    [Key.LShift]: 16,
    [Key.RShift]: 16,
    [Key.LCtrl]: 17,
    [Key.RCtrl]: 17,
    [Key.LALT]: 18,
    [Key.RALT]: 18,
    [Key.Arrow_Up]: 38,
    [Key.Arrow_Down]: 40,
    [Key.Arrow_Left]: 37,
    [Key.Arrow_Right]: 39,
    [Key.Mouse_Left]: 300,
    [Key.Mouse_Middle]: 301,
    [Key.Mouse_Right]: 302,
    [Key.Mouse_Option1]: 303,
    [Key.Mouse_Option2]: 304
};
const KeyNames = {
    65: Key.A,
    66: Key.B,
    67: Key.C,
    68: Key.D,
    69: Key.E,
    70: Key.F,
    71: Key.G,
    72: Key.H,
    73: Key.I,
    74: Key.J,
    75: Key.K,
    76: Key.L,
    77: Key.M,
    78: Key.N,
    79: Key.O,
    80: Key.P,
    81: Key.Q,
    82: Key.R,
    83: Key.S,
    84: Key.T,
    85: Key.U,
    86: Key.V,
    87: Key.W,
    88: Key.X,
    89: Key.Y,
    100: Key.Z,
    48: Key.Number_0,
    49: Key.Number_1,
    50: Key.Number_2,
    51: Key.Number_3,
    52: Key.Number_4,
    53: Key.Number_5,
    54: Key.Number_6,
    55: Key.Number_7,
    56: Key.Number_8,
    57: Key.Number_9,
    13: Key.Enter,
    8: Key.Backspace,
    32: Key.Space,
    46: Key.Delete,
    9: Key.Tab,
    16: Key.LShift,
    17: Key.LCtrl,
    18: Key.LALT,
    38: Key.Arrow_Up,
    40: Key.Arrow_Down,
    37: Key.Arrow_Left,
    39: Key.Arrow_Right,
    301: Key.Mouse_Left,
    302: Key.Mouse_Middle,
    303: Key.Mouse_Right,
    304: Key.Mouse_Option1,
    305: Key.Mouse_Option2
};
var Events;
(function(Events) {
    Events["KeyDown"] = "keydown";
    Events["KeyUp"] = "keyup";
})(Events || (Events = {}));
class KeyListener {
    keys;
    keysdown;
    keysup;
    listener;
    constructor(){
        this.keys = [];
        this.keysdown = [];
        this.keysup = [];
        this.listener = new SignalManager();
    }
    bind(elem) {
        elem.addEventListener("keydown", (e)=>{
            this.keysdown.push(e.keyCode);
            this.keys.push(e.keyCode);
            this.listener.emit(Events.KeyDown, KeyNames[e.keyCode]);
        });
        elem.addEventListener("keyup", (e)=>{
            this.keys.splice(this.keys.indexOf(e.keyCode));
            this.keysup.push(e.keyCode);
            this.listener.emit(Events.KeyUp, KeyNames[e.keyCode]);
        });
        elem.addEventListener("mousedown", (e)=>{
            this.keysdown.push(e.button + 300);
            this.keys.push(e.button + 300);
            this.listener.emit(Events.KeyDown, KeyNames[e.button + 300]);
        });
        elem.addEventListener("mouseup", (e)=>{
            this.keys.splice(this.keys.indexOf(e.button + 300));
            this.keysup.push(e.button + 300);
            this.listener.emit(Events.KeyUp, KeyNames[e.button + 300]);
        });
    }
    tick() {
        this.keysdown = [];
        this.keysup = [];
    }
    keyPress(key) {
        return this.keys.includes(JSKeys[key]);
    }
    keyDown(key) {
        return this.keysdown.includes(JSKeys[key]);
    }
    keyUp(key) {
        return this.keysup.includes(JSKeys[key]);
    }
}
class MousePosListener {
    _position;
    meter_size;
    get position() {
        return Vec.scale(this._position, this.meter_size);
    }
    constructor(meter_size){
        this._position = Vec.new(0, 0);
        this.meter_size = meter_size;
    }
    bind(elem) {
        elem.addEventListener("mousemove", (e)=>{
            this._position = Vec.new(e.clientX, e.clientY);
        });
    }
}
export { Key as Key };
export { JSKeys as JSKeys };
export { KeyNames as KeyNames };
export { Events as Events };
export { KeyListener as KeyListener };
export { MousePosListener as MousePosListener };
class Server {
    IP;
    Port;
    HTTP;
    constructor(IP, Port, HTTP = false){
        this.IP = IP;
        this.Port = Port;
        this.HTTP = HTTP;
    }
    toString() {
        return `${this.HTTP ? "s" : ""}://${this.IP}:${this.Port}`;
    }
}
export { Server as Server };
export { Client as Client, ConnectPacket as ConnectPacket, DefaultSignals as DefaultSignals, DisconnectPacket as DisconnectPacket };
export { WebglRenderer as Renderer, RGBA as RGBA, createCanvas as createCanvas, applyBorder as applyBorder, applyShadow as applyShadow };
