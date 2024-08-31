#include <KLSE/colliders.hpp>
#include <iostream>
#include <math.h>
namespace KLSE
{
    bool Collider2D::collidingWith(Collider2D* other) {
        return false;
    }
    bool CircleCollider2D::collidingWith(Collider2D* other) {
        switch(other->type){
            case HitboxType2D::circle:
                return Vec2::distance(position,other->position)<radius+(static_cast<CircleCollider2D*>(other)->radius);
            case HitboxType2D::rect:
                return _Collision::circle_with_rect(this,static_cast<RectCollider2D*>(other));
            default:
                break;
        };
        return false;
    }
    bool RectCollider2D::collidingWith(Collider2D* other) {
        switch(other->type){
            case HitboxType2D::circle:
                return (position.x+size.x>other->position.x&&position.x<other->position.x+static_cast<RectCollider2D*>(other)->size.x) && (position.y+size.y>other->position.y&&position.y<other->position.y+static_cast<RectCollider2D*>(other)->size.y);
            case HitboxType2D::rect:
                return _Collision::circle_with_rect(static_cast<CircleCollider2D*>(other),this);
            default:
                break;
        };
        return false;
    }
    bool BoxCollider3D::collidingWith(Collider3D* other) {
        switch(other->type){
            case HitboxType3D::box:
                return (transform.position.x+transform.scale.x>other->transform.position.x&&transform.position.x<other->transform.position.x+transform.scale.x) && 
                (transform.position.y+transform.scale.y>other->transform.position.y&&transform.position.y<other->transform.position.y+transform.scale.y)        &&
                (transform.position.z+transform.scale.z>other->transform.position.z&&transform.position.z<other->transform.position.z+transform.scale.z);
            default:
                break;
        };
        return false;
    }

    OverlapCollision2D Collider2D::overlapCollision(Collider2D* other) {
        return OverlapCollision2D(false,Vec2());
    }
    OverlapCollision2D CircleCollider2D::overlapCollision(Collider2D* other) {
        switch(other->type){
            case HitboxType2D::circle:
                return _Collision::circle_with_circle_ov(this,static_cast<CircleCollider2D*>(other));
            case HitboxType2D::rect:
                return _Collision::circle_with_rect_ov(this,static_cast<RectCollider2D*>(other),2);
            default:
                break;
        };
        return OverlapCollision2D();
    }
    OverlapCollision2D RectCollider2D::overlapCollision(Collider2D* other) {
        switch(other->type){
            case HitboxType2D::circle:
                return _Collision::circle_with_rect_ov(static_cast<CircleCollider2D*>(other),this,-2);
            case HitboxType2D::rect:
                return _Collision::rect_with_rect_ov(this,static_cast<RectCollider2D*>(other));
            default:
                break;
        };
        return OverlapCollision2D();
    }

    OverlapCollision3D BoxCollider3D::overlapCollision(Collider3D* other) {
        switch(other->type){
            case HitboxType3D::sphere:
                break;
            case HitboxType3D::box:
                return _Collision::box_with_box_ov(this,static_cast<BoxCollider3D*>(other));
            default:
                break;
        };
        return OverlapCollision3D();
    }

    OverlapCollision3D SphereCollider3D::overlapCollision(Collider3D* other) {
        switch(other->type){
            case HitboxType3D::sphere:
                break;
            case HitboxType3D::box:
                break;
            default:
                break;
        };
        return OverlapCollision3D();
    }

    bool Collider2D::pointInside(Vec2 point) {
        return false;
    }
    bool CircleCollider2D::pointInside(Vec2 point) {
      return Vec2::distance(position,point)<radius;
    }
    bool RectCollider2D::pointInside(Vec2 point) {
        return (position.x+size.x>=point.x&&position.x<=point.x)&&(position.y+size.y>=point.y&&position.y<=point.y);
    }


    void Collider2D::scale(Dimention scale){}
    void CircleCollider2D::scale(Dimention scale){
        this->radius*=scale;
    }
    void RectCollider2D::scale(Dimention scale){
        this->size=Vec2::scale(size,scale);
    }

    Vec2 Collider2D::center() {
        return Vec2();
    }
    Vec2 CircleCollider2D::center() {
        return position;
    }
    Vec2 RectCollider2D::center() {
        return Vec2::add(position,Vec2::dscale(size,2));
    }
    Vec3 BoxCollider3D::center() {
        return Vec3::add(transform.position,Vec3::dscale(transform.scale,2));
    }
    Vec3 SphereCollider3D::center() {
        return transform.position;
    }
    Vec3 SphereCollider3D::randomPoint() {
        Dimention angle1 = random::dimention(0, Math::PI * 2);
        Dimention angle2 = random::dimention(0, Math::PI);
        Dimention radius = random::dimention(0, 1);

        return Vec3(transform.position.x + ((radius * std::sin(angle2) * std::cos(angle1))*transform.scale.x),transform.position.y + ((radius * std::sin(angle2) * std::sin(angle1))*transform.scale.y),transform.position.z + ((radius*std::cos(angle1))*transform.scale.z));
    }

    Vec2 Collider2D::randomPoint() {
        return Vec2();
    }
    Vec2 RectCollider2D::randomPoint() {
        return Vec2::add(position,Vec2::random2(Vec2(),size));
    }
    Vec2 CircleCollider2D::randomPoint() {
        Dimention angle = random::dimention(0,Math::PI*2);
        Dimention length = random::dimention(0,radius);
        return Vec2(position.x+(std::cos(angle)*length),position.y+(std::sin(angle)*length));
    }
    Vec3 BoxCollider3D::randomPoint() {
        return Vec3::add(transform.position,Vec3::random3(Vec3(),transform.scale));
    }

