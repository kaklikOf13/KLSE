import { NullVector, Vec, Vector } from "./geometry.ts"

export const Collision=Object.freeze({
    circle_with_rect(hb1:CircleHitbox,hb2:RectHitbox):boolean{
        const cp=Vec.clamp2(hb1.position,hb2.position,Vec.add(hb2.position,hb2.size))
        const dist=Vec.distance(hb1.position,cp)
        return (dist<hb1.radius*hb1.radius)||((hb1.position.x>=hb2.position.x&&hb1.position.x<=hb2.position.x+hb2.size.x)&&(hb1.position.x>=hb2.position.x&&hb1.position.x<=hb2.position.x+hb2.size.x))
    },
    circle_with_rect_ov(hb1:CircleHitbox,hb2:RectHitbox){
        if ((hb2.position.x <= hb1.position.x && hb1.position.x <= hb2.position.x+hb2.size.x) && (hb2.position.y <= hb1.position.y && hb1.position.y <= hb2.position.y+hb2.size.y)) {

            const halfDim = Vec.dscale(Vec.sub(Vec.add(hb2.position,hb2.size), hb2.position), 2)
            const p=Vec.sub(hb1.position, Vec.add(hb2.position, halfDim))
            const p2=Vec.sub(Vec.sub(Vec.absolute(p),halfDim),Vec.new(hb1.radius,hb1.radius))
            return p2.x>p2.y ? [Vec.new(p.x > 0 ? 1 : -1,0),-p2.x]:[Vec.new(0,p.y > 0 ? 1 : -1),-p2.y]
        }

        const dir = Vec.sub(Vec.clamp2(hb1.position,hb2.position,Vec.add(hb2.position,hb2.size)),hb1.position)
        const dstSqr = Vec.squared(dir)

        if (dstSqr < hb1.radius * hb1.radius) {
            const dst = Math.sqrt(dstSqr)
            return [Vec.normalizeSafe(dir),hb1.radius - dst]
        }
        return null
    }
})

export enum HitboxType{
    circle,
    rect,
    null
    //group,
}

export interface HitboxMapping {
    [HitboxType.circle]:CircleHitbox
    [HitboxType.rect]:RectHitbox
    [HitboxType.null]:NullHitbox
    //[HitboxType.group]:HitboxGroup
}

export type Hitbox = HitboxMapping[HitboxType]

export abstract class BaseHitbox{
    abstract type: HitboxType
    abstract collidingWith(other: Hitbox):boolean
    abstract overlapCollision(other:Hitbox):boolean
    abstract pointInside(point:Vector):boolean
    abstract center():Vector
    abstract scale(scale:number):void
    position:Vector
    constructor(position:Vector){
        this.position=position
    }
    is_null():boolean{
        return false
    }
}
export class NullHitbox extends BaseHitbox{
    constructor(){
        super(NullVector)
    }
    override readonly type = HitboxType.null
    override collidingWith(_other:Hitbox):boolean{
        return false
    }
    override pointInside(_point:Vector):boolean{
        return false
    }
    override overlapCollision(_other: Hitbox): boolean {
        return false
    }
    override center(): Vector {
        return NullVector
    }
    override scale(_scale: number): void {}
    override is_null():boolean{
        return true
    }
}

export class CircleHitbox extends BaseHitbox{
    override readonly type = HitboxType.circle
    radius:number
    constructor(position:Vector,radius:number){
        super(position)
        this.radius=radius
    }
    override collidingWith(other: Hitbox): boolean {
        switch(other.type){
            case HitboxType.circle:
                return Vec.distance(this.position,other.position)<this.radius+other.radius
            case HitboxType.rect:
                return Collision.circle_with_rect(this,other)
        }
        return false
    }
    override overlapCollision(other: Hitbox): boolean {
        if(other){
            switch(other.type){
                case HitboxType.circle:{
                    const r = this.radius + other.radius
                    const dis = Vec.sub(this.position, other.position)
                    const dist = Vec.squared(dis)

                    if (dist < r * r){
                        this.position=Vec.sub(this.position,Vec.scale(Vec.normalizeSafe(dis),r - Math.sqrt(dist)))
                        return true
                    }
                    break
                }
                case HitboxType.rect:{
                    const result = Collision.circle_with_rect_ov(this,other)
                    if (result) {
                        // @ts-ignore error
                        this.position = Vec.sub(this.position,Vec.scale(result[0],result[1]))
                        return true
                    }
                    break
                }
            }
        }
        return false
    }
    override pointInside(point: Vector): boolean {
      return Vec.distance(this.position,point)<this.radius
    }
    override center(): Vector {
      return this.position
    }
    override scale(scale: number): void {
      this.radius*=scale
    }

}

export class RectHitbox extends BaseHitbox{
    override readonly type = HitboxType.rect
    size:Vector
    constructor(position:Vector,size:Vector){
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
    override overlapCollision(other: Hitbox): boolean {
        if(other){
            switch(other.type){
                case HitboxType.rect:{
                    const ss=Vec.dscale(Vec.add(this.position,other.position),2)
                    const dist=Vec.sub(this.center(),other.center())
                    if(Vec.less(Vec.absolute(dist),ss)){
                        const overlap=Vec.sub(ss,Vec.absolute(dist))
                        if(overlap.x<overlap.y){
                            this.position.x=dist.x>0?this.position.x+overlap.x:this.position.x-overlap.x
                        }else{
                            this.position.y=dist.y>0?this.position.y+overlap.y:this.position.y-overlap.y
                        }
                        return true
                    }
                    break
                }case HitboxType.circle: {
                    const result = Collision.circle_with_rect_ov(other,this)
                    if (result) {
                        // @ts-ignore error
                        this.position = Vec.sub(this.position,Vec.scale(result[0], result[1]))
                        return true
                    }
                    break
                }
            }
        }
        return false
    }
    override pointInside(point: Vector): boolean {
        return (this.position.x+this.size.x>=point.x&&this.position.x<=point.x)&&(this.position.y+this.size.y>=point.y&&this.position.y<=point.y)
    }
    override center(): Vector {
        return Vec.add(this.position,Vec.dscale(this.size,2))
    }
    override scale(scale:number){
        this.size=Vec.scale(this.size,scale)
    }
}