// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function random_id() {
    return Math.floor(Math.random() * 4294967296);
}
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
function hasTag(tags, tag) {
    return tags.includes(tag);
}
function hasTags(tags1, tags2) {
    for (const t of tags1){
        if (tags2.includes(t)) {
            return true;
        }
    }
    return false;
}
function combineWithoutEqual(...arrays) {
    const resultado = [];
    for (const array of arrays){
        for (const elemento of array){
            if (!resultado.includes(elemento)) {
                resultado.push(elemento);
            }
        }
    }
    return resultado;
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
class Definitions {
    value;
    constructor(){
        this.value = {};
    }
    get(name = "") {
        return this.value[name];
    }
    define(value, name = "") {
        Object.defineProperty(this.value, name, {
            value: value
        });
    }
    delete(name) {
        delete this.value[name];
    }
    list() {
        return Object.keys(this.value);
    }
}
class Tree extends Definitions {
    childs;
    constructor(){
        super();
        this.childs = {};
    }
    define_tree(name) {
        Object.defineProperty(this.childs, name, {
            value: new Tree
        });
        return this.childs[name];
    }
    get_tree(name) {
        return this.childs[name];
    }
    delete_tree(name) {
        delete this.childs[name];
    }
    list_tree() {
        return Object.keys(this.childs);
    }
    exist_tree(tree) {
        return this.childs[tree] != undefined;
    }
    get_item(name) {
        const divisions = splitPath(name);
        let act = this;
        for(let i = 0; i < divisions.length; i++){
            const d = divisions[i];
            if (act.exist_tree(d)) {
                act = this.get_tree(d);
            } else if (act.value[d] != undefined) {
                return act.value[d];
            } else {
                return undefined;
            }
        }
    }
}
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
class ExtendedMap extends Map {
    _get(key) {
        return super.get(key);
    }
    getAndSetIfAbsent(key, fallback) {
        if (this.has(key)) return this.get(key);
        this.set(key, fallback);
        return fallback;
    }
    getAndGetDefaultIfAbsent(key, fallback) {
        if (this.has(key)) return this.get(key);
        const value = fallback();
        this.set(key, value);
        return value;
    }
    ifPresent(key, callback) {
        this.ifPresentOrElse(key, callback, ()=>{});
    }
    ifPresentOrElse(key, callback, ifAbsent) {
        const mappingPresent = super.has(key);
        if (!mappingPresent) {
            return ifAbsent();
        }
        callback(this._get(key));
    }
    mapIfPresent(key, mapper) {
        if (!super.has(key)) return undefined;
        return mapper(this._get(key));
    }
}
export { Definitions as Definitions };
export { Tree as Tree };
export { Server as Server };
export { ExtendedMap as ExtendedMap };
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
class BaseGameObject {
    hb;
    destroyed;
    id;
    parent;
    overlaps;
    collides;
    category;
    get position() {
        return this.hb ? this.hb.position : NullVector;
    }
    constructor(){
        this.category = "";
        this.hb = new NullHitbox();
        this.destroyed = false;
        this.id = 0;
        this.parent = null;
        this.overlaps = [];
        this.collides = [];
    }
    on_collide_with(_obj) {}
    on_overlap_with(_obj) {}
    copy() {
        return Object.assign({}, this);
    }
}
function newObjectKey(category, id) {
    return {
        category: category,
        id: id
    };
}
class SimpleGameObjectsManager {
    categorys;
    constructor(){
        this.categorys = {};
    }
    after_update() {}
    begin_update() {}
    update() {
        this.begin_update();
        for(const c in this.categorys){
            for(let j = 0; j < this.categorys[c].orden.length; j++){
                const i = this.categorys[c].orden[j];
                this.categorys[c].objs[i].update();
                if (this.categorys[c].objs[i].destroyed) {
                    this.categorys[c].orden.splice(j, 1);
                    delete this.categorys[c].objs[i];
                    j -= 1;
                    continue;
                }
                this.update_object(newObjectKey(c, i));
            }
        }
        return this.after_update();
    }
    update_object(obj) {
        const obji = this.categorys[obj.category].objs[obj.id];
        const a = combineWithoutEqual(obji.collides, obji.overlaps);
        for (const c2 of a){
            for (const [_j2, i2] of this.categorys[c2].orden.entries()){
                this.solve_collision_normal(obj, newObjectKey(c2, i2));
                this.solve_collision_overlap(obj, newObjectKey(c2, i2));
            }
        }
    }
    solve_collision_overlap(objA, objB) {
        if (!(objA.id == objB.id && objA.category == objB.category) && this.categorys[objA.category].objs[objA.id].hb.overlapCollision(this.categorys[objB.category].objs[objB.id].hb)) {
            this.categorys[objA.category].objs[objA.id].on_overlap_with(this.categorys[objB.category].objs[objB.id]);
        }
    }
    solve_collision_normal(objA, objB) {
        if (!(objA.id == objB.id && objA.category == objB.category) && this.categorys[objA.category].objs[objA.id].hb.collidingWith(this.categorys[objB.category].objs[objB.id].hb)) {
            this.categorys[objA.category].objs[objA.id].on_collide_with(this.categorys[objB.category].objs[objB.id]);
        }
    }
    add_object(category, obj, id) {
        if (id === undefined) {
            id = random_id();
        }
        obj.id = id;
        obj.parent = this;
        obj.category = category;
        this.categorys[category].objs[id] = obj;
        this.categorys[category].orden.push(id);
    }
    get_object(category, id) {
        return this.categorys[category].objs[id];
    }
    exist_object(category, id) {
        return Object.hasOwn(this.categorys[category].objs, id);
    }
    add_category(name) {
        this.categorys[name] = {
            objs: {},
            orden: []
        };
    }
}
class CellsGameObjectsManager extends SimpleGameObjectsManager {
    cells;
    cellSize;
    threads;
    constructor(threads = 5, cellSize = 32){
        super();
        this.threads = threads;
        this.cellSize = cellSize;
        this.cells = new Map();
    }
    begin_update() {
        this.cells.clear();
    }
    after_update() {
        const promisses = [];
        const ckeys = Array.from(this.cells.keys());
        const nf = Math.ceil(ckeys.length / this.threads);
        const nff = ckeys.length / nf;
        for(let p = 0; p < this.threads; p++){
            if ((p + 1) * nff >= ckeys.length) {
                promisses.push(this.update_especific_cells(ckeys.slice(p * nff, ckeys.length)));
            } else {
                promisses.push(this.update_especific_cells(ckeys.slice(p * nff, (p + 1) * nff)));
            }
        }
        return Promise.all(promisses);
    }
    update_object(obj) {
        const c = Vec.floor(Vec.dscale(this.categorys[obj.category].objs[obj.id].position, this.cellSize));
        const ch = Vec.hash(c);
        if (this.cells.get(ch)) {
            this.cells.get(ch).objs[obj.category].push(obj.id);
        } else {
            this.cells.set(ch, {
                objs: {
                    [obj.category]: [
                        obj.id
                    ]
                },
                pos: c
            });
        }
    }
    update_especific_cells(keys) {
        return new Promise((resolve, _reject)=>{
            for (const cc of keys){
                this.update_cell(cc);
            }
            resolve();
        });
    }
    update_cell(c) {
        const cp = this.cells.get(c).pos;
        for(let yy = -1; yy <= 1; yy++){
            for(let xx = -1; xx <= 1; xx++){
                const oc = Vec.new(cp.x + xx, cp.y + yy);
                const och = Vec.hash(oc);
                if (this.cells.get(och)) {
                    for (const cat1 of Object.keys(this.cells.get(c).objs)){
                        if (!this.cells.get(c).objs[cat1]) continue;
                        for (const objA of this.cells.get(c).objs[cat1]){
                            const objAk = newObjectKey(cat1, objA);
                            for (const cat2 of this.categorys[cat1].objs[objA].collides){
                                if (this.cells.get(c).objs[cat2]) {
                                    for (const objB of this.cells.get(c).objs[cat2]){
                                        this.solve_collision_normal(objAk, newObjectKey(cat2, objB));
                                    }
                                }
                            }
                            for (const cat2 of this.categorys[cat1].objs[objA].overlaps){
                                if (this.cells.get(c).objs[cat2]) {
                                    for (const objB of this.cells.get(c).objs[cat2]){
                                        this.solve_collision_overlap(objAk, newObjectKey(cat2, objB));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
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
class GamePlugin {
}
class Game extends CellsGameObjectsManager {
    tps;
    clock;
    running = true;
    events;
    constructor(tps, thread, chunksize){
        super(thread, chunksize);
        this.tps = tps;
        this.events = new SignalManager();
        this.clock = new Clock(tps, 1);
    }
    update() {
        CellsGameObjectsManager.prototype.update.call(this);
        this.events.emit(GenericEvents.GameTick);
        this.clock.tick(this.update.bind(this));
    }
    mainloop() {
        return new Promise((resolve)=>{
            this.events.emit(GenericEvents.GameStart);
            this.update();
            resolve();
        });
    }
}
export { CATEGORYS as CATEGORYS };
export { GenericEvents as GenericEvents };
export { GamePlugin as GamePlugin };
export { Game as Game };
class Item {
    limit_per_slot = 1;
    tags = [];
}
class Slot {
    item;
    quantity;
    accept_tags;
    constructor(accept_tags = []){
        this.accept_tags = accept_tags;
        this.quantity = 0;
        this.item = null;
    }
    add(item, quantity = 1) {
        if (this.item == null) {
            if (this.accept_tags.length == 0 || hasTags(this.accept_tags, item.tags)) {
                this.item = item;
            } else {
                return quantity;
            }
        } else if (!this.item.is(item)) {
            return quantity;
        }
        const add = this.quantity + quantity;
        const ret = Math.max(add - this.item.limit_per_slot, 0);
        this.quantity = add - ret;
        return ret;
    }
    remove(quantity) {
        if (this.item == null) {
            return quantity;
        }
        this.quantity -= quantity;
        const ret = Math.max(-this.quantity, 0);
        if (ret != 0) {
            this.item = null;
            this.quantity = 0;
        }
        return ret;
    }
}
class Inventory {
    slots;
    constructor(slots_quatity = 10){
        this.slots = [];
        for(let i = 0; i < slots_quatity; i++){
            this.slots.push(new Slot());
        }
    }
    add(item, quantity = 1) {
        let ret = quantity;
        for(const i in this.slots){
            ret = this.slots[i].add(item, ret);
            if (ret == 0) {
                break;
            }
        }
        return ret;
    }
    consume(item, quantity = 1) {
        const has_slots = [];
        let has = 0;
        for(const i in this.slots){
            if (this.slots[i].item != null && this.slots[i].item.is(item)) {
                has = Math.min(has + this.slots[i].quantity, quantity);
                has_slots.push(parseInt(i));
                if (has == quantity) {
                    for (const j of has_slots){
                        has = this.slots[j].remove(has);
                        if (has == 0) {
                            break;
                        }
                    }
                    return true;
                }
            }
        }
        return false;
    }
    remove(item, quantity = 1) {
        let ret = quantity;
        for(const i in this.slots){
            if (this.slots[i].item != null && this.slots[i].item.is(item)) {
                ret = this.slots[i].remove(ret);
                if (ret == 0) {
                    break;
                }
            }
        }
        return ret;
    }
    consumeTag(tag, quantity = 1) {
        const has_slots = [];
        let has = 0;
        for(const i in this.slots){
            if (this.slots[i].item != null && hasTag(this.slots[i].item, tag)) {
                has = Math.min(has + this.slots[i].quantity, quantity);
                has_slots.push(parseInt(i));
                if (has == quantity) {
                    for (const j of has_slots){
                        has = this.slots[j].remove(has);
                        if (has == 0) {
                            break;
                        }
                    }
                    return true;
                }
            }
        }
        return false;
    }
    removeTag(tag, quantity = 1) {
        let ret = quantity;
        for(const i in this.slots){
            if (this.slots[i].item != null && hasTag(this.slots[i].item, tag)) {
                ret = this.slots[i].remove(ret);
                if (ret == 0) {
                    break;
                }
            }
        }
        return ret;
    }
}
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
class PacketsManager {
    packets;
    constructor(){
        this.packets = new Map();
        this.add_packet(ConnectPacket);
        this.add_packet(DisconnectPacket);
    }
    encode(packet, stream) {
        if (!stream) {
            stream = new NetStream();
        }
        stream.writeUInt16(packet.ID);
        packet.encode(stream);
        return stream;
    }
    decode(stream) {
        const id = stream.readUInt16();
        if (this.packets.get(id)) {
            const pt = this.packets.get(id);
            const p = new pt();
            p.decode(stream);
            p._size = stream.pos;
            return p;
        } else {
            throw new Error(`the Packet ${id} dont exist`);
        }
    }
    add_packet(pack) {
        const p = new pack();
        this.packets.set(p.ID, pack);
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
export { Packet as Packet };
export { PacketsManager as PacketsManager };
export { ConnectPacket as ConnectPacket };
export { DisconnectPacket as DisconnectPacket };
function random_int(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function random_float(min, max) {
    return Math.random() * (max - min) + min;
}
export { random_int as random_int };
export { random_float as random_float };
export { BaseGameObject as BaseGameObject, CellsGameObjectsManager as GameObjectsManager };
export { Vec as Vec, Angle as Angle, NullVector as NullVector };
export { CircleHitbox as CircleHitbox, RectHitbox as RectHitbox, HitboxType as HitboxType };
export { Inventory as Inventory, Slot as Slot, Item as Item };
export { NetStream as NetStream };