    RectCollider2D* Collider2D::toRect(){
        return new RectCollider2D(Vec2(),Vec2());
    }
    RectCollider2D* RectCollider2D::toRect(){
        return this;
    }
    RectCollider2D* CircleCollider2D::toRect(){
        return new RectCollider2D(position,Vec2(radius,radius));
    }
    BoxCollider3D* BoxCollider3D::toBox(){
        return this;
    }
    BoxCollider3D* SphereCollider3D::toBox(){
        return new BoxCollider3D(transform.position,transform.scale,Vec3());
    }

    namespace _Collision
    {
        static bool circle_with_rect(CircleCollider2D* hb1,RectCollider2D* hb2){
            Vec2 cp=Vec2::clamp2(hb1->position,hb2->position,Vec2::add(hb2->position,hb2->size));
            Dimention dist=Vec2::distance(hb1->position,cp);
            return (dist<hb1->radius*hb1->radius)||((hb1->position.x>=hb2->position.x&&hb1->position.x<=hb2->position.x+hb2->size.x)&&(hb1->position.x>=hb2->position.x&&hb1->position.x<=hb2->position.x+hb2->size.x));
        };
        static OverlapCollision2D circle_with_circle_ov(CircleCollider2D* hb1,CircleCollider2D* hb2){
            Dimention dists = Vec2::distanceSquared(hb1->position,hb2->position);
            Vec2 dis=Vec2::sub(hb1->position,hb2->position);
            if(dists<0.0001){
                return OverlapCollision2D(true,Vec2(1,1));
            }
            if (dists < (hb1->radius + hb2->radius)*2){
                Dimention dist=Vec2::distance(hb1->position,hb2->position);
                return OverlapCollision2D(true,Vec2::absolute(Vec2::dscale(dis,dist||1))) ;
            }
            return OverlapCollision2D();
        }
        static OverlapCollision2D circle_with_rect_ov(CircleCollider2D* hb1,RectCollider2D* hb2,Dimention reverse){
            Vec2 val1;
            Dimention val2;
            if ((hb2->position.x <= hb1->position.x && hb1->position.x <= hb2->position.x+hb2->size.x) && (hb2->position.y <= hb1->position.y && hb1->position.y <= hb2->position.y+hb2->size.y)) {
                Vec2 halfDim = Vec2::dscale(Vec2::sub(Vec2::add(hb2->position,hb2->size), hb2->position), 2);
                Vec2 p=Vec2::sub(hb1->position, Vec2::add(hb2->position, halfDim));
                Vec2 p2=Vec2::sub(Vec2::sub(Vec2::absolute(p),halfDim),Vec2(hb1->radius,hb1->radius));
                val1=Vec2(p.x > 0 ? 1 : -1,p.y > 0 ? 1 : -1);
                val2=p2.x;
            }else{
                Vec2 dir = Vec2::sub(Vec2::clamp2(hb1->position,hb2->position,Vec2::add(hb2->position,hb2->size)),hb1->position);
                Dimention dstSqr = Vec2::squared(dir);

                if (dstSqr < hb1->radius * hb1->radius) {
                    Dimention dst = sqrt(dstSqr);
                    val1=Vec2::normalizeSafe(dir,Vec2());
                    val2=hb1->radius - dst;
                }else{
                    return OverlapCollision2D();
                }
            }

            Vec2 pos=Vec2::normalizeSafe(Vec2::scale(val1,val2*reverse),Vec2());
            if(Vec2::is(pos,Vec2())){
                return OverlapCollision2D();
            }
            return OverlapCollision2D(true,pos);
        }
        static OverlapCollision2D rect_with_rect_ov(RectCollider2D* hb1,RectCollider2D* hb2){
            Vec2 ss=Vec2::dscale(Vec2::add(hb1->size,hb2->size),2);
            Vec2 dist=Vec2::sub(hb1->position,hb2->position);
            
            if(Vec2::less(Vec2::absolute(dist),ss)){
                Vec2 ov=Vec2::normalizeSafe(Vec2::sub(ss,Vec2::absolute(dist)),Vec2());
                Vec2 ov2=Vec2::duplicate(ov);
                if(ov.x<ov.y){
                    ov2.x=dist.x>0?-ov2.x:ov2.x;
                }else{
                    ov2.y=dist.y>0?-ov2.y:ov2.y;
                }
                return OverlapCollision2D(!Vec2::is(ov2,Vec2()),ov2);
            }
            return OverlapCollision2D();
        }

        static OverlapCollision3D box_with_box_ov(BoxCollider3D* hb1,BoxCollider3D* hb2){
            Vec3 dist= Vec3::sub(hb1->center(),hb2->center());
            Vec3 ss=Vec3::dscale(Vec3::add(hb1->transform.scale,hb2->transform.scale),2);
            if(Vec3::less(Vec3::absolute(dist),ss)){
                Vec3 ov=Vec3::min3(
                    Vec3::sub(ss,Vec3::absolute(dist)),
                    Vec3());
                Vec3 dire=Vec3();
                Vec3 ovp=Vec3::div(ov,ss);
                if(ovp.x<ovp.y&&ovp.x<ovp.z){
                    dire.x=dist.x<0?1:-1;
                }
                else if(ovp.y<ovp.x&&ovp.y<ovp.z){
                    dire.y=dist.y<0?1:-1;
                }else if(ovp.z<ovp.x&&ovp.z<ovp.y){
                    dire.z=dist.z<0?1:-1;
                }
                return OverlapCollision3D(true,Vec3::maxDecimal(Vec3::mult(ov,dire),3),Vec3::sub(dire,Vec3::mult(ovp,dire)),dire);
            }
            return OverlapCollision3D();
        };
    } // namespace Collision
    
} // namespace KLSE
