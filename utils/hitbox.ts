import { NullVec2, Vec2, v2 } from "./geometry.ts"
import { random } from "./random.ts";

export const Collision=Object.freeze({
    circle_with_rect(hb1:CircleHitbox,hb2:RectHitbox):boolean{
        const cp=v2.clamp2(hb1.position,hb2.position,v2.add(hb2.position,hb2.size))
        const dist=v2.distance(hb1.position,cp)
        return (dist<hb1.radius*hb1.radius)||((hb1.position.x>=hb2.position.x&&hb1.position.x<=hb2.position.x+hb2.size.x)&&(hb1.position.x>=hb2.position.x&&hb1.position.x<=hb2.position.x+hb2.size.x))
    },
    circle_with_rect_ov(hb1:CircleHitbox,hb2:RectHitbox){
        if ((hb2.position.x <= hb1.position.x && hb1.position.x <= hb2.position.x+hb2.size.x) && (hb2.position.y <= hb1.position.y && hb1.position.y <= hb2.position.y+hb2.size.y)) {

            const halfDim = v2.dscale(v2.sub(v2.add(hb2.position,hb2.size), hb2.position), 2)
            const p=v2.sub(hb1.position, v2.add(hb2.position, halfDim))
            const p2=v2.sub(v2.sub(v2.absolute(p),halfDim),v2.new(hb1.radius,hb1.radius))
            return [v2.new(p.x > 0 ? 1 : -1,p.y > 0 ? 1 : -1),p2.x]
        }

        const dir = v2.sub(v2.clamp2(hb1.position,hb2.position,v2.add(hb2.position,hb2.size)),hb1.position)
        const dstSqr = v2.squared(dir)

        if (dstSqr < hb1.radius * hb1.radius) {
            const dst = Math.sqrt(dstSqr)
            return [v2.normalizeSafe(dir),(hb1.radius - dst)]
        }
        return null
    }
})

export enum HitboxType{
    circle,
    rect,
    //group,
    null,
}

export interface HitboxMapping {
    [HitboxType.circle]:CircleHitbox
    [HitboxType.rect]:RectHitbox
    //[HitboxType.group]:HitboxGroup
    [HitboxType.null]:NullHitbox
}

export type Hitbox = HitboxMapping[HitboxType]

