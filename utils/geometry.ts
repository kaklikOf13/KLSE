
export interface Vector{
    x:number
    y:number
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

export type HashVector=bigint

export const Vec = Object.freeze({
    /**
     * Creates a new `Vector`
     * @param x The horizontal (x-axis) coordinate
     * @param y The vertical (y-axis) coordinate
     * @returns A new `Vector` With X and Y Cords
     */
    new(x:number, y:number):Vector {
        return {x, y}
    },
    /**
     * @param x `Vector1`
     * @param y `Vector2`
     * @returns A new `Vector` With `x`+`y`
     */
    add(x:Vector, y:Vector):Vector {
        return this.new(x.x+y.x,x.y+y.y)
    },
    /**
     * @param x `Vector1`
     * @param y `Vector2`
     * @returns A new `Vector` With `x`-`y`
     */
    sub(x:Vector, y:Vector):Vector {
        return this.new(x.x-y.x,x.y-y.y)
    },
    /**
     * @param x `Vector1`
     * @param y `Vector2`
     * @returns A new `Vector` With `x`*`y`
     */
    mult(x:Vector, y:Vector):Vector {
        return this.new(x.x*y.x,x.y*y.y)
    },
    /**
     * @param x `Vector1`
     * @param y `Vector2`
     * @returns A new `Vector` With `x`/`y`
     */
    div(x:Vector, y:Vector):Vector {
        return this.new(x.x/y.x,x.y/y.y)
    },
    /**
     * @param x `Vector1`
     * @param y `Vector2`
     * @returns `boolean` of operation `x`>`y`
     */
    greater(x:Vector, y:Vector):boolean {
        return x.x>y.x&&x.y>y.y
    },
    /**
     * @param x `Vector1`
     * @param y `Vector2`
     * @returns `boolean` of operation `x`<`y`
     */
    less(x:Vector, y:Vector):boolean {
        return x.x<y.x&&x.y<y.y
    },
    /**
     * @param vector `Vector`
     * @param scale `Scale`
     * @returns A new `Vector` With `Vector`*`scale`
     */
    scale(vector:Vector, scale:number):Vector {
        return this.new(vector.x*scale,vector.y*scale)
    },
    /**
     * @param vector `Vector`
     * @param dscale `DeScale`
     * @returns A new `Vector` With `Vector`/`dscale`
     */
    dscale(vector:Vector, dscale:number):Vector {
        return this.new(vector.x/dscale,vector.y/dscale)
    },
    /**
     * 
     * @param vector `Vector`
     * @param min `Limit`
     * @returns A new `Vector` With Limit down 
     */
    min1(vector:Vector,min:number):Vector{
        return this.new(Math.max(vector.x,min),Math.max(vector.y,min))
    },
    /**
     * 
     * @param x `Vector`
     * @param y `Limit`
     * @returns A new `Vector` With Limit down
     */
    min2(x:Vector,y:Vector):Vector{
        return this.new(Math.max(x.x,y.x),Math.max(x.y,y.y))
    },
    /**
     * 
     * @param vector `Vector`
     * @param max `Limit`
     * @returns A new `Vector` With Limit down 
     */
    max1(vector:Vector,max:number):Vector{
        return this.new(Math.min(vector.x,max),Math.min(vector.y,max))
    },
    /**
     * 
     * @param x `Vector`
     * @param y `Limit`
     * @returns A new `Vector` With Limit up
     */
    max2(x:Vector,y:Vector):Vector{
        return this.new(Math.min(x.x,y.x),Math.min(x.y,y.y))
    },

    /**
     * 
     * @param vector `Vector`
     * @param min `Min Limit`
     * @param max `Max Limit`
     * @returns A new `Vector` With Limit
     */
    clamp1(vector:Vector,min:number,max:number):Vector{
        return this.new(Math.max(Math.min(vector.x,max),min),Math.max(Math.min(vector.y,max),min))
    },
    /**
     * 
     * @param vector `Vector`
     * @param min `Min Limit`
     * @param max `Max Limit`
     * @returns A new `Vector` With Limit
     */
    clamp2(vector:Vector,min:Vector,max:Vector):Vector{
        return this.new(Math.max(Math.min(vector.x,max.x),min.x),Math.max(Math.min(vector.y,max.y),min.y))
    },
    /**
     * @param x `Vector1`
     * @param y `Vector2`
     * @returns A `RadAngle` of 2 Vectors
     */
    lookTo(x:Vector, y:Vector):RadAngle {
        return Math.atan2(x.y-y.y,x.x-y.x)
    },
    /**
     * 
     * @param angle `Radians Angle`
     * @returns A new `Vector` With angle pos
     */
    from_RadAngle(angle:RadAngle):Vector {
        return this.new(Math.cos(angle),Math.sin(angle) )
    },
    /**
     * 
     * @param angle `Degrese Angle`
     * @returns A new `Vector` With angle pos
     */
    from_DegAngle(angle:DegAngle):Vector {
        const a=Angle.deg2rad(angle)
        return this.new(Math.cos(a),Math.sin(a))
    },
    /**
     * @param x `Vector1`
     * @param y `Vector2`
     * @returns A new `Vector` With distance of `Vector1` and `Vector2`
     */
    distance(x:Vector,y:Vector):number{
        const dx=x.x-y.x
        const dy=x.y-y.y
        return Math.sqrt(dx*dx+dy*dy)
    },
    /**
     * @param vector `Vector`
     * @returns A new `Vector` With squared of `Vector1`
     */
    squared(vector:Vector):number{
        return vector.x*vector.x+vector.y*vector.y
    },
    /**
     * @param vector The `Vector` used in lenght
     * @returns 
     */
    length(vector: Vector): number {
        return Math.sqrt(Vec.squared(vector))
    },
    
    /**
     * 
     * @param vector `Vector`
     * @returns A new Absolute `Vector`
     */
    absolute(vector:Vector):Vector{
        return this.new(Math.abs(vector.x),Math.abs(vector.y))
    },
    /**
     * 
     * @param vector `Vector`
     * @returns A new Interger `Vector`
     */
    floor(vector:Vector):Vector{
        return this.new(Math.floor(vector.x),Math.floor(vector.y))
    },
    /**
     * 
     * @param current The current `Vector` Position
     * @param end The Final `Vector` Position
     * @param interpolation 
     * @returns 
     */
    lerp(current: Vector, end: Vector,interpolation: number): Vector {
        return Vec.add(Vec.scale(current,1-interpolation), Vec.scale(end,interpolation))
    },
    /**
     * @param vector The `Vector` to normalize
     * @param fallback A `Vector` to clone and return in case the normalization operation fails
     * @returns A `Vector` whose length is 1 and is parallel to the original vector
     */
    normalizeSafe(vector:Vector,fallback:Vector=NullVector):Vector {
        fallback ??= this.new(1.0, 0.0)
        const eps = 0.000001
        const len = Vec.length(vector)
        return len > eps
            ? {
                x:vector.x/len,
                y:vector.y/len
            }:Vec.duplicate(fallback)
    },
    /**
     * @param vector The `Vector` to normalize
     * @returns A `Vector` whose length is 1 and is parallel to the original vector
     */
    normalize(vector:Vector): Vector {
        const eps = 0.000001
        const len = Vec.length(vector)
        return eps
            ? {
                x:vector.x/len,
                y:vector.y/len
            }: Vec.duplicate(vector)
    },
    /**
     * 
     * @param vector The `Vector` To Duplication
     * @returns The Duplicated Vector
     */
    duplicate(vector:Vector):Vector{
        return this.new(vector.x,vector.y)
    },
    /**
     * 
     * @param vector The `Vector` To hash
     * @returns Hashed Vector
     */
    hash(vector:Vector):HashVector{
        let hash = BigInt(float32ToUint32(vector.x))
        hash = (hash * prime1) & BigInt("4294967295")
        hash ^= BigInt(float32ToUint32(vector.y))
        hash = (hash * prime2) & BigInt("4294967295")
        return hash
    },
    toString(vector:Vector):string{
        return `{${vector.x},${vector.y}}`
    }
})
export const NullVector:Vector=Vec.new(0,0)
export const Angle=Object.freeze({
    deg2rad(angle:DegAngle):RadAngle{
        return angle* Math.PI / 180
    },
    rad2deg(angle:RadAngle):DegAngle {
        return angle * 180 / Math.PI
    }
})