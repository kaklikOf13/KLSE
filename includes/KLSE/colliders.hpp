/* Copyright (c) 2025 Kaklik
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/
#ifndef KLSE_COLLIDERS_HPP
#define KLSE_COLLIDERS_HPP
#include <iostream>
#include "geometry.hpp"
#include "utils.hpp"
namespace KLSE{
    enum class ColliderType2D: unsigned char{
        circle=0,
        rect=1,
        null=2,
        //group,
    };
    enum class ColliderType3D: unsigned char{
        sphere=0,
        box=1,
        null=2,
        //group,
    };
    struct OverlapCollision2D{
        bool colliding;
        Vec2 overlap;
        OverlapCollision2D(bool colliding, Vec2 overlap):colliding(colliding),overlap(overlap){};
        OverlapCollision2D():colliding(false),overlap(Vec2()){};
    };
    struct OverlapCollision3D{
        bool colliding;
        Vec3 overlap;
        Vec3 overlapP;
        Vec3 dire;
        OverlapCollision3D(bool colliding,Vec3 overlap,Vec3 overlapP,Vec3 dire):colliding(colliding),overlap(overlap),overlapP(overlapP),dire(dire){};
        OverlapCollision3D():colliding(false),overlap(Vec3()),overlapP(Vec3(0,0,0)),dire(Vec3()){};
    };

    #pragma region Collider2D

    class RectCollider2D;

    class Collider2D{
        public:
            ColliderType2D type=ColliderType2D::null;
    
            virtual bool collidingWith(Collider2D* other);
            virtual OverlapCollision2D overlapCollision(Collider2D* other);
            virtual bool pointInside(Vec2 point);
            virtual Vec2 center();
            virtual void scale(Dimention scale);
            virtual Vec2 randomPoint();
            virtual RectCollider2D* toRect();

            Vec2 position;
            Collider2D(Vec2 position):position(position){}
            Collider2D():position(Vec2()){}
            ~Collider2D()=default;
    };
    class CircleCollider2D:public Collider2D{
        public:
            Dimention radius;

            bool collidingWith(Collider2D* other)override;
            OverlapCollision2D overlapCollision(Collider2D* other)override;
            bool pointInside(Vec2 point)override;
            Vec2 center()override;
            void scale(Dimention scale)override;
            Vec2 randomPoint()override;
            RectCollider2D* toRect()override;

            CircleCollider2D(Vec2 position,Dimention radius):Collider2D(position),radius(radius){
                type = ColliderType2D::circle;
            }
            ~CircleCollider2D()=default;
    };

    class RectCollider2D:public Collider2D{
        public:
            Vec2 size;

            bool collidingWith(Collider2D* other)override;
            OverlapCollision2D overlapCollision(Collider2D* other)override;
            bool pointInside(Vec2 point)override;
            Vec2 center()override;
            void scale(Dimention scale)override;
            Vec2 randomPoint()override;
            RectCollider2D* toRect()override;

            RectCollider2D(Vec2 position,Vec2 size):Collider2D(position),size(size){
                type = ColliderType2D::rect;
            }
            ~RectCollider2D()=default;
    };
    #pragma endregion

    #pragma region Collider3D

    class BoxCollider3D;

    class Collider3D{
        public:
            ColliderType3D type=ColliderType3D::null;
            Transform3D transform;
            Collider3D(Vec3 position, Vec3 scale, Vec3 rotation):transform(Transform3D(position,scale,rotation)){

            }
            ~Collider3D()=default;

            virtual bool collidingWith(Collider3D* other);
            virtual OverlapCollision3D overlapCollision(Collider3D* other);
            virtual bool pointInside(Vec3 point);
            virtual Vec3 center();
            virtual Vec3 randomPoint();
            virtual BoxCollider3D* toBox();
    };

    class BoxCollider3D:public Collider3D{
        public:
            BoxCollider3D(Vec3 position, Vec3 scale, Vec3 rotation):Collider3D(position,scale,rotation){
                type = ColliderType3D::box;
            }
            ~BoxCollider3D()=default;

            bool collidingWith(Collider3D* other)override;
            OverlapCollision3D overlapCollision(Collider3D* other)override;
            bool pointInside(Vec3 point)override;
            Vec3 center()override;
            Vec3 randomPoint()override;
            BoxCollider3D* toBox()override;
    };
    class SphereCollider3D:public Collider3D{
        SphereCollider3D(Vec3 position,Vec3, Vec3 scale, Vec3 rotation):Collider3D(position,scale,rotation){
            type = ColliderType3D::sphere;
        }
        ~SphereCollider3D()=default;

        bool collidingWith(Collider3D* other)override;
        OverlapCollision3D overlapCollision(Collider3D* other)override;
        bool pointInside(Vec3 point)override;
        Vec3 center()override;
        Vec3 randomPoint()override;
        BoxCollider3D* toBox()override;
    };

    #pragma endregion
    namespace _Collision
    {
        static bool circle_with_rect(CircleCollider2D* hb1,RectCollider2D *hb2);
        static OverlapCollision2D circle_with_rect_ov(CircleCollider2D* hb1,RectCollider2D *hb2,Dimention reverse);

        static OverlapCollision2D circle_with_circle_ov(CircleCollider2D* hb1,CircleCollider2D* hb2);

        static OverlapCollision2D rect_with_rect_ov(RectCollider2D *hb1,RectCollider2D *hb2);

        static OverlapCollision3D box_with_box_ov(BoxCollider3D* hb1,BoxCollider3D* hb2);

        //static OverlapCollision3D sphere_with_sphere_ov(SphereCollider3D* hb1,SphereCollider3D* hb2);
    }; // namespace _Collision
}
#endif