export abstract class BaseHitbox{
    abstract type: HitboxType
    abstract collidingWith(other: Hitbox):boolean
    abstract overlapCollision(other:Hitbox):OverlapCollision2D
    abstract pointInside(point:Vec2):boolean
    abstract center():Vec2
    abstract scale(scale:number):void
    abstract randomPoint():Vec2
    abstract toRect():RectHitbox
    position:Vec2
    constructor(position:Vec2){
        this.position=position
    }
    is_null():boolean{
        return false
    }
}
export class NullHitbox extends BaseHitbox{
    constructor(){
        super(NullVec2)
    }
    override readonly type = HitboxType.null
    override collidingWith(_other:Hitbox):boolean{
        return false
    }
    override pointInside(_point:Vec2):boolean{
        return false
    }
    override overlapCollision(_other: Hitbox): OverlapCollision2D {
        return {overlap:NullVec2,collided:false}
    }
    override center(): Vec2 {
        return NullVec2
    }
    override randomPoint(): Vec2 {
      return NullVec2
    }
    override toRect():RectHitbox{
        return new RectHitbox(this.position,v2.new(0,0))
    }
    override scale(_scale: number): void {}
    override is_null():boolean{
        return true
    }
}
export interface OverlapCollision2D{
    overlap:Vec2,
    collided:boolean
}
export class CircleHitbox extends BaseHitbox{
    override readonly type = HitboxType.circle
    radius:number
    constructor(position:Vec2,radius:number){
        super(position)
        this.radius=radius
    }
    override collidingWith(other: Hitbox): boolean {
        switch(other.type){
            case HitboxType.circle:
                return v2.distance(this.position,other.position)<this.radius+other.radius
            case HitboxType.rect:
                return Collision.circle_with_rect(this,other)
        }
        return false
    }
    override overlapCollision(other: Hitbox): OverlapCollision2D {
        if(other){
            switch(other.type){
                case HitboxType.circle:{
                    const dists = v2.distanceSquared(this.position,other.position)
                    const dis=v2.sub(this.position,other.position)
                    if(dists<0.0001){
                        return {overlap:v2.new(1,1),collided:true}
                    }
                    if (dists < (this.radius + other.radius)*2){
                        const dist=v2.distance(this.position,other.position)
                        return {overlap:v2.absolute(v2.dscale(dis,dist||1)),collided:true}
                    }
                    break
                }case HitboxType.rect: {
                    const result = Collision.circle_with_rect_ov(this,other)
                    if (result) {
                        const pos=v2.normalizeSafe(v2.scale(result[0] as Vec2, (result[1] as number)*2))
                        if(v2.is(pos,NullVec2)){
                            break
                        }
                        return {overlap:pos,collided:true}
                    }
                    break
                }
            }
        }
        return {overlap:NullVec2,collided:false}
    }
    override pointInside(point: Vec2): boolean {
      return v2.distance(this.position,point)<this.radius
    }
    override center(): Vec2 {
      return this.position
    }
    override scale(scale: number): void {
      this.radius*=scale
    }
    override randomPoint(): Vec2 {
        const angle = random.float(0,Math.PI*2)
        const length = random.float(0,this.radius)
        return v2.new(this.position.x+(Math.cos(angle)*length),this.position.y+(Math.sin(angle)*length))
    }
    override toRect():RectHitbox{
        return new RectHitbox(this.position,v2.new(this.radius,this.radius))
    }
}

export class RectHitbox extends BaseHitbox{
    override readonly type = HitboxType.rect
    size:Vec2
    constructor(position:Vec2,size:Vec2){
        super(position)
        this.size=size
    }
    override collidingWith(other: Hitbox): boolean {
        if(other){
            switch(other.type){
                case HitboxType.rect:
                    return (this.position.x+this.size.x>other.position.x&&this.position.x<other.position.x+other.size.x) && (this.position.y+this.size.y>other.position.y&&this.position.y<other.position.y+other.size.y)
                case HitboxType.circle:
                    return Collision.circle_with_rect(other,this)
            }
        }
        return false
    }
    override overlapCollision(other: Hitbox): OverlapCollision2D {
        if(other){
            switch(other.type){
                case HitboxType.rect:{
                    const ss=v2.dscale(v2.add(this.size,other.size),2)
                    const dist=v2.sub(this.position,other.position)
                    if(v2.less(v2.absolute(dist),ss)){
                        return {overlap:v2.normalizeSafe(v2.sub(ss,v2.absolute(dist))),collided:true}
                    }
                    break
                }case HitboxType.circle: {
                    const result = Collision.circle_with_rect_ov(other,this)
                    if (result) {
                        const pos=v2.normalizeSafe(v2.scale(result[0] as Vec2, (result[1] as number)*-2))
                        if(v2.is(pos,NullVec2)){
                            break
                        }
                        return {overlap:pos,collided:true}
                    }
                    break
                }
            }
        }
        return {overlap:NullVec2,collided:false}
    }
    override pointInside(point: Vec2): boolean {
        return (this.position.x+this.size.x>=point.x&&this.position.x<=point.x)&&(this.position.y+this.size.y>=point.y&&this.position.y<=point.y)
    }
    override center(): Vec2 {
        return v2.add(this.position,v2.dscale(this.size,2))
    }
    override scale(scale:number){
        this.size=v2.scale(this.size,scale)
    }
    override randomPoint(): Vec2 {
        return v2.add(this.position,v2.random2(NullVec2,this.size))
    }
    override toRect():RectHitbox{
        return this
    }
}