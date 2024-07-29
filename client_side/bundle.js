// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const halfpi = Math.PI / 2;
function splitPath(path) {
    const ret = path.split(/[\\/]/);
    for(let i = 0; i < ret.length; i++){
        if (ret[i] == "") {
            ret.splice(i, 1);
            i--;
        }
    }
    if (ret.length == 0) {
        ret.push("");
    }
    return ret;
}
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
    clearAll() {
        this.listeners.clear();
    }
}
class Clock {
    frameDuration;
    lastFrameTime;
    timeScale;
    constructor(targetFPS, timeScale){
        this.frameDuration = 1000 / targetFPS;
        this.lastFrameTime = Date.now();
        this.timeScale = timeScale;
    }
    tick(callback) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.lastFrameTime;
        const next_frame = this.frameDuration - elapsedTime;
        setTimeout(()=>{
            this.lastFrameTime = currentTime;
            callback();
            return 0;
        }, next_frame);
    }
}
Symbol("clone");
const cloneDeepSymbol = Symbol("clone deep");
function cloneDeep(object) {
    const clonedNodes = new Map();
    return function internal(target) {
        if (typeof target !== "object" && !Array.isArray(target)) return target;
        if (clonedNodes.has(target)) return clonedNodes.get(target);
        if (cloneDeepSymbol in target) {
            const clone = target[cloneDeepSymbol];
            if (typeof clone === "function" && clone.length === 0) {
                return clone.call(target);
            } else {
                console.warn(`Inappropriate use of ${cloneDeepSymbol.toString()}: it should be a no-arg function`);
            }
        }
        const copyAllPropDescs = (to, entryFilter = ()=>true)=>{
            for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(target)).filter(entryFilter)){
                desc.value = internal(target[key]);
                Object.defineProperty(to, key, desc);
            }
            return to;
        };
        const prototype = Object.getPrototypeOf(target);
        switch(true){
            case target instanceof Array:
                {
                    const root = Object.create(prototype);
                    clonedNodes.set(target, root);
                    for(let i = 0, l = target.length; i < l; i++){
                        root[i] = internal(target[i]);
                    }
                    return copyAllPropDescs(root, ([key])=>Number.isNaN(+key));
                }
            case target instanceof Map:
                {
                    const root = new Map();
                    clonedNodes.set(target, root);
                    for (const [k, v] of target.entries()){
                        root.set(internal(k), internal(v));
                    }
                    Object.setPrototypeOf(root, prototype);
                    return copyAllPropDescs(root);
                }
            case target instanceof Set:
                {
                    const root = new Set();
                    clonedNodes.set(target, root);
                    for (const v of target)root.add(internal(v));
                    Object.setPrototypeOf(root, prototype);
                    return copyAllPropDescs(root);
                }
            default:
                {
                    const clone = Object.create(prototype);
                    clonedNodes.set(target, clone);
                    return copyAllPropDescs(clone);
                }
        }
    }(object);
}
function generatePolynomialEasingTriplet(degree, type) {
    const coeffCache = 2 ** (degree - 1);
    return Object.freeze({
        [`${type}In`]: (t)=>t ** degree,
        [`${type}Out`]: (t)=>1 - (1 - t) ** degree,
        [`${type}InOut`]: (t)=>t < 0.5 ? coeffCache * t ** degree : 1 - coeffCache * (1 - t) ** degree
    });
}
const ease = Object.freeze({
    linear: (t)=>t,
    sineIn: (t)=>1 - Math.cos(t * halfpi),
    sineOut: (t)=>Math.sin(t * halfpi),
    sineInOut: (t)=>(1 - Math.cos(Math.PI * t)) / 2,
    circIn: (t)=>1 - Math.sqrt(1 - t * t),
    circOut: (t)=>Math.sqrt(1 - (t - 1) ** 2),
    circInOut: (t)=>t < 0.5 ? (1 - Math.sqrt(1 - (2 * t) ** 2)) / 2 : (Math.sqrt(1 - (-2 * (1 - t)) ** 2) + 1) / 2,
    elasticIn: (t)=>t === 0 || t === 1 ? t : -(2 ** (10 * (t - 1))) * Math.sin(Math.PI * (40 * (t - 1) - 3) / 6),
    elasticOut: (t)=>t === 0 || t === 1 ? t : 2 ** (-10 * t) * Math.sin(Math.PI * (40 * t - 3) / 6) + 1,
    elasticInOut: (t)=>t === 0 || t === 1 ? t : t < 0.5 ? -(2 ** (10 * (2 * t - 1) - 1)) * Math.sin(Math.PI * (80 * (2 * t - 1) - 9) / 18) : 2 ** (-10 * (2 * t - 1) - 1) * Math.sin(Math.PI * (80 * (2 * t - 1) - 9) / 18) + 1,
    elasticOut2: (t)=>Math.pow(2, t * -10) * Math.sin((t - 0.75 / 4) * (Math.PI * 2) / 0.75) + 1,
    ...generatePolynomialEasingTriplet(2, "quadratic"),
    ...generatePolynomialEasingTriplet(3, "cubic"),
    ...generatePolynomialEasingTriplet(4, "quartic"),
    ...generatePolynomialEasingTriplet(5, "quintic"),
    ...generatePolynomialEasingTriplet(6, "sextic"),
    expoIn: (t)=>t <= 0 ? 0 : 2 ** (-10 * (1 - t)),
    expoOut: (t)=>t >= 1 ? 1 : 1 - 2 ** -(10 * t),
    expoInOut: (t)=>t === 0 || t === 1 ? t : t < 0.5 ? 2 ** (10 * (2 * t - 1) - 1) : 1 - 2 ** (-10 * (2 * t - 1) - 1),
    backIn: (t)=>(Math.sqrt(3) * (t - 1) + t) * t ** 2,
    backOut: (t)=>1 + ((Math.sqrt(3) + 1) * t - 1) * (t - 1) ** 2,
    backInOut: (t)=>t < 0.5 ? 4 * t * t * (3.6 * t - 1.3) : 4 * (t - 1) ** 2 * (3.6 * t - 2.3) + 1
});
const random = Object.freeze({
    int (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    float (min, max) {
        return Math.random() * (max - min) + min;
    },
    choose (val) {
        return val[Math.floor(Math.random() * val.length)];
    },
    id () {
        return Math.floor(Math.random() * 4294967296);
    }
});
function float32ToUint32(value) {
    const floatView = new Float32Array(1);
    const intView = new Uint32Array(floatView.buffer);
    floatView[0] = value;
    return intView[0];
}
const prime1 = BigInt("2654435761");
const prime2 = BigInt("2246822519");
const v3 = Object.freeze({
    new (x, y, z) {
        return {
            x,
            y,
            z
        };
    },
    random (min, max) {
        return {
            x: random.float(min, max),
            y: random.float(min, max),
            z: random.float(min, max)
        };
    },
    random3 (min, max) {
        return {
            x: random.float(min.x, max.x),
            y: random.float(min.y, max.y),
            z: random.float(min.z, max.z)
        };
    },
    add (x, y) {
        return this.new(x.x + y.x, x.y + y.y, x.z + y.z);
    },
    sub (x, y) {
        return this.new(x.x - y.x, x.y - y.y, x.z - y.z);
    },
    mult (x, y) {
        return this.new(x.x * y.x, x.y * y.y, x.z * y.z);
    },
    div (x, y) {
        return this.new(x.x / y.x, x.y / y.y, x.z / y.z);
    },
    scale (x, y) {
        return this.new(x.x * y, x.y * y, x.z * y);
    },
    dscale (x, y) {
        return this.new(x.x / y, x.y / y, x.z / y);
    },
    greater (x, y) {
        return x.x > y.x && x.y > y.y && x.z > y.z;
    },
    less (x, y) {
        return x.x < y.x && x.y < y.y && x.z < y.z;
    },
    is (x, y) {
        return x.x == y.x && x.y == y.y && x.z == y.z;
    },
    greaterOr (x, y) {
        return x.x > y.x || x.y > y.y || x.z > y.z;
    },
    lessOr (x, y) {
        return x.x < y.x && x.y < y.y && x.z < y.z;
    },
    isOr (x, y) {
        return x.x == y.x && x.y == y.y && x.z == y.z;
    },
    absolute (Vec3) {
        return this.new(Math.abs(Vec3.x), Math.abs(Vec3.y), Math.abs(Vec3.z));
    },
    maxDecimal (vec, decimalPlaces = 3) {
        const factor = Math.pow(10, decimalPlaces);
        return this.new(Math.round(vec.x * factor) / factor, Math.round(vec.y * factor) / factor, Math.round(vec.z * factor) / factor);
    },
    round (vec) {
        return this.new(Math.round(vec.x), Math.round(vec.y), Math.round(vec.z));
    },
    min1 (vec, min) {
        return this.new(Math.max(vec.x, min), Math.max(vec.y, min), Math.max(vec.z, min));
    },
    min3 (x, y) {
        return this.new(Math.max(x.x, y.x), Math.max(x.y, y.y), Math.max(x.z, y.z));
    },
    max1 (vec, max) {
        return this.new(Math.min(vec.x, max), Math.min(vec.y, max), Math.min(vec.z, max));
    },
    max3 (x, y) {
        return this.new(Math.min(x.x, y.x), Math.min(x.y, y.y), Math.min(x.z, y.z));
    },
    clamp1 (vec, min, max) {
        return this.new(Math.max(Math.min(vec.x, max), min), Math.max(Math.min(vec.y, max), min), Math.max(Math.min(vec.z, max), min));
    },
    clamp3 (vec, min, max) {
        return this.new(Math.max(Math.min(vec.x, max.x), min.x), Math.max(Math.min(vec.y, max.y), min.y), Math.max(Math.min(vec.z, max.z), min.z));
    },
    lerp (current, end, interpolation) {
        return this.add(this.scale(current, 1 - interpolation), this.scale(end, interpolation));
    },
    normalizeSafe (Vec3, fallback = NullVec3) {
        const len = this.length(Vec3);
        return len > 0.000001 ? {
            x: Vec3.x / len,
            y: Vec3.y / len,
            z: Vec3.z / len
        } : this.duplicate(fallback);
    },
    normalize (Vec3) {
        const len = this.length(Vec3);
        return 0.000001 ? {
            x: Vec3.x / len,
            y: Vec3.y / len,
            z: Vec3.z / len
        } : this.duplicate(Vec3);
    },
    duplicate (Vec3) {
        return this.new(Vec3.x, Vec3.y, Vec3.z);
    },
    neg (Vec3) {
        return this.new(-Vec3.x, -Vec3.y, -Vec3.z);
    },
    squared (vec) {
        return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z;
    },
    distanceSquared (x, y) {
        const dx = x.x - y.x;
        const dy = x.y - y.y;
        const dz = x.z - y.z;
        return dx * dx + dy * dy + dz * dz;
    },
    distance (x, y) {
        const dx = x.x - y.x;
        const dy = x.y - y.y;
        const dz = x.z - y.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },
    cross (vec, other) {
        return v3.new(vec.y * other.z - vec.z * other.y, vec.z * other.x - vec.x * other.z, vec.x * other.y - vec.y * other.x);
    },
    floor (Vec2) {
        return this.new(Math.floor(Vec2.x), Math.floor(Vec2.y), Math.floor(Vec2.z));
    },
    ceil (Vec2) {
        return this.new(Math.ceil(Vec2.x), Math.ceil(Vec2.y), Math.ceil(Vec2.z));
    },
    length (Vec3) {
        return Math.sqrt(this.squared(Vec3));
    }
});
const v2 = Object.freeze({
    new (x, y) {
        return {
            x,
            y
        };
    },
    random (min, max) {
        return {
            x: random.float(min, max),
            y: random.float(min, max)
        };
    },
    random2 (min, max) {
        return {
            x: random.float(min.x, max.x),
            y: random.float(min.y, max.y)
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
    is (x, y) {
        return x.x == y.x && x.y == y.y;
    },
    scale (Vec2, scale) {
        return this.new(Vec2.x * scale, Vec2.y * scale);
    },
    dscale (Vec2, dscale) {
        return this.new(Vec2.x / dscale, Vec2.y / dscale);
    },
    min1 (Vec2, min) {
        return this.new(Math.max(Vec2.x, min), Math.max(Vec2.y, min));
    },
    min2 (x, y) {
        return this.new(Math.max(x.x, y.x), Math.max(x.y, y.y));
    },
    max1 (Vec2, max) {
        return this.new(Math.min(Vec2.x, max), Math.min(Vec2.y, max));
    },
    max2 (x, y) {
        return this.new(Math.min(x.x, y.x), Math.min(x.y, y.y));
    },
    clamp1 (Vec2, min, max) {
        return this.new(Math.max(Math.min(Vec2.x, max), min), Math.max(Math.min(Vec2.y, max), min));
    },
    clamp2 (Vec2, min, max) {
        return this.new(Math.max(Math.min(Vec2.x, max.x), min.x), Math.max(Math.min(Vec2.y, max.y), min.y));
    },
    lookTo (x, y) {
        return Math.atan2(y.y - x.y, y.x - x.x);
    },
    from_RadAngle (angle) {
        return this.new(Math.cos(angle), Math.sin(angle));
    },
    from_DegAngle (angle) {
        const a = Angle.deg2rad(angle);
        return this.new(Math.cos(a), Math.sin(a));
    },
    distanceSquared (x, y) {
        const dx = x.x - y.x;
        const dy = x.y - y.y;
        return dx * dx + dy * dy;
    },
    distance (x, y) {
        const dx = x.x - y.x;
        const dy = x.y - y.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    squared (Vec2) {
        return Vec2.x * Vec2.x + Vec2.y * Vec2.y;
    },
    length (Vec2) {
        return Math.sqrt(v2.squared(Vec2));
    },
    absolute (Vec2) {
        return this.new(Math.abs(Vec2.x), Math.abs(Vec2.y));
    },
    floor (Vec2) {
        return this.new(Math.floor(Vec2.x), Math.floor(Vec2.y));
    },
    ceil (Vec2) {
        return this.new(Math.ceil(Vec2.x), Math.ceil(Vec2.y));
    },
    neg (Vec2) {
        return this.new(-Vec2.x, -Vec2.y);
    },
    lerp (current, end, interpolation) {
        return this.add(v2.scale(current, 1 - interpolation), this.scale(end, interpolation));
    },
    normalizeSafe (Vec2, fallback = NullVec2) {
        const len = this.length(Vec2);
        return len > 0.000001 ? {
            x: Vec2.x / len,
            y: Vec2.y / len
        } : this.duplicate(fallback);
    },
    normalize (Vec2) {
        const len = v2.length(Vec2);
        return 0.000001 ? {
            x: Vec2.x / len,
            y: Vec2.y / len
        } : v2.duplicate(Vec2);
    },
    duplicate (Vec2) {
        return this.new(Vec2.x, Vec2.y);
    },
    hash (Vec2) {
        let hash = BigInt(float32ToUint32(Vec2.x));
        hash = hash * prime1 & BigInt("4294967295");
        hash ^= BigInt(float32ToUint32(Vec2.y));
        hash = hash * prime2 & BigInt("4294967295");
        return hash;
    },
    toString (Vec2) {
        return `{${Vec2.x},${Vec2.y}}`;
    }
});
const NullVec2 = v2.new(0, 0);
const NullVec3 = v3.new(0, 0, 0);
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
    writeVec2(vec) {
        this.writeFloat32(vec.x);
        this.writeFloat32(vec.y);
    }
    readVec2() {
        return v2.new(this.readFloat32(), this.readFloat32());
    }
    writeVec3(vec) {
        this.writeFloat32(vec.x);
        this.writeFloat32(vec.y);
        this.writeFloat32(vec.z);
    }
    readVec3() {
        return v3.new(this.readFloat32(), this.readFloat32(), this.readFloat32());
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
class ObjectsPacket extends Packet {
    ID = 65532;
    Name = "objects";
    stream;
    constructor(stream = new NetStream()){
        super();
        this.stream = stream;
    }
    encode(stream) {
        stream.writeUInt32(this.stream.buffer.length);
        stream.insert(this.stream.buffer);
    }
    decode(stream) {
        const size = stream.readUInt32();
        this.stream = new NetStream(stream.buffer.subarray(stream.pos, stream.pos + size));
    }
}
const DefaultSignals = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    OBJECTS: "objects"
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
    sendStream(stream) {
        this.ws.send(stream.buffer);
    }
    disconnect() {
        this.ws.close();
    }
}
const Collision = Object.freeze({
    circle_with_rect (hb1, hb2) {
        const cp = v2.clamp2(hb1.position, hb2.position, v2.add(hb2.position, hb2.size));
        const dist = v2.distance(hb1.position, cp);
        return dist < hb1.radius * hb1.radius || hb1.position.x >= hb2.position.x && hb1.position.x <= hb2.position.x + hb2.size.x && hb1.position.x >= hb2.position.x && hb1.position.x <= hb2.position.x + hb2.size.x;
    },
    circle_with_rect_ov (hb1, hb2) {
        if (hb2.position.x <= hb1.position.x && hb1.position.x <= hb2.position.x + hb2.size.x && hb2.position.y <= hb1.position.y && hb1.position.y <= hb2.position.y + hb2.size.y) {
            const halfDim = v2.dscale(v2.sub(v2.add(hb2.position, hb2.size), hb2.position), 2);
            const p = v2.sub(hb1.position, v2.add(hb2.position, halfDim));
            const p2 = v2.sub(v2.sub(v2.absolute(p), halfDim), v2.new(hb1.radius, hb1.radius));
            return [
                v2.new(p.x > 0 ? 1 : -1, p.y > 0 ? 1 : -1),
                p2.x
            ];
        }
        const dir = v2.sub(v2.clamp2(hb1.position, hb2.position, v2.add(hb2.position, hb2.size)), hb1.position);
        const dstSqr = v2.squared(dir);
        if (dstSqr < hb1.radius * hb1.radius) {
            const dst = Math.sqrt(dstSqr);
            return [
                v2.normalizeSafe(dir),
                hb1.radius - dst
            ];
        }
        return null;
    }
});
var HitboxType2D;
(function(HitboxType2D) {
    HitboxType2D[HitboxType2D["circle"] = 0] = "circle";
    HitboxType2D[HitboxType2D["rect"] = 1] = "rect";
    HitboxType2D[HitboxType2D["null"] = 2] = "null";
})(HitboxType2D || (HitboxType2D = {}));
var HitboxType3D;
(function(HitboxType3D) {
    HitboxType3D[HitboxType3D["sphere"] = 0] = "sphere";
    HitboxType3D[HitboxType3D["box"] = 1] = "box";
    HitboxType3D[HitboxType3D["null"] = 2] = "null";
})(HitboxType3D || (HitboxType3D = {}));
class BaseHitbox2D {
    position;
    constructor(position){
        this.position = position;
    }
    is_null() {
        return false;
    }
}
class NullHitbox2D extends BaseHitbox2D {
    constructor(){
        super(NullVec2);
    }
    type = HitboxType2D.null;
    collidingWith(_other) {
        return false;
    }
    pointInside(_point) {
        return false;
    }
    overlapCollision(_other) {
        return {
            overlap: NullVec2,
            collided: false
        };
    }
    center() {
        return NullVec2;
    }
    randomPoint() {
        return NullVec2;
    }
    toRect() {
        return new RectHitbox2D(this.position, v2.new(0, 0));
    }
    scale(_scale) {}
    is_null() {
        return true;
    }
}
class CircleHitbox2D extends BaseHitbox2D {
    type = HitboxType2D.circle;
    radius;
    constructor(position, radius){
        super(position);
        this.radius = radius;
    }
    collidingWith(other) {
        switch(other.type){
            case HitboxType2D.circle:
                return v2.distance(this.position, other.position) < this.radius + other.radius;
            case HitboxType2D.rect:
                return Collision.circle_with_rect(this, other);
        }
        return false;
    }
    overlapCollision(other) {
        if (other) {
            switch(other.type){
                case HitboxType2D.circle:
                    {
                        const dists = v2.distanceSquared(this.position, other.position);
                        const dis = v2.sub(this.position, other.position);
                        if (dists < 0.0001) {
                            return {
                                overlap: v2.new(1, 1),
                                collided: true
                            };
                        }
                        if (dists < (this.radius + other.radius) * 2) {
                            const dist = v2.distance(this.position, other.position);
                            return {
                                overlap: v2.absolute(v2.dscale(dis, dist || 1)),
                                collided: true
                            };
                        }
                        break;
                    }
                case HitboxType2D.rect:
                    {
                        const result = Collision.circle_with_rect_ov(this, other);
                        if (result) {
                            const pos = v2.normalizeSafe(v2.scale(result[0], result[1] * 2));
                            if (v2.is(pos, NullVec2)) {
                                break;
                            }
                            return {
                                overlap: pos,
                                collided: true
                            };
                        }
                        break;
                    }
            }
        }
        return {
            overlap: NullVec2,
            collided: false
        };
    }
    pointInside(point) {
        return v2.distance(this.position, point) < this.radius;
    }
    center() {
        return this.position;
    }
    scale(scale) {
        this.radius *= scale;
    }
    randomPoint() {
        const angle = random.float(0, Math.PI * 2);
        const length = random.float(0, this.radius);
        return v2.new(this.position.x + Math.cos(angle) * length, this.position.y + Math.sin(angle) * length);
    }
    toRect() {
        return new RectHitbox2D(this.position, v2.new(this.radius, this.radius));
    }
}
class RectHitbox2D extends BaseHitbox2D {
    type = HitboxType2D.rect;
    size;
    constructor(position, size){
        super(position);
        this.size = size;
    }
    collidingWith(other) {
        if (other) {
            switch(other.type){
                case HitboxType2D.rect:
                    return this.position.x + this.size.x > other.position.x && this.position.x < other.position.x + other.size.x && this.position.y + this.size.y > other.position.y && this.position.y < other.position.y + other.size.y;
                case HitboxType2D.circle:
                    return Collision.circle_with_rect(other, this);
            }
        }
        return false;
    }
    overlapCollision(other) {
        if (other) {
            switch(other.type){
                case HitboxType2D.rect:
                    {
                        const ss = v2.dscale(v2.add(this.size, other.size), 2);
                        const dist = v2.sub(this.position, other.position);
                        if (v2.less(v2.absolute(dist), ss)) {
                            const ov = v2.normalizeSafe(v2.sub(ss, v2.absolute(dist)));
                            const ov2 = v2.duplicate(ov);
                            if (ov.x < ov.y) {
                                ov2.x = dist.x > 0 ? -ov2.x : ov2.x;
                            } else {
                                ov2.y = dist.y > 0 ? -ov2.y : ov2.y;
                            }
                            return {
                                overlap: ov2,
                                collided: !v2.is(ov2, NullVec2)
                            };
                        }
                        break;
                    }
                case HitboxType2D.circle:
                    {
                        const result = Collision.circle_with_rect_ov(other, this);
                        if (result) {
                            const pos = v2.normalizeSafe(v2.scale(result[0], result[1] * -2));
                            if (v2.is(pos, NullVec2)) {
                                break;
                            }
                            return {
                                overlap: pos,
                                collided: true
                            };
                        }
                        break;
                    }
            }
        }
        return {
            overlap: NullVec2,
            collided: false
        };
    }
    pointInside(point) {
        return this.position.x + this.size.x >= point.x && this.position.x <= point.x && this.position.y + this.size.y >= point.y && this.position.y <= point.y;
    }
    center() {
        return v2.add(this.position, v2.dscale(this.size, 2));
    }
    scale(scale) {
        this.size = v2.scale(this.size, scale);
    }
    randomPoint() {
        return v2.add(this.position, v2.random2(NullVec2, this.size));
    }
    toRect() {
        return this;
    }
}
class BaseHitbox3D {
    transform;
    constructor(position, scale, rotation){
        this.transform = {
            position: position ?? v3.new(0, 0, 0),
            scale: scale ?? v3.new(1, 1, 1),
            rotation: rotation ?? v3.new(0, 0, 0)
        };
    }
    is_null() {
        return false;
    }
}
class NullHitbox3D extends BaseHitbox3D {
    constructor(){
        super(undefined, undefined, undefined);
    }
    type = HitboxType3D.null;
    collidingWith(_other) {
        return false;
    }
    pointInside(_point) {
        return false;
    }
    overlapCollision(_other) {
        return {
            overlap: NullVec3,
            collided: false,
            dire: v3.new(0, 0, 0),
            overlapP: v3.new(0, 0, 0)
        };
    }
    center() {
        return NullVec3;
    }
    randomPoint() {
        return NullVec3;
    }
    toBox() {
        return new BoxHitbox3D(this.transform.position, v3.new(0, 0, 0));
    }
    scale(_scale) {}
    is_null() {
        return true;
    }
}
class BoxHitbox3D extends BaseHitbox3D {
    type = HitboxType3D.box;
    size;
    constructor(position, size, scale, rotation){
        super(position, scale, rotation);
        this.size = size;
    }
    collidingWith(other) {
        if (other) {
            switch(other.type){
                case HitboxType3D.box:
                    return this.transform.position.x + this.size.x > other.transform.position.x && this.transform.position.x < other.transform.position.x + other.size.x && this.transform.position.y + this.size.y > other.transform.position.y && this.transform.position.y < other.transform.position.y + other.size.y && this.transform.position.z + this.size.z > other.transform.position.z && this.transform.position.z < other.transform.position.z + other.size.z;
            }
        }
        return false;
    }
    overlapCollision(other) {
        if (other) {
            switch(other.type){
                case HitboxType3D.box:
                    {
                        const dist = v3.maxDecimal(v3.sub(this.center(), other.center()));
                        const ss = v3.maxDecimal(v3.dscale(v3.add(this.getRealSize(), other.getRealSize()), 2));
                        if (v3.less(v3.absolute(dist), ss)) {
                            const ov = v3.min3(v3.sub(ss, v3.absolute(dist)), NullVec3);
                            const dire = v3.new(0, 0, 0);
                            const ovp = v3.maxDecimal(v3.div(ov, ss));
                            if (ovp.x < ovp.y && ovp.x < ovp.z) {
                                dire.x = dist.x < 0 ? 1 : -1;
                            } else if (ovp.y < ovp.x && ovp.y < ovp.z) {
                                dire.y = dist.y < 0 ? 1 : -1;
                            } else if (ovp.z < ovp.x && ovp.z < ovp.y) {
                                dire.z = dist.z < 0 ? 1 : -1;
                            }
                            return {
                                overlap: v3.maxDecimal(v3.mult(ov, dire)),
                                collided: true,
                                dire: dire,
                                overlapP: v3.sub(dire, v3.mult(ovp, dire))
                            };
                        }
                        break;
                    }
                case HitboxType3D.sphere:
            }
        }
        return {
            overlap: v3.new(0, 0, 0),
            collided: false,
            dire: v3.new(0, 0, 0),
            overlapP: v3.new(0, 0, 0)
        };
    }
    pointInside(point) {
        const pp = v3.mult(this.size, this.transform.scale);
        return point.x >= pp.x && point.x <= this.transform.position.x + pp.x && point.y >= pp.y && point.y <= this.transform.position.y + pp.y && point.z >= pp.z && point.z <= this.transform.position.z + pp.z;
    }
    center() {
        return v3.add(this.transform.position, v3.mult(v3.mult(this.size, this.transform.scale), v3.new(-.5, .5, .5)));
    }
    scale(scale) {
        this.size = v3.scale(this.size, scale);
    }
    randomPoint() {
        return v3.add(this.transform.position, v3.random3(NullVec3, this.size));
    }
    toBox() {
        return this;
    }
    gmm() {
        const s = v3.mult(this.size, this.transform.scale);
        return {
            min: v3.sub(this.transform.position, v3.mult(s, v3.new(1, 0, 0))),
            max: v3.add(this.transform.position, v3.mult(s, v3.new(0, 1, 1)))
        };
    }
    getRealSize() {
        return v3.mult(this.size, this.transform.scale);
    }
    getMin() {
        return this.transform.position;
    }
    getMax() {
        return v3.add(this.transform.position, v3.mult(this.size, this.transform.scale));
    }
}
class SphereHitbox3D extends BaseHitbox3D {
    type = HitboxType3D.sphere;
    radius;
    constructor(position, radius){
        super(position);
        this.radius = radius;
    }
    collidingWith(other) {
        switch(other.type){
            case HitboxType3D.sphere:
                return v3.distance(this.transform.position, other.transform.position) < this.radius + other.radius;
            case HitboxType3D.box:
        }
        return false;
    }
    overlapCollision(other) {
        if (other) {
            switch(other.type){
                case HitboxType3D.sphere:
                    {
                        const dists = v3.distanceSquared(this.transform.position, other.transform.position);
                        const dis = v3.sub(this.transform.position, other.transform.position);
                        if (dists < 0.0001) {
                            return {
                                overlap: v3.new(1, 1, 1),
                                collided: true,
                                dire: v3.new(1, 1, 1),
                                overlapP: v3.new(1, 1, 1)
                            };
                        }
                        if (dists < (this.radius + other.radius) * 2) {
                            const dist = v3.distance(this.transform.position, other.transform.position);
                            const ov = v3.absolute(v3.dscale(dis, dist || 1));
                            return {
                                overlap: ov,
                                collided: true,
                                dire: v3.new(0, 0, 0),
                                overlapP: v3.dscale(ov, this.radius)
                            };
                        }
                        break;
                    }
                case HitboxType3D.box:
            }
        }
        return {
            overlap: NullVec3,
            collided: false,
            dire: v3.new(0, 0, 0),
            overlapP: v3.new(0, 0, 0)
        };
    }
    pointInside(point) {
        return v2.distance(this.transform.position, point) < this.radius;
    }
    center() {
        return this.transform.position;
    }
    scale(scale) {
        this.radius *= scale;
    }
    randomPoint() {
        const angle1 = random.float(0, Math.PI * 2);
        const angle2 = random.float(0, Math.PI);
        const radius = random.float(0, this.radius);
        return v3.new(this.transform.position.x + radius * Math.sin(angle2) * Math.cos(angle1) * this.transform.scale.x, this.transform.position.y + radius * Math.sin(angle2) * Math.sin(angle1) * this.transform.scale.y, this.transform.position.z + radius * Math.cos(angle1) * this.transform.scale.z);
    }
    toBox() {
        return new BoxHitbox3D(this.transform.position, v3.new(this.radius * this.transform.scale.x, this.radius * this.transform.scale.y, this.radius * this.transform.scale.z));
    }
}
class BaseObject2D {
    hb;
    destroyed;
    id;
    category;
    calldestroy = true;
    dirty = false;
    dirtyPart = false;
    manager;
    get position() {
        return this.hb ? this.hb.position : v2.new(0, 0);
    }
    set position(val) {
        this.hb.position = val;
    }
    constructor(){
        this.hb = new NullHitbox2D();
        this.destroyed = false;
    }
    onDestroy() {}
    get_key() {
        return {
            category: this.category,
            id: this.id
        };
    }
}
class BaseObject3D {
    hb;
    destroyed;
    id;
    category;
    calldestroy = true;
    dirty = false;
    dirtyPart = false;
    manager;
    get position() {
        return this.hb ? this.hb.transform.position : v3.new(0, 0, 0);
    }
    set position(val) {
        this.hb.transform.position = val;
    }
    get scale() {
        return this.hb ? this.hb.transform.scale : v3.new(0, 0, 0);
    }
    set scale(val) {
        this.hb.transform.scale = val;
    }
    get rotation() {
        return this.hb ? this.hb.transform.rotation : v3.new(0, 0, 0);
    }
    set rotation(val) {
        this.hb.transform.rotation = val;
    }
    constructor(){
        this.hb = new NullHitbox3D();
        this.destroyed = false;
    }
    onDestroy() {}
    get_key() {
        return {
            category: this.category,
            id: this.id
        };
    }
}
class CellsManager2D {
    objects = {};
    cellSize;
    cells;
    constructor(cellSize = 32){
        this.cellSize = cellSize;
        this.cells = {};
    }
    registry(obj) {
        if (!this.objects[obj.category]) {
            this.objects[obj.category] = {};
        }
        if (this.objects[obj.category][obj.id]) {
            throw new Error(`Existent Object ${obj.id} In Cell`);
        }
        this.objects[obj.category][obj.id] = obj;
    }
    unregistry(obj) {
        if (!(this.objects[obj.category] && this.objects[obj.category][obj.id])) {
            throw new Error(`Invalid Object ${obj}`);
        }
        delete this.objects[obj.category][obj.id];
    }
    update() {
        this.cells = {};
        for (const c of Object.keys(this.objects)){
            for (const obj of Object.values(this.objects[c])){
                const rect = obj.hb.toRect();
                let min = this.cellPos(rect.position);
                let max = this.cellPos(v2.add(rect.position, rect.size));
                if (v2.less(max, min)) {
                    const m = min;
                    min = max;
                    max = m;
                }
                for(let y = min.y; y <= max.y; y++){
                    if (!this.cells[y]) {
                        this.cells[y] = {};
                    }
                    for(let x = min.x; x <= max.x; x++){
                        if (!this.cells[y][x]) {
                            this.cells[y][x] = {};
                        }
                        if (!this.cells[y][x][obj.category]) {
                            this.cells[y][x][obj.category] = [];
                        }
                        this.cells[y][x][obj.category].push(obj);
                    }
                }
            }
        }
    }
    get_objects(hitbox, categorys) {
        const rect = hitbox.toRect();
        let min = this.cellPos(rect.position);
        let max = this.cellPos(v2.add(rect.position, rect.size));
        if (v2.less(max, min)) {
            const m = min;
            min = max;
            max = m;
        }
        const objects = {};
        for(let y = min.y; y <= max.y; y++){
            if (!this.cells[y]) continue;
            for(let x = min.x; x <= max.x; x++){
                if (!this.cells[y][x]) continue;
                for (const c of categorys){
                    if (!objects[c]) {
                        objects[c] = [];
                    }
                    objects[c].push(...this.cells[y][x][c]);
                }
            }
        }
        return objects;
    }
    get_objects2(hitbox, categorys) {
        const rect = hitbox.toRect();
        let min = this.cellPos(rect.position);
        let max = this.cellPos(v2.add(rect.position, rect.size));
        if (v2.less(max, min)) {
            const m = min;
            min = max;
            max = m;
        }
        const objects = [];
        for(let y = min.y; y <= max.y; y++){
            if (!this.cells[y]) continue;
            for(let x = min.x; x <= max.x; x++){
                if (!this.cells[y][x]) continue;
                objects.push(...this.cells[y][x][categorys]);
            }
        }
        return objects;
    }
    cellPos(pos) {
        return v2.floor(v2.dscale(pos, this.cellSize));
    }
}
class CellsManager3D {
    objects = {};
    cellSize;
    cells;
    constructor(cellSize = 32){
        this.cellSize = cellSize;
        this.cells = {};
    }
    registry(obj) {
        if (!this.objects[obj.category]) {
            this.objects[obj.category] = {};
        }
        if (this.objects[obj.category][obj.id]) {
            throw new Error(`Existent Object ${obj.id} In Cell`);
        }
        this.objects[obj.category][obj.id] = obj;
    }
    unregistry(obj) {
        if (!(this.objects[obj.category] && this.objects[obj.category][obj.id])) {
            throw new Error(`Invalid Object ${obj}`);
        }
        delete this.objects[obj.category][obj.id];
    }
    update() {
        this.cells = {};
        for (const c of Object.keys(this.objects)){
            for (const obj of Object.values(this.objects[c])){
                const rect = obj.hb.toBox().gmm();
                let min = this.cellPos(rect.min);
                let max = this.cellPos(rect.max);
                if (v3.less(max, min)) {
                    const m = min;
                    min = max;
                    max = m;
                }
                for(let z = min.z; z <= max.z; z++){
                    if (!this.cells[z]) {
                        this.cells[z] = {};
                    }
                    for(let y = min.y; y <= max.y; y++){
                        if (!this.cells[z][y]) {
                            this.cells[z][y] = {};
                        }
                        for(let x = min.x; x <= max.x; x++){
                            if (!this.cells[z][y][x]) {
                                this.cells[z][y][x] = {};
                            }
                            if (!this.cells[z][y][x][obj.category]) {
                                this.cells[z][y][x][obj.category] = [];
                            }
                            this.cells[z][y][x][obj.category].push(obj);
                        }
                    }
                }
            }
        }
    }
    get_objects(hitbox, categorys) {
        const rect = hitbox.toBox().gmm();
        let min = this.cellPos(rect.min);
        let max = this.cellPos(rect.max);
        if (v3.less(max, min)) {
            const m = min;
            min = max;
            max = m;
        }
        const objects = {};
        for(let z = min.z; z <= max.z; z++){
            if (!this.cells[z]) continue;
            for(let y = min.y; y <= max.y; y++){
                if (!this.cells[z][y]) continue;
                for(let x = min.x; x <= max.x; x++){
                    if (!this.cells[z][y][x]) continue;
                    for (const c of categorys){
                        if (!this.cells[z][y][x][c]) continue;
                        if (!objects[c]) {
                            objects[c] = [];
                        }
                        objects[c].push(...this.cells[z][y][x][c]);
                    }
                }
            }
        }
        return objects;
    }
    get_objects2(hitbox, categorys) {
        const rect = hitbox.toBox().gmm();
        let min = this.cellPos(rect.min);
        let max = this.cellPos(rect.max);
        if (v3.less(max, min)) {
            const m = min;
            min = max;
            max = m;
        }
        const objects = [];
        for(let z = min.z; z < max.z; z++){
            if (!this.cells[z]) continue;
            for(let y = min.y; y <= max.y; y++){
                if (!this.cells[z][y]) continue;
                for(let x = min.x; x <= max.x; x++){
                    if (!this.cells[z][y][x]) continue;
                    objects.push(...this.cells[z][y][x][categorys]);
                }
            }
        }
        return objects;
    }
    cellPos(pos) {
        return v3.floor(v3.dscale(pos, this.cellSize));
    }
}
class GameObjectManager2D {
    cells;
    objects = {};
    stream;
    ondestroy = (_)=>{};
    constructor(cellsSize){
        this.cells = new CellsManager2D(cellsSize);
        this.stream = new NetStream(new Uint8Array());
    }
    clear() {
        for(const c in this.objects){
            for(let j = 0; j < this.objects[c].orden.length; j++){
                const o = this.objects[c].orden[j];
                this.unregister(this.objects[c].objects[o].get_key());
            }
        }
        this.objects = {};
    }
    add_object(obj, category, id, args) {
        if (!this.objects[category]) {
            throw new Error(`Invalid Category ${category}`);
        }
        if (id === undefined) {
            while(id === undefined){
                id = random.id();
                if (this.objects[category].objects[id]) {
                    id = undefined;
                }
            }
        }
        obj.id = id;
        obj.category = category;
        obj.dirty = true;
        obj.manager = this;
        this.objects[category].objects[obj.id] = obj;
        this.objects[category].orden.push(obj.id);
        obj.create(args ?? {});
        this.cells.registry(obj);
        return obj;
    }
    get_object(obj) {
        return this.objects[obj.category].objects[obj.id];
    }
    exist(obj) {
        return Object.hasOwn(this.objects, obj.category) && Object.hasOwn(this.objects[obj.category].objects, obj.id);
    }
    alive_count(category) {
        return this.objects[category].orden.length;
    }
    add_category(category) {
        this.objects[category] = {
            orden: [],
            objects: {}
        };
    }
    proccess(packet, oncreate) {
        const csize = packet.stream.readUInt16();
        for(let i = 0; i < csize; i++){
            const category = packet.stream.readString();
            if (!this.objects[category]) {
                continue;
            }
            const osize = packet.stream.readUInt16();
            for(let j = 0; j < osize; j++){
                const oid = this.stream.readID();
                if (!this.objects[category].objects[oid]) {
                    oncreate({
                        category: category,
                        id: oid
                    });
                }
                const dir = this.stream.readUInt8();
                if (dir > 0) {
                    if (dir >= 100) {
                        this.objects[category].objects[oid].destroyed = true;
                        continue;
                    }
                    this.objects[category].objects[oid].dirtyPart = true;
                    this.objects[category].objects[oid].decodePart(packet.stream);
                    if (dir > 1) {
                        this.objects[category].objects[oid].dirty = true;
                        this.objects[category].objects[oid].decodeComplete(packet.stream);
                    }
                }
            }
        }
    }
    encode() {
        const stream = new NetStream();
        stream.writeUInt16(Object.keys(this.objects).length);
        for(const c in this.objects){
            stream.writeString(c);
            stream.writeUInt16(this.objects[c].orden.length);
            for(let j = 0; j < this.objects[c].orden.length; j++){
                const o = this.objects[c].orden[j];
                stream.writeID(o);
                stream.writeUInt8(11 + (this.objects[c].objects[o].calldestroy && this.objects[c].objects[o].destroyed ? 100 : 0));
                this.objects[c].objects[o].encodePart(stream);
                this.objects[c].objects[o].encodeComplete(stream);
            }
        }
        return new ObjectsPacket(stream);
    }
    update() {
        this.cells.update();
        this.stream.clear();
        this.stream.writeUInt16(Object.keys(this.objects).length);
        for(const c in this.objects){
            this.stream.writeString(c);
            this.stream.writeUInt16(this.objects[c].orden.length);
            for(let j = 0; j < this.objects[c].orden.length; j++){
                const o = this.objects[c].orden[j];
                this.objects[c].objects[o].update();
                this.stream.writeID(o);
                this.stream.writeUInt8((this.objects[c].objects[o].dirtyPart ? 1 : 0) * 1 + (this.objects[c].objects[o].dirty ? 1 : 0) * 10 + (this.objects[c].objects[o].calldestroy && this.objects[c].objects[o].destroyed ? 100 : 0));
                if (this.objects[c].objects[o].dirtyPart || this.objects[c].objects[o].dirty) {
                    this.objects[c].objects[o].encodePart(this.stream);
                    if (this.objects[c].objects[o].dirty) {
                        this.objects[c].objects[o].dirty = false;
                        this.objects[c].objects[o].encodeComplete(this.stream);
                    }
                    this.objects[c].objects[o].dirtyPart = true;
                }
                if (this.objects[c].objects[o].destroyed) {
                    this.unregister(this.objects[c].objects[o].get_key());
                    delete this.objects[c].objects[o];
                    this.objects[c].orden.splice(j, 1);
                    j--;
                    continue;
                }
            }
        }
    }
    unregister(k) {
        if (this.objects[k.category].objects[k.id].calldestroy) {
            this.ondestroy(this.objects[k.category].objects[k.id]);
            this.objects[k.category].objects[k.id].onDestroy();
        }
        this.cells.unregistry(this.objects[k.category].objects[k.id].get_key());
    }
}
class GameObjectManager3D {
    cells;
    objects = {};
    stream;
    ondestroy = (_)=>{};
    constructor(cellsSize){
        this.cells = new CellsManager3D(cellsSize);
        this.stream = new NetStream(new Uint8Array());
    }
    add_object(obj, category, id, args) {
        if (!this.objects[category]) {
            throw new Error(`Invalid Category ${category}`);
        }
        if (id === undefined) {
            while(id === undefined){
                id = random.id();
                if (this.objects[category].objects[id]) {
                    id = undefined;
                }
            }
        }
        obj.id = id;
        obj.category = category;
        obj.dirty = true;
        obj.manager = this;
        this.objects[category].objects[obj.id] = obj;
        this.objects[category].orden.push(obj.id);
        obj.create(args ?? {});
        this.cells.registry(obj);
        return obj;
    }
    get_object(obj) {
        return this.objects[obj.category].objects[obj.id];
    }
    exist(obj) {
        return Object.hasOwn(this.objects, obj.category) && Object.hasOwn(this.objects[obj.category].objects, obj.id);
    }
    alive_count(category) {
        return this.objects[category].orden.length;
    }
    add_category(category) {
        this.objects[category] = {
            orden: [],
            objects: {}
        };
    }
    proccess(packet, oncreate) {
        const csize = packet.stream.readUInt16();
        for(let i = 0; i < csize; i++){
            const category = packet.stream.readString();
            if (!this.objects[category]) {
                continue;
            }
            const osize = packet.stream.readUInt16();
            for(let j = 0; j < osize; j++){
                const oid = this.stream.readID();
                if (!this.objects[category].objects[oid]) {
                    oncreate({
                        category: category,
                        id: oid
                    });
                }
                const dir = this.stream.readUInt8();
                if (dir > 0) {
                    if (dir >= 100) {
                        this.objects[category].objects[oid].destroyed = true;
                        continue;
                    }
                    this.objects[category].objects[oid].dirtyPart = true;
                    this.objects[category].objects[oid].decodePart(packet.stream);
                    if (dir > 1) {
                        this.objects[category].objects[oid].dirty = true;
                        this.objects[category].objects[oid].decodeComplete(packet.stream);
                    }
                }
            }
        }
    }
    encode() {
        const stream = new NetStream();
        stream.writeUInt16(Object.keys(this.objects).length);
        for(const c in this.objects){
            stream.writeString(c);
            stream.writeUInt16(this.objects[c].orden.length);
            for(let j = 0; j < this.objects[c].orden.length; j++){
                const o = this.objects[c].orden[j];
                stream.writeID(o);
                stream.writeUInt8(11 + (this.objects[c].objects[o].calldestroy && this.objects[c].objects[o].destroyed ? 100 : 0));
                this.objects[c].objects[o].encodePart(stream);
                this.objects[c].objects[o].encodeComplete(stream);
            }
        }
        return new ObjectsPacket(stream);
    }
    update() {
        this.cells.update();
        this.stream.clear();
        this.stream.writeUInt16(Object.keys(this.objects).length);
        for(const c in this.objects){
            this.stream.writeString(c);
            this.stream.writeUInt16(this.objects[c].orden.length);
            for(let j = 0; j < this.objects[c].orden.length; j++){
                const o = this.objects[c].orden[j];
                this.objects[c].objects[o].update();
                this.stream.writeID(o);
                this.stream.writeUInt8((this.objects[c].objects[o].dirtyPart ? 1 : 0) * 1 + (this.objects[c].objects[o].dirty ? 1 : 0) * 10 + (this.objects[c].objects[o].calldestroy && this.objects[c].objects[o].destroyed ? 100 : 0));
                if (this.objects[c].objects[o].dirtyPart || this.objects[c].objects[o].dirty) {
                    this.objects[c].objects[o].encodePart(this.stream);
                    if (this.objects[c].objects[o].dirty) {
                        this.objects[c].objects[o].dirty = false;
                        this.objects[c].objects[o].encodeComplete(this.stream);
                    }
                    this.objects[c].objects[o].dirtyPart = true;
                }
                if (this.objects[c].objects[o].destroyed) {
                    this.unregister(this.objects[c].objects[o].get_key());
                    delete this.objects[c].objects[o];
                    this.objects[c].orden.splice(j, 1);
                    j--;
                    continue;
                }
            }
        }
    }
    clear() {
        for(const c in this.objects){
            for(let j = 0; j < this.objects[c].orden.length; j++){
                const o = this.objects[c].orden[j];
                this.unregister(this.objects[c].objects[o].get_key());
            }
        }
        this.objects = {};
    }
    unregister(k) {
        if (this.objects[k.category].objects[k.id].calldestroy) {
            this.ondestroy(this.objects[k.category].objects[k.id]);
            this.objects[k.category].objects[k.id].onDestroy();
        }
        this.cells.unregistry(this.objects[k.category].objects[k.id].get_key());
    }
}
var DefaultEvents;
(function(DefaultEvents) {
    DefaultEvents["GameTick"] = "game-tick";
    DefaultEvents["GameRun"] = "game-run";
})(DefaultEvents || (DefaultEvents = {}));
class EventsManager {
    signals;
    constructor(){
        this.signals = {};
    }
    on(signal, cb) {
        (this.signals[signal] ??= new Set()).add(cb);
    }
    off(eventType, cb) {
        if (!cb) {
            delete this.signals[eventType];
            return;
        }
        this.signals[eventType]?.delete(cb);
    }
    emit(eventType, data) {
        for (const cb of this.signals[eventType] || []){
            if (cb) {
                cb(data);
            }
        }
    }
    clear(eventType) {
        this.signals[eventType] = [];
    }
    clearAll() {
        this.signals = {};
    }
}
class BaseGameObject2D extends BaseObject2D {
    game;
    constructor(){
        super();
    }
}
class BaseGameObject3D extends BaseObject3D {
    game;
    constructor(){
        super();
    }
}
class Scene2DInstance {
    scene;
    objects;
    cells;
    game;
    constructor(scene, game){
        this.scene = scene;
        this.objects = new GameObjectManager2D(scene.cellsSize);
        this.cells = this.objects.cells;
        this.game = game;
        this.reset();
    }
    reset() {
        this.objects.clear();
        this.objects.add_object = (obj, category, id, args)=>{
            const ret = GameObjectManager2D.prototype.add_object.call(this.objects, obj, category, id, args);
            ret.game = this.game;
            return ret;
        };
        for(const c in this.scene.objects){
            this.objects.add_category(c);
            for (const o of this.scene.objects[c]){
                const obj = this.objects.add_object(new this.game.objects[o.type](), c, o.id, o.vals);
                if (o.position) obj.position = cloneDeep(o.position);
            }
        }
    }
    asyncReset() {
        return new Promise((resolve)=>{
            resolve(this.reset());
        });
    }
}
class Scene3DInstance {
    scene;
    objects;
    cells;
    game;
    constructor(scene, game){
        this.scene = scene;
        this.objects = new GameObjectManager3D(scene.cellsSize);
        this.cells = this.objects.cells;
        this.game = game;
        this.reset();
    }
    reset() {
        this.objects.clear();
        this.objects.add_object = (obj, category, id, args)=>{
            const ret = GameObjectManager3D.prototype.add_object.call(this.objects, obj, category, id, args);
            ret.game = this.game;
            return ret;
        };
        for(const c in this.scene.objects){
            this.objects.add_category(c);
            for (const o of this.scene.objects[c]){
                const obj = this.objects.add_object(new this.game.objects[o.type](), c, o.id, o.vals);
                if (o.position) obj.position = o.position;
                if (o.scale) obj.hb.transform.scale = cloneDeep(o.scale);
                if (o.rotation) obj.hb.transform.rotation = cloneDeep(o.rotation);
            }
        }
    }
    asyncReset() {
        return new Promise((resolve)=>{
            resolve(this.reset());
        });
    }
}
class Game2D {
    tps;
    clock;
    running = true;
    events;
    scene;
    objects;
    constructor(tps, objects){
        this.tps = tps;
        this.events = new EventsManager();
        this.clock = new Clock(tps, 1);
        this.objects = objects;
        this.scene = new Scene2DInstance({
            objects: {}
        }, this);
    }
    add_plugin(plugin) {
        plugin.game = this;
        plugin.init_signals();
    }
    clear_plugins() {
        this.events.clearAll();
    }
    update() {
        this.scene.objects.update();
        this.on_update();
        this.events.emit(DefaultEvents.GameTick, this);
        this.clock.tick(this.update.bind(this));
    }
    on_update() {}
    on_run() {}
    mainloop() {
        this.on_run();
        this.events.emit(DefaultEvents.GameRun, this);
        this.update();
    }
    instantiate(scene) {
        return new Scene2DInstance(scene, this);
    }
    asyncInstantiate(scene) {
        return new Promise((resolve, _reject)=>{
            resolve(new Scene2DInstance(scene, this));
        });
    }
}
class Game3D {
    tps;
    clock;
    running = true;
    events;
    scene;
    objects;
    constructor(tps, objects){
        this.tps = tps;
        this.events = new EventsManager();
        this.clock = new Clock(tps, 1);
        this.objects = objects;
        this.scene = new Scene3DInstance({
            objects: {}
        }, this);
    }
    add_plugin(plugin) {
        plugin.game = this;
        plugin.init_signals();
    }
    clear_plugins() {
        this.events.clearAll();
    }
    update() {
        this.scene.objects.update();
        this.on_update();
        this.events.emit(DefaultEvents.GameTick, this);
        this.clock.tick(this.update.bind(this));
    }
    on_update() {}
    on_run() {}
    mainloop() {
        this.on_run();
        this.events.emit(DefaultEvents.GameRun, this);
        this.update();
    }
    instantiate(scene) {
        return new Scene3DInstance(scene, this);
    }
    asyncInstantiate(scene) {
        return new Promise((resolve, _reject)=>{
            resolve(new Scene3DInstance(scene, this));
        });
    }
}
class Model3D {
    _vertices;
    _indices;
    _normalsM;
    _normals;
    _texCoords;
    _texCoordsM;
    constructor(){
        this._vertices = [];
        this._indices = [];
        this._normals = [];
        this._normalsM = [];
        this._texCoords = [];
        this._texCoordsM = [];
    }
    toRect() {
        const min = v3.new(0, 0, 0);
        const max = v3.new(0, 0, 0);
        for(let i = 0; i + 2 <= this._vertices.length; i += 3){
            const p = v3.new(-this._vertices[i], this._vertices[i + 1], this._vertices[i + 2]);
            if (v3.lessOr(p, min)) {
                if (p.x < min.x) {
                    min.x = p.x;
                }
                if (p.y < min.y) {
                    min.y = p.y;
                }
                if (p.z < min.z) {
                    min.z = p.z;
                }
            } else if (v3.greaterOr(p, max)) {
                if (p.x > max.x) {
                    max.x = p.x;
                }
                if (p.y > max.y) {
                    max.y = p.y;
                }
                if (p.z > max.z) {
                    max.z = p.z;
                }
            }
        }
        return new BoxHitbox3D(v3.new(0, 0, 0), v3.add(v3.absolute(min), v3.absolute(max)));
    }
    addFace3(face) {
        const ret = {
            p1: -1,
            p2: -1,
            p3: -1,
            i: 0
        };
        for(let i = 0; i < this._vertices.length; i += 3){
            const v = v3.new(-this._vertices[i], this._vertices[i + 1], this._vertices[i + 2]);
            if (v3.is(face.p1, v)) {
                ret.p1 = i;
            }
            if (v3.is(face.p2, v)) {
                ret.p2 = i;
            }
            if (v3.is(face.p3, v)) {
                ret.p3 = i;
            }
        }
        ret.i = this._indices.length;
        if (ret.p1 === -1) {
            this._indices.push(Math.floor(this._vertices.length / 3));
            ret.p1 = this._vertices.length;
            this._vertices.push(-face.p1.x, face.p1.y, face.p1.z);
        } else {
            this._indices.push(Math.floor(ret.p1 / 3));
        }
        if (ret.p2 === -1) {
            this._indices.push(Math.floor(this._vertices.length / 3));
            ret.p2 = this._vertices.length;
            this._vertices.push(-face.p2.x, face.p2.y, face.p2.z);
        } else {
            this._indices.push(Math.floor(ret.p2 / 3));
        }
        if (ret.p3 === -1) {
            this._indices.push(Math.floor(this._vertices.length / 3));
            ret.p3 = this._vertices.length;
            this._vertices.push(-face.p3.x, face.p3.y, face.p3.z);
        } else {
            this._indices.push(Math.floor(ret.p3 / 3));
        }
        if (face.normal) {
            ret.normal = {
                p1: -1,
                p2: -1,
                p3: -1,
                i: this._normalsM.length
            };
            for(let i = 0; i < this._normals.length; i += 3){
                const v = v3.new(this._normals[i], this._normals[i + 1], this._normals[i + 2]);
                if (v3.is(face.normal.p1, v)) {
                    ret.normal.p1 = i;
                }
                if (v3.is(face.normal.p2, v)) {
                    ret.normal.p2 = i;
                }
                if (v3.is(face.normal.p3, v)) {
                    ret.normal.p3 = i;
                }
            }
            if (ret.normal.p1 === -1) {
                this._normalsM.push(Math.floor(this._normals.length / 3));
                ret.normal.p1 = this._normals.length;
                this._normals.push(face.normal.p1.x, face.normal.p1.y, face.normal.p1.z);
            } else {
                this._normalsM.push(Math.floor(ret.normal.p1 / 3));
            }
            if (ret.normal.p2 === -1) {
                this._normalsM.push(Math.floor(this._normals.length / 3));
                ret.normal.p2 = this._vertices.length;
                this._normals.push(face.normal.p2.x, face.normal.p2.y, face.normal.p2.z);
            } else {
                this._normalsM.push(Math.floor(ret.normal.p2 / 3));
            }
            if (ret.normal.p3 === -1) {
                this._normalsM.push(Math.floor(this._normals.length / 3));
                ret.normal.p3 = this._normals.length;
                this._normals.push(face.normal.p3.x, face.normal.p3.y, face.normal.p3.z);
            } else {
                this._normalsM.push(Math.floor(ret.normal.p3 / 3));
            }
        }
        if (face.texture) {
            ret.texture = {
                p1: -1,
                p2: -1,
                p3: -1,
                i: this._normalsM.length
            };
            for(let i = 0; i < this._texCoords.length; i += 3){
                const v = v3.new(this._texCoords[i], this._texCoords[i + 1], this._texCoords[i + 2]);
                if (v3.is(face.texture.p1, v)) {
                    ret.texture.p1 = i;
                }
                if (v3.is(face.texture.p2, v)) {
                    ret.texture.p2 = i;
                }
                if (v3.is(face.texture.p3, v)) {
                    ret.texture.p3 = i;
                }
            }
            if (ret.texture.p1 === -1) {
                this._texCoordsM.push(Math.floor(this._texCoords.length / 3));
                ret.texture.p1 = this._normals.length;
                this._texCoords.push(face.texture.p1.x, face.texture.p1.y, face.texture.p1.z);
            } else {
                this._texCoordsM.push(Math.floor(ret.texture.p1 / 3));
            }
            if (ret.texture.p2 === -1) {
                this._texCoordsM.push(Math.floor(this._texCoords.length / 3));
                ret.texture.p2 = this._normals.length;
                this._texCoords.push(face.texture.p2.x, face.texture.p2.y, face.texture.p2.z);
            } else {
                this._texCoordsM.push(Math.floor(ret.texture.p2 / 3));
            }
            if (ret.texture.p3 === -1) {
                this._texCoordsM.push(Math.floor(this._texCoords.length / 3));
                ret.texture.p3 = this._normals.length;
                this._texCoords.push(face.texture.p3.x, face.texture.p3.y, face.texture.p3.z);
            } else {
                this._texCoordsM.push(Math.floor(ret.texture.p3 / 3));
            }
        }
        return ret;
    }
    addFace4(face) {
        const f1 = this.addFace3({
            p1: face.p1,
            p2: face.p2,
            p3: face.p3,
            normal: face.normal ? {
                p1: face.normal.p1,
                p2: face.normal.p2,
                p3: face.normal.p3
            } : undefined,
            texture: face.texture ? {
                p1: face.texture.p1,
                p2: face.texture.p2,
                p3: face.texture.p3
            } : undefined
        });
        const f2 = this.addFace3({
            p1: face.p1,
            p2: face.p4,
            p3: face.p3,
            normal: face.normal ? {
                p1: face.normal.p1,
                p2: face.normal.p4,
                p3: face.normal.p3
            } : undefined,
            texture: face.texture ? {
                p1: face.texture.p1,
                p2: face.texture.p4,
                p3: face.texture.p3
            } : undefined
        });
        return {
            0: f1,
            1: f2
        };
    }
}
const m3 = Object.freeze({
    cube (s = 1) {
        const ret = new Model3D();
        ret._vertices = [
            0,
            0,
            s,
            0,
            0,
            s,
            -s,
            s,
            s,
            -0,
            s,
            s,
            0,
            0,
            0,
            -s,
            0,
            0,
            -s,
            s,
            0,
            0,
            s,
            0
        ];
        ret._indices = [
            0,
            1,
            2,
            0,
            2,
            3,
            4,
            5,
            6,
            4,
            6,
            7,
            3,
            2,
            6,
            3,
            6,
            7,
            0,
            1,
            5,
            0,
            5,
            4,
            1,
            2,
            6,
            1,
            6,
            5,
            0,
            3,
            7,
            0,
            7,
            4
        ];
        return ret;
    },
    parseObj (objText) {
        const ret = new Model3D();
        const lines = objText.split('\n');
        for (let line of lines){
            line = line.trim();
            if (line.startsWith('v ')) {
                const parts = line.split(/\s+/);
                const vertex = parts.slice(1).map(parseFloat);
                vertex[0] *= -1;
                ret._vertices.push(...vertex);
            } else if (line.startsWith('vn ')) {
                const parts = line.split(/\s+/);
                const normal = parts.slice(1).map(parseFloat);
                ret._normals.push(...normal);
            } else if (line.startsWith('vt ')) {
                const parts = line.split(/\s+/);
                const textureCoord = parts.slice(1).map(parseFloat);
                ret._texCoords.push(...textureCoord);
            } else if (line.startsWith('f ')) {
                const parts = line.split(/\s+/).slice(1);
                const vertices = [];
                const textures = [];
                const normals = [];
                for (const part of parts){
                    const [v, vt, vn] = part.split('/').map((str)=>parseInt(str) - 1);
                    vertices.push(v);
                    if (vt !== undefined) textures.push(vt);
                    if (vn !== undefined) normals.push(vn);
                }
                ret._indices.push(...vertices);
                ret._normalsM.push(...normals);
                ret._texCoordsM.push(...textures);
            }
        }
        return ret;
    }
});
const RGBA = Object.freeze({
    new (r, g, b, a = 255) {
        return {
            r: r / 255,
            g: g / 255,
            b: b / 255,
            a: a / 255
        };
    },
    from (json) {
        return {
            r: json.r / 255,
            g: json.g / 255,
            b: json.b / 255,
            a: (json.a ?? 255) / 255
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
const float camRot2=1.3;
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
class WebglRenderer extends Renderer {
    gl;
    simple_program;
    isometric_simple_shadow_program;
    isometric_simple_program;
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
        const isometric_simple_program = gl.createProgram();
        gl.attachShader(isometric_simple_program, this.createShader(isoVertexShaderSource, gl.VERTEX_SHADER));
        gl.attachShader(isometric_simple_program, this.createShader(isoSimpleFragShaderSource, gl.FRAGMENT_SHADER));
        this.isometric_simple_program = isometric_simple_program;
        gl.linkProgram(this.isometric_simple_program);
        const isometric_simple_shadow_program = gl.createProgram();
        gl.attachShader(isometric_simple_shadow_program, this.createShader(isoVertexShaderSource, gl.VERTEX_SHADER));
        gl.attachShader(isometric_simple_shadow_program, this.createShader(isoSimpleShadowFragShaderSource, gl.FRAGMENT_SHADER));
        this.isometric_simple_shadow_program = isometric_simple_shadow_program;
        gl.linkProgram(this.isometric_simple_shadow_program);
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
        gl.enable(gl.DEPTH_TEST);
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
        throw Error("Can't create shader");
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
    draw_rect2D(rect, color) {
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
    draw_circle2D(circle, color, precision = 50) {
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
    draw_hitbox2D(hitbox, color) {
        switch(hitbox.type){
            case HitboxType2D.circle:
                this.draw_circle2D(hitbox, color);
                break;
            case HitboxType2D.rect:
                this.draw_rect2D(hitbox, color);
                break;
            default:
                return;
        }
    }
    draw_image2D(image, position, size) {
        const x1 = position.x;
        const y1 = position.y;
        const x2 = position.x + size.x;
        const y2 = position.y + size.y;
        const vertices = [
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
        ];
        const textureCoordinates = [
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            1.0,
            0.0,
            1.0,
            1.0,
            0.0,
            1.0,
            1.0
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
    _iso_draw_vertices_color(vertices, indices, pos, scale, rot, color, wireframe = false, simple_shadow = false, mode = this.gl.TRIANGLES) {
        const gl = this.gl;
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        let program = this.isometric_simple_program;
        if (simple_shadow && !wireframe) {
            program = this.isometric_simple_shadow_program;
        }
        gl.useProgram(program);
        const positionAttributeLocation = gl.getAttribLocation(program, "a_Position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        const colorUniformLocation = gl.getUniformLocation(program, "a_Color");
        gl.uniform4f(colorUniformLocation, color.r, color.g, color.b, color.a);
        const projectionMatrixLocation = gl.getUniformLocation(program, "u_ProjectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix);
        const translationLocation = gl.getUniformLocation(program, "u_Translation");
        gl.uniform3f(translationLocation, pos.x, pos.y, pos.z);
        const scaleLocation = gl.getUniformLocation(program, "u_Scale");
        gl.uniform3f(scaleLocation, scale.x, scale.y, scale.z);
        const rotLocation = gl.getUniformLocation(program, "u_Rotation");
        gl.uniform3f(rotLocation, rot.x, rot.y, rot.z);
        if (wireframe) {
            const wireframeIndices = [];
            for(let i = 0; i < indices.length; i += 3){
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
    draw_iso_rect(rect, color, wireframe = false, simple_shadow = false) {
        this._iso_draw_vertices_color([
            0,
            0,
            1,
            0,
            0,
            1,
            -1,
            1,
            1,
            0,
            1,
            1,
            0,
            0,
            0,
            -1,
            0,
            0,
            -1,
            1,
            0,
            0,
            1,
            0
        ], [
            0,
            1,
            2,
            0,
            2,
            3,
            4,
            5,
            6,
            4,
            6,
            7,
            3,
            2,
            6,
            3,
            6,
            7,
            0,
            1,
            5,
            0,
            5,
            4,
            1,
            2,
            6,
            1,
            6,
            5,
            0,
            3,
            7,
            0,
            7,
            4
        ], rect.transform.position, v3.mult(rect.size, rect.transform.scale), NullVec3, color, wireframe, simple_shadow);
    }
    color_draw_iso_model(m, position, scale, rot, color, wireframe = false, simple_shadow = true) {
        this._iso_draw_vertices_color(m._vertices, m._indices, position, scale, rot, color, wireframe, simple_shadow);
    }
    clear() {
        this.gl.clearDepth(100.0);
        this.gl.depthFunc(this.gl.LEQUAL);
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
        for (const i of this.keysup){
            let index = this.keys.indexOf(i);
            while(index != -1){
                this.keys.splice(index, 1);
                index = this.keys.indexOf(i);
            }
        }
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
        return v2.dscale(this._position, this.meter_size);
    }
    constructor(meter_size){
        this._position = v2.new(0, 0);
        this.meter_size = meter_size;
    }
    bind(elem, canvas) {
        elem.addEventListener("mousemove", (e)=>{
            const rect = canvas.getBoundingClientRect();
            this._position = v2.new(e.x - rect.left, e.y - rect.top);
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
class ClientGameObject2D extends BaseGameObject2D {
    constructor(){
        super();
    }
    encodePart(_stream) {}
    decodePart(_stream) {}
    encodeComplete(_stream) {}
    decodeComplete(_stream) {}
}
class ClientGameObject3D extends BaseGameObject3D {
    constructor(){
        super();
    }
    encodePart(_stream) {}
    decodePart(_stream) {}
    encodeComplete(_stream) {}
    decodeComplete(_stream) {}
}
class FormGameObject2D extends ClientGameObject2D {
    constructor(){
        super();
    }
    render(camera, renderer) {
        this.hb.position = v2.sub(this.hb.position, camera.position);
        renderer.draw_hitbox2D(this.hb, this.color);
        this.hb.position = v2.add(this.hb.position, camera.position);
    }
}
class IMCGameObject3D extends ClientGameObject3D {
    constructor(){
        super();
    }
    render(camera, renderer) {
        renderer.color_draw_iso_model(this.model, v3.sub(this.position, camera.position), this.hb.transform.scale, v3.sub(this.rotation, camera.rotation), this.color, false, true);
    }
}
class ClientGame2D extends Game2D {
    camera = {
        position: v2.new(0, 0)
    };
    renderer;
    key;
    mouse;
    resource;
    constructor(keyl, mouse, resource, renderer, ...args){
        super(...args);
        this.mouse = mouse;
        this.key = keyl;
        this.renderer = renderer;
        this.resource = resource;
    }
    draw(renderer) {
        for(const c in this.scene.objects.objects){
            for (const o of this.scene.objects.objects[c].orden){
                this.scene.objects.objects[c].objects[o].render(this.camera, renderer);
            }
        }
    }
    update() {
        Game2D.prototype.update.call(this);
        this.draw(this.renderer);
        this.key.tick();
    }
}
class ClientGame3D extends Game3D {
    camera = {
        position: v3.new(0, 0, 0),
        rotation: v3.new(0, 0, 0)
    };
    renderer;
    key;
    mouse;
    resource;
    constructor(keyl, mouse, renderer, resource, ...args){
        super(...args);
        this.mouse = mouse;
        this.key = keyl;
        this.renderer = renderer;
        this.resource = resource;
    }
    draw(renderer) {
        for(const c in this.scene.objects.objects){
            for (const o of this.scene.objects.objects[c].orden){
                this.scene.objects.objects[c].objects[o].render(this.camera, renderer);
            }
        }
    }
    getCameraCenter(center) {
        return v3.sub(center, v3.new(this.renderer.canvas.width / 2 / this.renderer.meter_size, 0, -(this.renderer.canvas.height / 2 / this.renderer.meter_size)));
    }
    update() {
        Game3D.prototype.update.call(this);
        this.draw(this.renderer);
        this.key.tick();
    }
}
class ContainerSprite {
    pos;
    size;
    sprite;
    visible;
    childs;
    constructor(sprite, pos, size){
        this.pos = pos;
        this.sprite = sprite;
        this.size = size;
        this.childs = {};
        this.visible = true;
    }
    add_child(id, c) {
        this.childs[id] = c;
    }
    get_child(id) {
        return this._get_child(splitPath(id));
    }
    _get_child(id) {
        if (id.length === 1) {
            return this.childs[id[0]];
        }
        return this.childs[id[id.length - 1]]._get_child(id);
    }
    draw(camera, renderer) {
        if (!this.visible) {
            return;
        }
        renderer.draw_image2D(this.sprite, v2.sub(this.pos, camera.position), this.size);
        for (const c of Object.values(this.childs)){
            c.draw(camera, renderer);
        }
    }
}
export { ClientGameObject2D as ClientGameObject2D };
export { ClientGameObject3D as ClientGameObject3D };
export { FormGameObject2D as FormGameObject2D };
export { IMCGameObject3D as IMCGameObject3D };
export { ClientGame2D as ClientGame2D };
export { ClientGame3D as ClientGame3D };
export { ContainerSprite as ContainerSprite };
class Sprite {
    source;
    type = SourceType.Sprite;
    constructor(source){
        this.source = source;
    }
}
var SourceType;
(function(SourceType) {
    SourceType[SourceType["Sprite"] = 0] = "Sprite";
    SourceType[SourceType["Animation"] = 1] = "Animation";
    SourceType[SourceType["Sound"] = 2] = "Sound";
    SourceType[SourceType["Model3D"] = 3] = "Model3D";
})(SourceType || (SourceType = {}));
function getSvgUrl(svg) {
    return URL.createObjectURL(new Blob([
        svg
    ], {
        type: 'image/svg+xml'
    }));
}
class ResourcesManager {
    sources;
    canvas;
    ctx;
    audioCtx;
    domp = new DOMParser();
    dome = new XMLSerializer();
    constructor(){
        this.sources = {};
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.audioCtx = new AudioContext();
    }
    get_sprite(id) {
        return this.sources[id];
    }
    load_sprite(id, src) {
        return new Promise((resolve, _reject)=>{
            if (this.sources[id]) {
                resolve(this.sources[id]);
            }
            this.sources[id] = new Sprite(new Image());
            this.sources[id].source.onload = ()=>{
                resolve(this.sources[id]);
            };
            this.sources[id].source.src = src;
        });
    }
    load_svg(id, svg, scale = 1) {
        return new Promise((resolve, _reject)=>{
            if (this.sources[id]) {
                resolve(this.sources[id]);
            }
            svg.setAttribute("currentScale", scale.toString());
            const img = new Image();
            img.onload = ()=>{
                this.canvas.width = img.naturalWidth;
                this.canvas.height = img.naturalHeight;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(img, 0, 0);
                this.sources[id] = new Sprite(new Image());
                this.sources[id].source.onload = ()=>{
                    resolve(this.sources[id]);
                };
                this.sources[id].source.src = this.canvas.toDataURL();
            };
            img.src = getSvgUrl(this.dome.serializeToString(svg));
        });
    }
    get_audio(id) {
        return this.sources[id];
    }
    load_audio(id, def) {
        return new Promise((resolve, reject)=>{
            if (this.sources[id] != undefined) {
                resolve(this.sources[id]);
            }
            const xhr = new XMLHttpRequest();
            xhr.open("GET", def.src);
            xhr.responseType = "arraybuffer";
            const onfailure = function onfailure(_event) {
                reject(`Failed loading sound file: ${id}`);
            };
            xhr.addEventListener("load", (event)=>{
                const arrayBuffer = xhr.response;
                if (!arrayBuffer) {
                    onfailure(event);
                    return;
                }
                this.audioCtx.decodeAudioData(arrayBuffer, (audioBuffer)=>{
                    this.sources[id] = {
                        buffer: audioBuffer,
                        ...def,
                        type: SourceType.Sound
                    };
                    resolve(this.sources[id]);
                }, ()=>{
                    reject(`Failed decoding sound: ${id}`);
                });
            });
            xhr.addEventListener("abort", onfailure);
            xhr.addEventListener("error", onfailure);
            xhr.addEventListener("timeout", onfailure);
            xhr.send();
        });
    }
    get_animation(id) {
        return this.sources[id];
    }
    async load_animation(id, path) {
        const json = await (await fetch(path)).json();
        let anim;
        for (const k of Object.keys(json["keys"])){
            anim = {
                type: SourceType.Animation,
                keys: {}
            };
            anim.keys[k] = [];
            for (const f of json.keys){
                anim.keys[k].push({
                    ease: ease[f.ease],
                    delay: f.delay,
                    value: f.value,
                    dest: f.dest
                });
            }
        }
        this.sources[id] = anim;
        return this.sources[id];
    }
    load_model3D(id, path) {
        return new Promise((resolve, reject)=>{
            if (this.sources[id] != undefined) {
                resolve(this.sources[id]);
            }
            fetch(path).then((v)=>{
                return v.text();
            }).then((v)=>{
                let model = new Model3D();
                if (path.endsWith(".obj")) {
                    model = m3.parseObj(v);
                }
                Object.defineProperty(model, "type", {
                    value: SourceType.Model3D,
                    writable: false
                });
                resolve(model);
            }).catch(()=>{
                reject(`Failed loading model file: ${id}`);
            });
        });
    }
    get_model3D(id) {
        return this.sources[id];
    }
    unload(id) {
        delete this.sources[id];
    }
}
var AudioState;
(function(AudioState) {
    AudioState[AudioState["finished"] = 0] = "finished";
    AudioState[AudioState["playing"] = 1] = "playing";
    AudioState[AudioState["succeeded"] = 2] = "succeeded";
    AudioState[AudioState["failed"] = 3] = "failed";
    AudioState[AudioState["inited"] = 4] = "inited";
    AudioState[AudioState["interrupt"] = 5] = "interrupt";
})(AudioState || (AudioState = {}));
export { Sprite as Sprite };
export { SourceType as SourceType };
export { ResourcesManager as ResourcesManager };
export { AudioState as AudioState };
export { Client as Client, ConnectPacket as ConnectPacket, DefaultSignals as DefaultSignals, DisconnectPacket as DisconnectPacket };
export { WebglRenderer as WebglRenderer, Renderer as Renderer, RGBA as RGBA, createCanvas as createCanvas, applyBorder as applyBorder, applyShadow as applyShadow };
