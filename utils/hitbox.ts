import { NullVec2, NullVec3, Vec2, Vec3, v2, v3 } from "./geometry.ts"
import { random } from "./random.ts";

export const Collision=Object.freeze({
    circle_with_rect(hb1:CircleHitbox2D,hb2:RectHitbox2D):boolean{
        const cp=v2.clamp2(hb1.position,hb2.position,v2.add(hb2.position,hb2.size))
        const dist=v2.distance(hb1.position,cp)
        return (dist<hb1.radius*hb1.radius)||((hb1.position.x>=hb2.position.x&&hb1.position.x<=hb2.position.x+hb2.size.x)&&(hb1.position.x>=hb2.position.x&&hb1.position.x<=hb2.position.x+hb2.size.x))
    },
    circle_with_rect_ov(hb1:CircleHitbox2D,hb2:RectHitbox2D){
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
    },
})

export enum HitboxType{
    circle,
    rect,
    //group,
    null,
}

export interface Hitbox2DMapping {
    [HitboxType.circle]:CircleHitbox2D
    [HitboxType.rect]:RectHitbox2D
    //[HitboxType.group]:HitboxGroup
    [HitboxType.null]:NullHitbox2D
}
export interface Hitbox3DMapping {
    [HitboxType.circle]:CircleHitbox3D
    [HitboxType.rect]:RectHitbox3D
    //[HitboxType.group]:HitboxGroup
    [HitboxType.null]:NullHitbox3D
}

