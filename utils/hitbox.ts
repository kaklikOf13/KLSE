import { NullVec2, NullVec3, type Transform3D, type Vec2, type Vec3, v2, v3 } from "./geometry.ts"
import { random } from "./random.ts";

export const Collision=Object.freeze({
    circle_with_rect(hb1:CircleHitbox2D,hb2:RectHitbox2D):boolean{
        const cp=v2.clamp2(hb1.position,hb2.position,v2.add(hb2.position,hb2.size))
        const dist=v2.distanceSquared(hb1.position,cp)
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

export enum HitboxType2D{
    circle=0,
    rect=1,
    null=2,
    //group,
}
export enum HitboxType3D{
    sphere=0,
    box=1,
    null=2,
    //group,
}

export interface Hitbox2DMapping {
    [HitboxType2D.circle]:CircleHitbox2D
    [HitboxType2D.rect]:RectHitbox2D
    //[HitboxType2D.group]:HitboxGroup
    [HitboxType2D.null]:NullHitbox2D
}
export interface Hitbox3DMapping {
    [HitboxType3D.sphere]:SphereHitbox3D
    [HitboxType3D.box]:BoxHitbox3D
    //[HitboxType.group]:HitboxGroup
    [HitboxType3D.null]:NullHitbox3D
}

export type Hitbox2D = Hitbox2DMapping[HitboxType2D]
export type Hitbox3D = Hitbox3DMapping[HitboxType3D]
export abstract class BaseHitbox2D{
    abstract type: HitboxType2D
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
    override readonly type = HitboxType2D.null
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
    overlap:Vec2
    collided:boolean
}
export interface OverlapCollision3D{
    overlap:Vec3
    overlapP:Vec3
    collided:boolean
    dire:Vec3
}
export class CircleHitbox2D extends BaseHitbox2D{
    override readonly type = HitboxType2D.circle
    radius:number
    constructor(position:Vec2,radius:number){
        super(position)
        this.radius=radius
    }
    override collidingWith(other: Hitbox2D): boolean {
        switch(other.type){
            case HitboxType2D.circle:
                return v2.distance(this.position,other.position)<this.radius+other.radius
            case HitboxType2D.rect:
                return Collision.circle_with_rect(this,other)
        }
        return false
    }
    override overlapCollision(other: Hitbox2D): OverlapCollision2D {
        if(other){
            switch(other.type){
                case HitboxType2D.circle:{
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
                }case HitboxType2D.rect: {
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
    override readonly type = HitboxType2D.rect
    size:Vec2
    constructor(position:Vec2,size:Vec2){
        super(position)
        this.size=size
    }
    override collidingWith(other: Hitbox2D): boolean {
        if(other){
            switch(other.type){
                case HitboxType2D.rect:
                    return (this.position.x+this.size.x>other.position.x&&this.position.x<other.position.x+other.size.x) && (this.position.y+this.size.y>other.position.y&&this.position.y<other.position.y+other.size.y)
                case HitboxType2D.circle:
                    return Collision.circle_with_rect(other,this)
            }
        }
        return false
    }
    override overlapCollision(other: Hitbox2D): OverlapCollision2D {
        if(other){
            switch(other.type){
                case HitboxType2D.rect:{
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
                }case HitboxType2D.circle: {
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
    abstract type: HitboxType3D
    abstract collidingWith(other: Hitbox3D):boolean
    abstract overlapCollision(other:Hitbox3D):OverlapCollision3D
    abstract pointInside(point:Vec3):boolean
    abstract center():Vec3
    abstract scale(scale:number):void
    abstract randomPoint():Vec3
    abstract toBox():BoxHitbox3D
    transform:Transform3D
    constructor(position?:Vec3,scale?:Vec3,rotation?:Vec3){
        this.transform={position:position??v3.new(0,0,0),scale:scale??v3.new(1,1,1),rotation:rotation??v3.new(0,0,0)}
    }
    is_null():boolean{
        return false
    }
}
export class NullHitbox3D extends BaseHitbox3D{
    constructor(){
        super(undefined,undefined,undefined)
    }
    override readonly type = HitboxType3D.null
    override collidingWith(_other:Hitbox3D):boolean{
        return false
    }
    override pointInside(_point:Vec2):boolean{
        return false
    }
    override overlapCollision(_other: Hitbox3D): OverlapCollision3D {
        return {overlap:NullVec3,collided:false,dire:v3.new(0,0,0),overlapP:v3.new(0,0,0)}
    }
    override center(): Vec3 {
        return NullVec3
    }
    override randomPoint(): Vec3 {
      return NullVec3
    }
    override toBox():BoxHitbox3D{
        return new BoxHitbox3D(this.transform.position,v3.new(0,0,0))
    }
    override scale(_scale: number): void {}
    override is_null():boolean{
        return true
    }
}

export class BoxHitbox3D extends BaseHitbox3D{
    override readonly type = HitboxType3D.box
    size:Vec3
    constructor(position:Vec3,size:Vec3,scale?:Vec3,rotation?:Vec3){
        super(position,scale,rotation)
        this.size=size
    }
    override collidingWith(other: Hitbox3D): boolean {
        if(other){
            switch(other.type){
                case HitboxType3D.box:
                    return (this.transform.position.x+this.size.x>other.transform.position.x&&this.transform.position.x<other.transform.position.x+other.size.x) && (this.transform.position.y+this.size.y>other.transform.position.y&&this.transform.position.y<other.transform.position.y+other.size.y) && (this.transform.position.z+this.size.z>other.transform.position.z&&this.transform.position.z<other.transform.position.z+other.size.z)
                /*case HitboxType.circle:
                    return Collision.circle_with_rect(other,this)*/
            }
        }
        return false
    }
    override overlapCollision(other: Hitbox3D): OverlapCollision3D {
        if(other){
            switch(other.type){
                case HitboxType3D.box:{
                    const dist= v3.maxDecimal(v3.sub(this.center(),other.center()))
                    const ss=v3.maxDecimal(v3.dscale(v3.add(this.getRealSize(),other.getRealSize()),2))
                    if(v3.less(v3.absolute(dist),ss)){
                        const ov=v3.min3(
                            v3.sub(ss,v3.absolute(dist)),
                            NullVec3,
                        )
                        const dire=v3.new(0,0,0)
                        const ovp=v3.maxDecimal(v3.div(ov,ss))
                        if(ovp.x<ovp.y&&ovp.x<ovp.z){
                            dire.x=dist.x<0?1:-1
                        }
                        else if(ovp.y<ovp.x&&ovp.y<ovp.z){
                            dire.y=dist.y<0?1:-1
                        }else if(ovp.z<ovp.x&&ovp.z<ovp.y){
                            dire.z=dist.z<0?1:-1
                        }
                        return {overlap:v3.maxDecimal(v3.mult(ov,dire)),collided:true,dire:dire,overlapP:v3.sub(dire,v3.mult(ovp,dire))}
                    }
                    break
                }case HitboxType3D.sphere: {
                    //
                }
            }
        }
        return {overlap:v3.new(0,0,0),collided:false,dire:v3.new(0,0,0),overlapP:v3.new(0,0,0)}
    }
    override pointInside(point: Vec3): boolean {
        const pp=v3.mult(this.size,this.transform.scale)
        return (
            (point.x>=pp.x&&point.x<=this.transform.position.x+pp.x)&&
            (point.y>=pp.y&&point.y<=this.transform.position.y+pp.y)&&
            (point.z>=pp.z&&point.z<=this.transform.position.z+pp.z)
        )
    }
    override center(): Vec3 {   
        return v3.add(this.transform.position,v3.mult(v3.mult(this.size,this.transform.scale),v3.new(-.5,.5,.5)))
    }
    override scale(scale:number){
        this.size=v3.scale(this.size,scale)
    }
    override randomPoint(): Vec3 {
        return v3.add(this.transform.position,v3.random3(NullVec3,this.size))
    }
    override toBox():BoxHitbox3D{
        return this
    }
    gmm():{min:Vec3,max:Vec3}{
        const s=v3.mult(this.size,this.transform.scale)
        return {min:v3.sub(this.transform.position,v3.mult(s,v3.new(1,0,0))),max:v3.add(this.transform.position,v3.mult(s,v3.new(0,1,1)))}
    }
    getRealSize():Vec3{
        return v3.mult(this.size,this.transform.scale)
    }
    getMin():Vec3{
        return this.transform.position
    }
    getMax():Vec3{
        return v3.add(this.transform.position,v3.mult(this.size,this.transform.scale))
    }
}
export class SphereHitbox3D extends BaseHitbox3D{
    override readonly type = HitboxType3D.sphere
    radius:number
    constructor(position:Vec3,radius:number){
        super(position)
        this.radius=radius
    }
    override collidingWith(other: Hitbox3D): boolean {
        switch(other.type){
            case HitboxType3D.sphere:
                return v3.distance(this.transform.position,other.transform.position)<this.radius+other.radius
            case HitboxType3D.box:
                //return Collision.circle_with_rect(this,other)
        }
        return false
    }
    override overlapCollision(other: Hitbox3D): OverlapCollision3D {
        if(other){
            switch(other.type){
                case HitboxType3D.sphere:{
                    const dists = v3.distanceSquared(this.transform.position,other.transform.position)
                    const dis=v3.sub(this.transform.position,other.transform.position)
                    if(dists<0.0001){
                        return {overlap:v3.new(1,1,1),collided:true,dire:v3.new(1,1,1),overlapP:v3.new(1,1,1)}
                    }
                    if (dists < (this.radius + other.radius)*2){
                        const dist=v3.distance(this.transform.position,other.transform.position)
                        const ov=v3.absolute(v3.dscale(dis,dist||1))
                        return {overlap:ov,collided:true,dire:v3.new(0,0,0),overlapP:v3.dscale(ov,this.radius)}
                    }
                    break
                }case HitboxType3D.box: {
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
        return {overlap:NullVec3,collided:false,dire:v3.new(0,0,0),overlapP:v3.new(0,0,0)}
    }
    override pointInside(point: Vec3): boolean {
      return v2.distance(this.transform.position,point)<this.radius
    }
    override center(): Vec3 {
      return this.transform.position
    }
    override scale(scale: number): void {
      this.radius*=scale
    }
    override randomPoint(): Vec3 {
        const angle1 = random.float(0, Math.PI * 2)
        const angle2 = random.float(0, Math.PI)
        const radius = random.float(0, this.radius)

        return v3.new(this.transform.position.x + ((radius * Math.sin(angle2) * Math.cos(angle1))*this.transform.scale.x),this.transform.position.y + ((radius * Math.sin(angle2) * Math.sin(angle1))*this.transform.scale.y),this.transform.position.z + ((radius*Math.cos(angle1))*this.transform.scale.z))
    }
    override toBox():BoxHitbox3D{
        return new BoxHitbox3D(this.transform.position,v3.new(this.radius*this.transform.scale.x,this.radius*this.transform.scale.y,this.radius*this.transform.scale.z))
    }
}