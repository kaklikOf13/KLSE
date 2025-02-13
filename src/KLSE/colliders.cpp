#include <KLSE/colliders.hpp>
#include <iostream>
#include <math.h>
namespace KLSE
{
    bool Collider2D::collidingWith(Collider2D* other) {
        return false;
    }
    bool Collider3D::collidingWith(Collider3D* other) {
        return false;
    }
    bool CircleCollider2D::collidingWith(Collider2D* other) {
        switch(other->type){
            case ColliderType2D::circle:
                return Vec2::distance(position,other->position)<radius+(static_cast<CircleCollider2D*>(other)->radius);
            case ColliderType2D::rect:
                return _Collision::circle_with_rect(this,static_cast<RectCollider2D*>(other));
            default:
                break;
        };
        return false;
    }
    bool SphereCollider3D::collidingWith(Collider3D* other) {
        switch(other->type){
            case ColliderType3D::sphere:
                return (transform.position-other->transform.position)<(transform.scale+other->transform.scale);
            default:
                break;
        };
        return false;
    }
    bool RectCollider2D::collidingWith(Collider2D* other) {
        switch(other->type){
            case ColliderType2D::rect:
                return (position.x+size.x>other->position.x&&position.x<other->position.x+static_cast<RectCollider2D*>(other)->size.x) && (position.y+size.y>other->position.y&&position.y<other->position.y+static_cast<RectCollider2D*>(other)->size.y);
            case ColliderType2D::circle:
                return _Collision::circle_with_rect(static_cast<CircleCollider2D*>(other),this);
            default:
                break;
        };
        return false;
    }
    bool BoxCollider3D::collidingWith(Collider3D* other) {
        switch(other->type){
            case ColliderType3D::box:
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
    OverlapCollision3D Collider3D::overlapCollision(Collider3D* other) {
        return OverlapCollision3D(false,Vec3(),Vec3(),Vec3());
    }
    OverlapCollision2D CircleCollider2D::overlapCollision(Collider2D* other) {
        switch(other->type){
            case ColliderType2D::circle:
                return _Collision::circle_with_circle_ov(this,static_cast<CircleCollider2D*>(other));
            case ColliderType2D::rect:
                return _Collision::circle_with_rect_ov(this,static_cast<RectCollider2D*>(other),2);
            default:
                break;
        };
        return OverlapCollision2D();
    }
    OverlapCollision2D RectCollider2D::overlapCollision(Collider2D* other) {
        switch(other->type){
            case ColliderType2D::circle:
                return _Collision::circle_with_rect_ov(static_cast<CircleCollider2D*>(other),this,-2);
            case ColliderType2D::rect:
                return _Collision::rect_with_rect_ov(this,static_cast<RectCollider2D*>(other));
            default:
                break;
        };
        return OverlapCollision2D();
    }

    OverlapCollision3D BoxCollider3D::overlapCollision(Collider3D* other) {
        switch(other->type){
            case ColliderType3D::sphere:
                break;
            case ColliderType3D::box:
                return _Collision::box_with_box_ov(this,static_cast<BoxCollider3D*>(other));
            default:
                break;
        };
        return OverlapCollision3D();
    }

    OverlapCollision3D SphereCollider3D::overlapCollision(Collider3D* other) {
        switch(other->type){
            case ColliderType3D::sphere:
                break;
            case ColliderType3D::box:
                break;
            default:
                break;
        };
        return OverlapCollision3D();
    }

    bool Collider2D::pointInside(Vec2 point) {
        return false;
    }
    bool Collider3D::pointInside(Vec3 point) {
        return false;
    }
    bool CircleCollider2D::pointInside(Vec2 point) {
      return Vec2::distance(position,point)<radius;
    }
    bool SphereCollider3D::pointInside(Vec3 point) {
      return (transform.position-point)<transform.scale;
    }
    bool RectCollider2D::pointInside(Vec2 point) {
        return (position.x+size.x>=point.x&&position.x<=point.x)&&(position.y+size.y>=point.y&&position.y<=point.y);
    }
    bool BoxCollider3D::pointInside(Vec3 point) {
        return (transform.position.x+transform.scale.x>=point.x&&transform.position.x<=point.x)&&
        (transform.position.y+transform.scale.y>=point.y&&transform.position.y<=point.y)&&
        (transform.position.z+transform.scale.z>=point.z&&transform.position.z<=point.z);
    }


    void Collider2D::scale(Dimention scale){}
    void CircleCollider2D::scale(Dimention scale){
        this->radius*=scale;
    }
    void RectCollider2D::scale(Dimention scale){
        this->size=size*scale;
    }

    Vec2 Collider2D::center() {
        return Vec2();
    }
    Vec3 Collider3D::center() {
        return Vec3();
    }
    Vec2 CircleCollider2D::center() {
        return position;
    }
    Vec2 RectCollider2D::center() {
        return position+size/2;
    }
    Vec3 BoxCollider3D::center() {
        return transform.position+(transform.scale/2);
    }
    Vec3 SphereCollider3D::center() {
        return transform.position;
    }
    Vec3 SphereCollider3D::randomPoint() {
        Dimention angle1 = Math::random::dimention(0, Math::PI * 2);
        Dimention angle2 = Math::random::dimention(0, Math::PI);
        Dimention radius = Math::random::dimention(0, 1);

        return Vec3(transform.position.x + ((radius * std::sin(angle2) * std::cos(angle1))*transform.scale.x),transform.position.y + ((radius * std::sin(angle2) * std::sin(angle1))*transform.scale.y),transform.position.z + ((radius*std::cos(angle1))*transform.scale.z));
    }

    Vec2 Collider2D::randomPoint() {
        return Vec2();
    }
    Vec3 Collider3D::randomPoint() {
        return Vec3();
    }
    Vec2 RectCollider2D::randomPoint() {
        return position+Vec2::random2(Vec2(),size);
    }
    Vec2 CircleCollider2D::randomPoint() {
        Dimention angle = Math::random::dimention(0,Math::PI*2);
        Dimention length = Math::random::dimention(0,radius);
        return Vec2(position.x+(std::cos(angle)*length),position.y+(std::sin(angle)*length));
    }
    Vec3 BoxCollider3D::randomPoint() {
        return transform.position+Vec3::random3(Vec3(),transform.scale);
    }

    RectCollider2D* Collider2D::toRect(){
        return new RectCollider2D(Vec2(),Vec2());
    }
    RectCollider2D* RectCollider2D::toRect(){
        return this;
    }
    RectCollider2D* CircleCollider2D::toRect(){
        return new RectCollider2D(position-Vec2(-radius,-radius),Vec2(radius,radius));
    }
    BoxCollider3D* Collider3D::toBox(){
        return new BoxCollider3D(Vec3(),Vec3(),Vec3());
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
            Vec2 cp=Vec2::clamp2(hb1->position,hb2->position,hb2->position+hb2->size);
            Dimention dist=Vec2::distanceSquared(hb1->position,cp);
            return (dist<hb1->radius*hb1->radius)||((hb1->position.x>=hb2->position.x&&hb1->position.x<=hb2->position.x+hb2->size.x)&&(hb1->position.y>=hb2->position.y&&hb1->position.y<=hb2->position.y+hb2->size.y));
        };
        static OverlapCollision2D circle_with_circle_ov(CircleCollider2D* hb1,CircleCollider2D* hb2){
            Dimention dists = Vec2::distance(hb1->position,hb2->position);
            Vec2 dis=hb1->position-hb2->position;
            if(dists<0.00001){
                return OverlapCollision2D(true,Vec2(1,1));
            }
            if (dists < (hb1->radius + hb2->radius)){
                Dimention overlap=(hb1->radius + hb2->radius)-dists;
                Vec2 dire=dis/dists;
                Vec2 ret=Vec2::neg(dire*(overlap*2));
                return OverlapCollision2D(true,ret);
            }
            return OverlapCollision2D();
        }
        static OverlapCollision2D circle_with_rect_ov(CircleCollider2D* hb1,RectCollider2D* hb2,Dimention reverse){
            Vec2 val1;
            Dimention val2;
            if ((hb2->position.x <= hb1->position.x && hb1->position.x <= hb2->position.x+hb2->size.x) && (hb2->position.y <= hb1->position.y && hb1->position.y <= hb2->position.y+hb2->size.y)) {
                Vec2 halfDim = ((hb2->position+hb2->size)- hb2->position)/2;
                Vec2 p=hb1->position-(hb2->position+ halfDim);
                Vec2 p2=(Vec2::absolute(p)-halfDim)-Vec2(hb1->radius,hb1->radius);
                val1=Vec2(p.x > 0 ? 1 : -1,p.y > 0 ? 1 : -1);
                val2=p2.x;
            }else{
                Vec2 dir = Vec2::clamp2(hb1->position,hb2->position,(hb2->position+hb2->size)-hb1->position);
                Dimention dstSqr = Vec2::squared(dir);

                if (dstSqr < hb1->radius * hb1->radius) {
                    Dimention dst = sqrt(dstSqr);
                    val1=Vec2::normalizeSafe(dir,Vec2());
                    val2=hb1->radius - dst;
                }else{
                    return OverlapCollision2D();
                }
            }

            Vec2 pos=Vec2::normalizeSafe(val1/(val2*reverse),Vec2());
            if(pos==Vec2()){
                return OverlapCollision2D();
            }
            return OverlapCollision2D(true,pos);
        }
        static OverlapCollision2D rect_with_rect_ov(RectCollider2D* hb1,RectCollider2D* hb2){
            Vec2 ss=(hb1->size+hb2->size)/2;
            Vec2 dist=hb1->position-hb2->position;
            if(Vec2::absolute(dist)<ss){
                Vec2 ov=Vec2::maxDecimal(Vec2::normalizeSafe(ss-Vec2::absolute(dist),Vec2(1,0)),2);
                Vec2 ov2=Vec2();
                if(ov.x<ov.y){
                    ov2.x=dist.x>0?-ov.x:ov.x;
                }else{
                    ov2.y=dist.y>0?-ov.y:ov.y;
                }
                return OverlapCollision2D(!(ov2==Vec2()),ov2);
            }
            return OverlapCollision2D();
        }

        static OverlapCollision3D box_with_box_ov(BoxCollider3D* hb1,BoxCollider3D* hb2){
            Vec3 dist= hb1->center()-hb2->center();
            Vec3 ss=(hb1->transform.scale+hb2->transform.scale)/2;
            if(Vec3::absolute(dist)<ss){
                Vec3 ov=Vec3::min3(
                    ss-Vec3::absolute(dist),
                    Vec3());
                Vec3 dire=Vec3();
                Vec3 ovp=ov/ss;
                if(ovp.x<ovp.y&&ovp.x<ovp.z){
                    dire.x=dist.x<0?1:-1;
                }
                else if(ovp.y<ovp.x&&ovp.y<ovp.z){
                    dire.y=dist.y<0?1:-1;
                }else if(ovp.z<ovp.x&&ovp.z<ovp.y){
                    dire.z=dist.z<0?1:-1;
                }
                return OverlapCollision3D(true,Vec3::maxDecimal(ov*dire,3),dire-(ovp*dire),dire);
            }
            return OverlapCollision3D();
        };
    } // namespace Collision
    
} // namespace KLSE