export type Hitbox2D = Hitbox2DMapping[HitboxType]
export type Hitbox3D = Hitbox3DMapping[HitboxType]
export abstract class BaseHitbox2D{
    abstract type: HitboxType
    abstract collidingWith(other: Hitbox2D):boolean
    abstract overlapCollision(other:Hitbox2D):OverlapCollision2D
    abstract pointInside(point:Vec2):boolean
    abstract center():Vec2
    abstract scale(scale:number):void
    abstract randomPoint():Vec2
    abstract toRect():RectHitbox2D
    position:Vec2
    constructor(position:Vec2){
        this.position=position
    }
    is_null():boolean{
        return false
    }
}
export class NullHitbox2D extends BaseHitbox2D{
    constructor(){
        super(NullVec2)
    }
    override readonly type = HitboxType.null
    override collidingWith(_other:Hitbox2D):boolean{
        return false
    }
    override pointInside(_point:Vec2):boolean{
        return false
    }
    override overlapCollision(_other: Hitbox2D): OverlapCollision2D {
        return {overlap:NullVec2,collided:false}
    }
    override center(): Vec2 {
        return NullVec2
    }
    override randomPoint(): Vec2 {
      return NullVec2
    }
    override toRect():RectHitbox2D{
        return new RectHitbox2D(this.position,v2.new(0,0))
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
export interface OverlapCollision3D{
    overlap:Vec3,
    collided:boolean
}
export class CircleHitbox2D extends BaseHitbox2D{
    override readonly type = HitboxType.circle
    radius:number
    constructor(position:Vec2,radius:number){
        super(position)
        this.radius=radius
    }
    override collidingWith(other: Hitbox2D): boolean {
        switch(other.type){
            case HitboxType.circle:
                return v2.distance(this.position,other.position)<this.radius+other.radius
            case HitboxType.rect:
                return Collision.circle_with_rect(this,other)
        }
        return false
    }
    override overlapCollision(other: Hitbox2D): OverlapCollision2D {
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
    override toRect():RectHitbox2D{
        return new RectHitbox2D(this.position,v2.new(this.radius,this.radius))
    }
}

export class RectHitbox2D extends BaseHitbox2D{
    override readonly type = HitboxType.rect
    size:Vec2
    constructor(position:Vec2,size:Vec2){
        super(position)
        this.size=size
    }
    override collidingWith(other: Hitbox2D): boolean {
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
    override overlapCollision(other: Hitbox2D): OverlapCollision2D {
        if(other){
            switch(other.type){
                case HitboxType.rect:{
                    const ss=v2.dscale(v2.add(this.size,other.size),2)
                    const dist=v2.sub(this.position,other.position)
                    
                    if(v2.less(v2.absolute(dist),ss)){
                        const ov=v2.normalizeSafe(v2.sub(ss,v2.absolute(dist)))
                        const ov2=v2.duplicate(ov)
                        if(ov.x<ov.y){
                            ov2.x=dist.x>0?-ov2.x:ov2.x
                        }else{
                            ov2.y=dist.y>0?-ov2.y:ov2.y
                        }
                        return {overlap:ov2,collided:!v2.is(ov2,NullVec2)}
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
    override toRect():RectHitbox2D{
        return this
    }
}

export abstract class BaseHitbox3D{
    abstract type: HitboxType
    abstract collidingWith(other: Hitbox3D):boolean
    abstract overlapCollision(other:Hitbox3D):OverlapCollision3D
    abstract pointInside(point:Vec3):boolean
    abstract center():Vec3
    abstract scale(scale:number):void
    abstract randomPoint():Vec3
    abstract toRect():RectHitbox3D
    position:Vec3
    constructor(position:Vec3){
        this.position=position
    }
    is_null():boolean{
        return false
    }
}
export class NullHitbox3D extends BaseHitbox3D{
    constructor(){
        super(NullVec3)
    }
    override readonly type = HitboxType.null
    override collidingWith(_other:Hitbox3D):boolean{
        return false
    }
    override pointInside(_point:Vec2):boolean{
        return false
    }
    override overlapCollision(_other: Hitbox3D): OverlapCollision3D {
        return {overlap:NullVec3,collided:false}
    }
    override center(): Vec3 {
        return NullVec3
    }
    override randomPoint(): Vec3 {
      return NullVec3
    }
    override toRect():RectHitbox3D{
        return new RectHitbox3D(this.position,v3.new(0,0,0))
    }
    override scale(_scale: number): void {}
    override is_null():boolean{
        return true
    }
}

export class RectHitbox3D extends BaseHitbox3D{
    override readonly type = HitboxType.rect
    size:Vec3
    constructor(position:Vec3,size:Vec3){
        super(position)
        this.size=size
    }
    override collidingWith(other: Hitbox3D): boolean {
        if(other){
            switch(other.type){
                case HitboxType.rect:
                    return (this.position.x+this.size.x>other.position.x&&this.position.x<other.position.x+other.size.x) && (this.position.y+this.size.y>other.position.y&&this.position.y<other.position.y+other.size.y) && (this.position.z+this.size.z>other.position.z&&this.position.z<other.position.z+other.size.z)
                /*case HitboxType.circle:
                    return Collision.circle_with_rect(other,this)*/
            }
        }
        return false
    }
    override overlapCollision(other: Hitbox3D): OverlapCollision3D {
        if(other){
            switch(other.type){
                case HitboxType.rect:{
                    const ss = v3.dscale(v3.add(this.size, other.size), 2)
                    const dist = v3.sub(this.position, other.position)
                    if (v3.less(v3.absolute(dist), ss)) {
                        const ov=v3.sub(ss, v3.absolute(dist))
                        let ov2=v3.duplicate(ov)
                        if(ov.x>ov.y||ov.x>ov.z){
                            ov2.x=0
                        }
                        if(ov.y>ov.x||ov.y>ov.z){
                            ov2.y=0
                        }
                        if(ov.z>ov.y||ov.z>ov.x){
                            ov2.z=0
                        }
                        ov2=v3.normalizeSafe(v3.new(dist.x<0?ov2.x:-ov2.x,dist.y<0?ov2.y:-ov2.y,dist.z<0?ov2.z:-ov2.z))
                        return { overlap: ov2, collided: !v3.is(ov2,NullVec3) }
                    }
                    break;
                }case HitboxType.circle: {
                    //
                }
            }
        }
        return {overlap:NullVec3,collided:false}
    }
    override pointInside(point: Vec3): boolean {
        return (this.position.x+this.size.x>=point.x&&this.position.x<=point.x)&&(this.position.y+this.size.y>=point.y&&this.position.y<=point.y)&&(this.position.z+this.size.z>=point.z&&this.position.z<=point.z)
    }
    override center(): Vec3 {
        return v3.add(this.position,v3.dscale(this.size,2))
    }
    override scale(scale:number){
        this.size=v3.scale(this.size,scale)
    }
    override randomPoint(): Vec3 {
        return v3.add(this.position,v3.random3(NullVec3,this.size))
    }
    override toRect():RectHitbox3D{
        return this
    }
}
export class CircleHitbox3D extends BaseHitbox3D{
    override readonly type = HitboxType.circle
    radius:number
    constructor(position:Vec3,radius:number){
        super(position)
        this.radius=radius
    }
    override collidingWith(other: Hitbox3D): boolean {
        switch(other.type){
            case HitboxType.circle:
                return v3.distance(this.position,other.position)<this.radius+other.radius
            case HitboxType.rect:
                return Collision.circle_with_rect(this,other)
        }
        return false
    }
    override overlapCollision(other: Hitbox3D): OverlapCollision3D {
        if(other){
            switch(other.type){
                case HitboxType.circle:{
                    const dists = v3.distanceSquared(this.position,other.position)
                    const dis=v3.sub(this.position,other.position)
                    if(dists<0.0001){
                        return {overlap:v3.new(1,1,1),collided:true}
                    }
                    if (dists < (this.radius + other.radius)*2){
                        const dist=v3.distance(this.position,other.position)
                        return {overlap:v3.absolute(v3.dscale(dis,dist||1)),collided:true}
                    }
                    break
                }case HitboxType.rect: {
                    /*const result = Collision.circle_with_rect_ov(this,other)
                    if (result) {
                        const pos=v3.normalizeSafe(v3.scale(result[0] as Vec3, (result[1] as number)*2))
                        if(v2.is(pos,NullVec2)){
                            break
                        }
                        return {overlap:pos,collided:true}
                    }
                    break*/
                }
            }
        }
        return {overlap:NullVec3,collided:false}
    }
    override pointInside(point: Vec3): boolean {
      return v2.distance(this.position,point)<this.radius
    }
    override center(): Vec3 {
      return this.position
    }
    override scale(scale: number): void {
      this.radius*=scale
    }
    override randomPoint(): Vec3 {
        const angle1 = random.float(0, Math.PI * 2)
        const angle2 = random.float(0, Math.PI)
        const radius = random.float(0, this.radius)

        return v3.new(this.position.x + (radius * Math.sin(angle2) * Math.cos(angle1)), this.position.y + (radius * Math.sin(angle2) * Math.sin(angle1)), this.position.z + (radius * Math.cos(angle2)))
    }
    override toRect():RectHitbox3D{
        return new RectHitbox3D(this.position,v3.new(this.radius,this.radius,this.radius))
    }
}