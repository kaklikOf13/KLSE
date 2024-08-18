import { random } from "./random.ts"
export interface Vec2{
    x:number
    y:number
}

export interface Vec3 {
    x: number
    y: number
    z: number
}
export type RadAngle=number
export type DegAngle=number
function float32ToUint32(value: number): number {
    const floatView = new Float32Array(1)
    const intView = new Uint32Array(floatView.buffer)
    floatView[0] = value
    return intView[0]
}


const prime1 = BigInt("2654435761")
const prime2 = BigInt("2246822519")

export type HashVec2=bigint

export const v3 = Object.freeze({

    /**
     * Creates a new `Vec3`
     * * @param x The hortizontal (x-axis) coordinate
     * @param y The vertical (y-axis) coordinate
     * @param z The depth (y-axis) coordinate
     * @returns A new `Vec3` With X and Y and Z Cords
     * 
     */


    new(x: number, y: number, z: number): Vec3 {
        return {x, y, z}
    },

    random(min:number, max:number):Vec3 {
        return {x:random.float(min,max),y:random.float(min,max), z:random.float(min, max)}
    },
    random3(min:Vec3, max:Vec3):Vec3 {
        return {x:random.float(min.x,max.x),y:random.float(min.y,max.y), z:random.float(min.z, max.z)}
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns A new `Vec3` With `x`+`y`
     */
    add(x: Vec3, y: Vec3): Vec3 {
        return this.new(x.x+y.x, x.y+y.y, x.z+y.z)
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns A new `Vec3` With `x`-`y`
     */
    sub(x: Vec3, y: Vec3): Vec3 {
        return this.new(x.x-y.x, x.y-y.y, x.z-y.z)
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns A new `Vec3` With `x`*`y`
     */
    mult(x: Vec3, y: Vec3): Vec3 {
        return this.new(x.x*y.x, x.y*y.y, x.z*y.z)
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns A new `Vec3` With `x`/`y`
     */
    div(x: Vec3, y: Vec3): Vec3 {
        return this.new(x.x/y.x, x.y/y.y, x.z/y.z)
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns A new `Vec3` With `x`*`y`
     */
    scale(x: Vec3, y: number): Vec3 {
        return this.new(x.x*y, x.y*y, x.z*y)
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns A new `Vec3` With `x`/`y`
     */
    dscale(x: Vec3, y: number): Vec3 {
        return this.new(x.x/y, x.y/y, x.z/y)
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns `boolean` of operation `x`>`y`
     */
    greater(x:Vec3, y:Vec3):boolean {
        return x.x>y.x&&x.y>y.y&&x.z>y.z
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns `boolean` of operation `x`<`y`
     */
    less(x:Vec3, y:Vec3):boolean {
        return x.x<y.x&&x.y<y.y&&x.z<y.z
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns `boolean` of operation `x`==`y`
     */
    is(x:Vec3, y:Vec3):boolean {
        return x.x==y.x&&x.y==y.y&&x.z==y.z
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns `boolean` of operation `x`>`y`, true if any val of `x` > `y`
     */
    greaterOr(x:Vec3, y:Vec3):boolean {
        return x.x>y.x||x.y>y.y||x.z>y.z
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns `boolean` of operation `x`<`y`, true if any val of `x` < `y`
     */
    lessOr(x:Vec3, y:Vec3):boolean {
        return x.x<y.x&&x.y<y.y&&x.z<y.z
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns `boolean` of operation `x`==`y`, true if any val of `x` == `y`
     */
    isOr(x:Vec3, y:Vec3):boolean {
        return x.x==y.x&&x.y==y.y&&x.z==y.z
    },

    /**
     * 
     * @param Vec3 `Vec3`
     * @returns A new Absolute `Vec3`
     */
    absolute(Vec3:Vec3):Vec3{
        return this.new(Math.abs(Vec3.x),Math.abs(Vec3.y),Math.abs(Vec3.z))
    },
    /**
     * 
     * @param vec The Vector
     * @param decimalPlaces `number of max decimals`
     * @returns max decimal `Vec3`
     */
    maxDecimal(vec:Vec3,decimalPlaces:number=3):Vec3{
        const factor = Math.pow(10, decimalPlaces)
        return this.new(Math.round(vec.x * factor) / factor,Math.round(vec.y * factor) / factor,Math.round(vec.z * factor) / factor)
    },
    /**
     * 
     * @param vec `Vec3`
     * @returns Rounded`Vec3`
     */
    round(vec:Vec3):Vec3{
        return this.new(Math.round(vec.x),Math.round(vec.y),Math.round(vec.z))
    },

    /**
     * 
     * @param Vec3 `Vec3`
     * @param min `Limit`
     * @returns A new `Vec3` With Limit down. like `Math.max()`
     */
    min1(vec:Vec3,min:number):Vec3{
        return this.new(Math.max(vec.x,min),Math.max(vec.y,min),Math.max(vec.z,min))
    },
    /**
     * 
     * @param x `Vec3`
     * @param y `Limit`
     * @returns A new `Vec3` With Limit down. like `Math.max()`
     */
    min3(x:Vec3,y:Vec3):Vec3{
        return this.new(Math.max(x.x,y.x),Math.max(x.y,y.y),Math.max(x.z,y.z))
    },
    /**
     * 
     * @param Vec3 `Vec3`
     * @param max `Limit`
     * @returns A new `Vec3` With Limit up. like `Math.min()
     */
    max1(vec:Vec3,max:number):Vec3{
        return this.new(Math.min(vec.x,max),Math.min(vec.y,max),Math.min(vec.z,max))
    },
    /**
     * 
     * @param x `Vec3`
     * @param y `Limit`
     * @returns A new `Vec3` With Limit up. like `Math.min()
     */
    max3(x:Vec3,y:Vec3):Vec3{
        return this.new(Math.min(x.x,y.x),Math.min(x.y,y.y),Math.min(x.z,y.z))
    },

    /**
     * 
     * @param Vec3 `Vec3`
     * @param min `Min Limit`
     * @param max `Max Limit`
     * @returns A new `Vec3` With Limit
     */
    clamp1(vec:Vec3,min:number,max:number):Vec3{
        return this.new(Math.max(Math.min(vec.x,max),min),Math.max(Math.min(vec.y,max),min),Math.max(Math.min(vec.z,max),min))
    },
    /**
     * 
     * @param Vec3 `Vec3`
     * @param min `Min Limit`
     * @param max `Max Limit`
     * @returns A new `Vec3` With Limit
     */
    clamp3(vec:Vec3,min:Vec3,max:Vec3):Vec3{
        return this.new(Math.max(Math.min(vec.x,max.x),min.x),Math.max(Math.min(vec.y,max.y),min.y),Math.max(Math.min(vec.z,max.z),min.z))
    },

    /**
     * 
     * @param current The current `Vec3` Position
     * @param end The Final `Vec3` Position
     * @param interpolation 
     * @returns 
     */
    lerp(current: Vec3, end: Vec3,interpolation: number): Vec3 {
        return this.add(this.scale(current,1-interpolation), this.scale(end,interpolation))
    },

    /**
     * @param Vec2 The `Vec2` to normalize
     * @param fallback A `Vec2` to clone and return in case the normalization operation fails
     * @returns A `Vec2` whose length is 1 and is parallel to the original Vec2
     */
    normalizeSafe(vec:Vec3,fallback:Vec3=NullVec3):Vec3 {
        const eps = 0.000001
        const len = this.length(vec)
        return len > eps
            ? {
                x:vec.x/len,
                y:vec.y/len,
                z:vec.z/len
            }:this.duplicate(fallback)
    },
    /**
     * @param Vec3 The `Vec3` to normalize
     * @returns A `Vec3` whose length is 1 and is parallel to the original Vec2
     */
    normalize(vec:Vec3): Vec3 {
        const eps = 0.000001
        const len = this.length(vec)
        return len > eps
            ? {
                x:vec.x/len,
                y:vec.y/len,
                z:vec.z/len
            }: this.duplicate(vec)
    },
    /**
     * 
     * @param Vec3 The `Vec3` To Duplication
     * @returns The Duplicated Vec3
     */
    duplicate(Vec3:Vec3):Vec3{
        return this.new(Vec3.x,Vec3.y,Vec3.z)
    },

    neg(Vec3:Vec3):Vec3{
        return this.new(-Vec3.x,-Vec3.y,-Vec3.z)
    },

    /**
     * @param vec `Vec3`
     * @returns A new `Vec3` With squared of `Vec3`
     */
    squared(vec:Vec3):number{
        return vec.x*vec.x+vec.y*vec.y+vec.z*vec.z
    },
    dot(x: Vec3, y: Vec3): number {
        return x.x * y.x + x.y * y.y + x.z * y.z;
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns A new `Vec2` With distance of `Vec31` and `Vec32`
     */
    distanceSquared(x:Vec3,y:Vec3):number{
        const dx=x.x-y.x
        const dy=x.y-y.y
        const dz=x.z-y.z
        return dx*dx+dy*dy+dz*dz
    },
    /**
     * @param x `Vec31`
     * @param y `Vec32`
     * @returns A new `Vec3` With distance squared of `Vec31` and `Vec32`
     */
    distance(x:Vec3,y:Vec3):number{
        const dx=x.x-y.x
        const dy=x.y-y.y
        const dz=x.z-y.z
        return Math.sqrt(dx*dx+dy*dy+dz*dz)
    },
    cross(vec: Vec3, other: Vec3):Vec3{
        return v3.new(vec.y * other.z - vec.z * other.y, vec.z * other.x - vec.x * other.z, vec.x * other.y - vec.y * other.x);
    },
    /**
     * 
     * @param Vec2 `Vec3`
     * @returns A new Interger `Vec3`
     */
    floor(Vec2:Vec3):Vec3{
        return this.new(Math.floor(Vec2.x),Math.floor(Vec2.y),Math.floor(Vec2.z))
    },
    /**
     * 
     * @param Vec3 `Vec3`
     * @returns A new Ceil `Vec3`
     */
    ceil(Vec2:Vec3):Vec3{
        return this.new(Math.ceil(Vec2.x),Math.ceil(Vec2.y),Math.ceil(Vec2.z))
    },
    /**
     * @param Vec3 The `Vec3` used in lenght
     * @returns 
     */
    length(Vec3: Vec3): number {
        return Math.sqrt(this.squared(Vec3))
    },
})

export const v2 = Object.freeze({
    /**
     * Creates a new `Vec2`
     * @param x The horizontal (x-axis) coordinate
     * @param y The vertical (y-axis) coordinate
     * @returns A new `Vec2` With X and Y Cords
     */
    new(x:number, y:number): Vec2 {
        return {x, y}
    },
    /**
     * Return Random Vec2
     */
    random(min:number, max:number):Vec2 {
        return {x:random.float(min,max),y:random.float(min,max)}
    },
    random2(min:Vec2, max:Vec2):Vec2 {
        return {x:random.float(min.x,max.x),y:random.float(min.y,max.y)}
    },
    /**
     * @param x `Vec21`
     * @param y `Vec22`
     * @returns A new `Vec2` With `x`+`y`
     */
    add(x:Vec2, y:Vec2):Vec2 {
        return this.new(x.x+y.x,x.y+y.y)
    },
    /**
     * @param x `Vec21`
     * @param y `Vec22`
     * @returns A new `Vec2` With `x`-`y`
     */
    sub(x:Vec2, y:Vec2):Vec2 {
        return this.new(x.x-y.x,x.y-y.y)
    },
    /**
     * @param x `Vec21`
     * @param y `Vec22`
     * @returns A new `Vec2` With `x`*`y`
     */
    mult(x:Vec2, y:Vec2):Vec2 {
        return this.new(x.x*y.x,x.y*y.y)
    },
    /**
     * @param x `Vec21`
     * @param y `Vec22`
     * @returns A new `Vec2` With `x`/`y`
     */
    div(x:Vec2, y:Vec2):Vec2 {
        return this.new(x.x/y.x,x.y/y.y)
    },
    /**
     * @param x `Vec21`
     * @param y `Vec22`
     * @returns `boolean` of operation `x`>`y`
     */
    greater(x:Vec2, y:Vec2):boolean {
        return x.x>y.x&&x.y>y.y
    },
    /**
     * @param x `Vec21`
     * @param y `Vec22`
     * @returns `boolean` of operation `x`<`y`
     */
    less(x:Vec2, y:Vec2):boolean {
        return x.x<y.x&&x.y<y.y
    },
    /**
     * @param x `Vec21`
     * @param y `Vec22`
     * @returns `boolean` of operation `x`==`y`
     */
    is(x:Vec2, y:Vec2):boolean {
        return x.x==y.x&&x.y==y.y
    },
    /**
     * @param Vec2 `Vec2`
     * @param scale `Scale`
     * @returns A new `Vec2` With `Vec2`*`scale`
     */
    scale(Vec2:Vec2, scale:number):Vec2 {
        return this.new(Vec2.x*scale,Vec2.y*scale)
    },
    /**
     * @param Vec2 `Vec2`
     * @param dscale `DeScale`
     * @returns A new `Vec2` With `Vec2`/`dscale`
     */
    dscale(Vec2:Vec2, dscale:number):Vec2 {
        return this.new(Vec2.x/dscale,Vec2.y/dscale)
    },
    /**
     * 
     * @param Vec2 `Vec2`
     * @param min `Limit`
     * @returns A new `Vec2` With Limit down 
     */
    min1(Vec2:Vec2,min:number):Vec2{
        return this.new(Math.max(Vec2.x,min),Math.max(Vec2.y,min))
    },
    /**
     * 
     * @param x `Vec2`
     * @param y `Limit`
     * @returns A new `Vec2` With Limit down
     */
    min2(x:Vec2,y:Vec2):Vec2{
        return this.new(Math.max(x.x,y.x),Math.max(x.y,y.y))
    },
    /**
     * 
     * @param Vec2 `Vec2`
     * @param max `Limit`
     * @returns A new `Vec2` With Limit down 
     */
    max1(Vec2:Vec2,max:number):Vec2{
        return this.new(Math.min(Vec2.x,max),Math.min(Vec2.y,max))
    },
    /**
     * 
     * @param x `Vec2`
     * @param y `Limit`
     * @returns A new `Vec2` With Limit up
     */
    max2(x:Vec2,y:Vec2):Vec2{
        return this.new(Math.min(x.x,y.x),Math.min(x.y,y.y))
    },

    /**
     * 
     * @param Vec2 `Vec2`
     * @param min `Min Limit`
     * @param max `Max Limit`
     * @returns A new `Vec2` With Limit
     */
    clamp1(Vec2:Vec2,min:number,max:number):Vec2{
        return this.new(Math.max(Math.min(Vec2.x,max),min),Math.max(Math.min(Vec2.y,max),min))
    },
    /**
     * 
     * @param Vec2 `Vec2`
     * @param min `Min Limit`
     * @param max `Max Limit`
     * @returns A new `Vec2` With Limit
     */
    clamp2(Vec2:Vec2,min:Vec2,max:Vec2):Vec2{
        return this.new(Math.max(Math.min(Vec2.x,max.x),min.x),Math.max(Math.min(Vec2.y,max.y),min.y))
    },
    /**
     * 
     * @param vec The Vector
     * @param decimalPlaces `number of max decimals`
     * @returns max decimal `Vec2`
     */
    maxDecimal(vec:Vec2,decimalPlaces:number=3):Vec2{
        const factor = Math.pow(10, decimalPlaces)
        return this.new(Math.round(vec.x * factor) / factor,Math.round(vec.y * factor) / factor)
    },
    /**
     * 
     * @param vec `Vec2`
     * @returns Rounded`Vec2`
     */
    round(vec:Vec2):Vec2{
        return this.new(Math.round(vec.x),Math.round(vec.y))
    },
    /**
     * @param x `Vec21`
     * @param y `Vec22`
     * @returns A `RadAngle` of 2 Vec2s
     */
    lookTo(x:Vec2, y:Vec2):RadAngle {
        return Math.atan2(y.y-x.y,y.x-x.x)
    },
    /**
     * 
     * @param angle `Radians Angle`
     * @returns A new `Vec2` With angle pos
     */
    from_RadAngle(angle:RadAngle):Vec2 {
        return this.new(Math.cos(angle),Math.sin(angle) )
    },
    /**
     * 
     * @param angle `Degrese Angle`
     * @returns A new `Vec2` With angle pos
     */
    from_DegAngle(angle:DegAngle):Vec2 {
        const a=Angle.deg2rad(angle)
        return this.new(Math.cos(a),Math.sin(a))
    },
    /**
     * @param x `Vec21`
     * @param y `Vec22`
     * @returns A new `Vec2` With distance of `Vec21` and `Vec22`
     */
    distanceSquared(x:Vec2,y:Vec2):number{
        const dx=x.x-y.x
        const dy=x.y-y.y
        return dx*dx+dy*dy
    },
    /**
     * @param x `Vec21`
     * @param y `Vec22`
     * @returns A new `Vec2` With distance squared of `Vec21` and `Vec22`
     */
    distance(x:Vec2,y:Vec2):number{
        const dx=x.x-y.x
        const dy=x.y-y.y
        return Math.sqrt(dx*dx+dy*dy)
    },
    /**
     * @param Vec2 `Vec2`
     * @returns A new `Vec2` With squared of `Vec21`
     */
    squared(Vec2:Vec2):number{
        return Vec2.x*Vec2.x+Vec2.y*Vec2.y
    },
    dot(x: Vec2, y: Vec2): number {
        return x.x * y.x + x.y * y.y;
    },
    /**
     * @param Vec2 The `Vec2` used in lenght
     * @returns 
     */
    length(Vec2: Vec2): number {
        return Math.sqrt(v2.squared(Vec2))
    },
    
    /**
     * 
     * @param Vec2 `Vec2`
     * @returns A new Absolute `Vec2`
     */
    absolute(Vec2:Vec2):Vec2{
        return this.new(Math.abs(Vec2.x),Math.abs(Vec2.y))
    },
    /**
     * 
     * @param Vec2 `Vec3`
     * @returns A new Interger `Vec3`
     */
    floor(Vec2:Vec2):Vec2{
        return this.new(Math.floor(Vec2.x),Math.floor(Vec2.y))
    },
    /**
     * 
     * @param Vec2 `Vec3`
     * @returns A new Ceil `Vec3`
     */
    ceil(Vec2:Vec2):Vec2{
        return this.new(Math.ceil(Vec2.x),Math.ceil(Vec2.y))
    },
    neg(Vec2:Vec2):Vec2{
        return this.new(-Vec2.x,-Vec2.y)
    },
    /**
     * 
     * @param current The current `Vec2` Position
     * @param end The Final `Vec2` Position
     * @param interpolation 
     * @returns 
     */
    lerp(current: Vec2, end: Vec2,interpolation: number): Vec2 {
        return this.add(v2.scale(current,1-interpolation), this.scale(end,interpolation))
    },
    /**
     * @param Vec2 The `Vec2` to normalize
     * @param fallback A `Vec2` to clone and return in case the normalization operation fails
     * @returns A `Vec2` whose length is 1 and is parallel to the original Vec2
     */
    normalizeSafe(Vec2:Vec2,fallback:Vec2=NullVec2):Vec2 {
        const eps = 0.000001
        const len = this.length(Vec2)
        return len > eps
            ? {
                x:Vec2.x/len,
                y:Vec2.y/len
            }:this.duplicate(fallback)
    },
    /**
     * @param Vec2 The `Vec2` to normalize
     * @returns A `Vec2` whose length is 1 and is parallel to the original Vec2
     */
    normalize(Vec2:Vec2): Vec2 {
        const eps = 0.000001
        const len = v2.length(Vec2)
        return eps
            ? {
                x:Vec2.x/len,
                y:Vec2.y/len
            }: v2.duplicate(Vec2)
    },
    /**
     * 
     * @param Vec2 The `Vec2` To Duplication
     * @returns The Duplicated Vec2
     */
    duplicate(Vec2:Vec2):Vec2{
        return this.new(Vec2.x,Vec2.y)
    },
    /**
     * 
     * @param Vec2 The `Vec2` To hash
     * @returns Hashed Vec2
     */
    hash(Vec2:Vec2):HashVec2{
        let hash = BigInt(float32ToUint32(Vec2.x))
        hash = (hash * prime1) & BigInt("4294967295")
        hash ^= BigInt(float32ToUint32(Vec2.y))
        hash = (hash * prime2) & BigInt("4294967295")
        return hash
    },
    toString(Vec2:Vec2):string{
        return `{${Vec2.x},${Vec2.y}}`
    }
})
export const NullVec2:Vec2=v2.new(0,0)
export const NullVec3:Vec3=v3.new(0,0,0)
export interface Transform3D{
    position:Vec3
    rotation:Vec3
    scale:Vec3
}
export const Angle=Object.freeze({
    deg2rad(angle:DegAngle):RadAngle{
        return angle* Math.PI / 180
    },
    rad2deg(angle:RadAngle):DegAngle {
        return angle * 180 / Math.PI
    }
})