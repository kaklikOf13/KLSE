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
#ifndef KLSE_GEOMETRY_HPP
#define KLSE_GEOMETRY_HPP
#include <iostream>
#include <cmath>
#include "../basics/default_lib.hpp"
#include "../others/utils.hpp"
namespace KLSE{
    #pragma region Vec2

    typedef float RadAngle;
    typedef int DegAngle;

    struct IVec2;
    struct IVec3;
    
    //HASH

    typedef int64 HashIVec2;
    typedef int64 HashIVec3;

    const HashIVec2 prime1 = 51345689903;
    const HashIVec2 prime2 = 102691380403;
    const HashIVec2 prime3 = 154037072377;

    const int64 IDimentionLimit = std::numeric_limits<long>::max();

    struct Vec2{
        Dimention x;
        Dimention y;

        Vec2() : x(0), y(0) {};
        Vec2(Dimention x, Dimention y) : x(x), y(y) {};
        Vec2(IVec2 t);
    
        static Vec2 random(Dimention min, Dimention max);

        static Vec2 random2(Vec2 min, Vec2 max);

        Vec2& operator+=(const Vec2& other);
        Vec2 operator+(const Vec2& other);
        Vec2& operator+=(const IVec2& other);
        Vec2 operator+(const IVec2& other);

        Vec2& operator-=(const Vec2& other);
        Vec2 operator-(const Vec2& other);
        Vec2& operator-=(const IVec2& other);
        Vec2 operator-(const IVec2& other);

        Vec2& operator*=(const Vec2& other);
        Vec2 operator*(const Vec2& other);
        Vec2& operator*=(const IVec2& other);
        Vec2 operator*(const IVec2& other);

        Vec2& operator*=(Dimention other);
        Vec2 operator*(Dimention other);

        Vec2& operator/=(const Vec2& other);
        Vec2 operator/(const Vec2& other);
        Vec2& operator/=(const IVec2& other);
        Vec2 operator/(const IVec2& other);
    
        Vec2& operator/=(Dimention other);
        Vec2 operator/(Dimention other);

        bool operator==(const Vec2& other);
        bool operator==(const IVec2& other);

        bool operator>(const Vec2& other);
        bool operator>(const IVec2& other);
        bool operator>=(const Vec2& other);
        bool operator>=(const IVec2& other);

        bool operator<(const Vec2& other);
        bool operator<(const IVec2& other);
        bool operator<=(const Vec2& other);
        bool operator<=(const IVec2& other);

        std::ostream& operator<<(std::ostream& os);

        static bool greaterOr(Vec2 a, Vec2 b);

        static bool lessOr(Vec2 a, Vec2 b);

        static bool isOr(Vec2 a, Vec2 b);

        static Vec2 absolute(Vec2 a);

        static Vec2 maxDecimal(Vec2 vec, int decimalPlaces);

        static Vec2 round(Vec2 vec);

        static Vec2 min1(Vec2 vec, Dimention min);

        static Vec2 min2(Vec2 a, Vec2 b);

        static Vec2 max1(Vec2 vec, Dimention max);

        static Vec2 max2(Vec2 a, Vec2 b);

        static Vec2 clamp1(Vec2 vec, Dimention min, Dimention max);

        static Vec2 clamp2(Vec2 vec, Vec2 min, Vec2 max);

        static Vec2 lerp(Vec2 current, Vec2 end, Dimention interpolation);

        static Vec2 normalizeSafe(Vec2 vec, Vec2 fallback);

        static Vec2 normalize(Vec2 vec);

        static Vec2 duplicate(Vec2 vec);

        static Vec2 neg(Vec2 vec);

        static Dimention squared(Vec2 vec);

        static Dimention dot(Vec2 a, Vec2 b);

        static Dimention cross(Vec2 a, Vec2 b);

        static Dimention distanceSquared(Vec2 a, Vec2 b);

        static Dimention distance(Vec2 a, Vec2 b);

        static Vec2 floor(Vec2 vec);

        static Vec2 ceil(Vec2 vec);

        static RadAngle lookAt(Vec2 a,Vec2 b);

        static Dimention length(Vec2 vec);

        static STD::string toString(Vec2 vec);
    };

    Vec2 operator*(Dimention left,const Vec2& right);
    Vec2 operator/(Dimention left,const Vec2& right);

    struct IVec2{
        IDimention x;
        IDimention y;

        IVec2() : x(0), y(0) {}
        IVec2(IDimention x, IDimention y) : x(x), y(y) {}
        IVec2(Vec2 t) : x(static_cast<IDimention>(t.x)), y(static_cast<IDimention>(t.y)) {}

        static IVec2 random(IDimention min, IDimention max);

        static IVec2 random2(IVec2 min, IVec2 max);

        IVec2& operator+=(const Vec2& other);
        IVec2 operator+(const Vec2& other);
        IVec2& operator+=(const IVec2& other);
        IVec2 operator+(const IVec2& other);

        IVec2& operator-=(const Vec2& other);
        IVec2 operator-(const Vec2& other);
        IVec2& operator-=(const IVec2& other);
        IVec2 operator-(const IVec2& other);

        IVec2& operator*=(const Vec2& other);
        IVec2 operator*(const Vec2& other);
        IVec2& operator*=(const IVec2& other);
        IVec2 operator*(const IVec2& other);
        IVec2& operator*=(IDimention other);
        IVec2 operator*(IDimention other);

        IVec2& operator/=(const Vec2& other);
        IVec2 operator/(const Vec2& other);
        IVec2& operator/=(const IVec2& other);
        IVec2 operator/(const IVec2& other);
        IVec2& operator/=(IDimention other);
        IVec2 operator/(IDimention other);

        bool operator==(const Vec2& other);
        bool operator==(const IVec2& other);

        bool operator>(const Vec2& other);
        bool operator>(const IVec2& other);
        bool operator>=(const Vec2& other);
        bool operator>=(const IVec2& other);

        bool operator<(const Vec2& other);
        bool operator<(const IVec2& other);
        bool operator<=(const Vec2& other);
        bool operator<=(const IVec2& other);

        std::ostream& operator<<(std::ostream& os);

        static bool greaterOr(IVec2 a, IVec2 b);

        static bool lessOr(IVec2 a, IVec2 b);

        static bool isOr(IVec2 a, IVec2 b);

        static IVec2 absolute(IVec2 a);

        static IVec2 maxDecimal(IVec2 vec, int decimalPlaces);

        static IVec2 round(IVec2 vec);

        static IVec2 min1(IVec2 vec, IDimention min);

        static IVec2 min2(IVec2 a, IVec2 b);

        static IVec2 max1(IVec2 vec, IDimention max);

        static IVec2 max2(IVec2 a, IVec2 b);

        static IVec2 clamp1(IVec2 vec, IDimention min, IDimention max);

        static IVec2 clamp2(IVec2 vec, IVec2 min, IVec2 max);

        static IVec2 lerp(IVec2 current, IVec2 end, IDimention interpolation);

        static IVec2 normalizeSafe(IVec2 vec, IVec2 fallback);

        static IVec2 normalize(IVec2 vec);

        static IVec2 duplicate(IVec2 vec);

        static IVec2 neg(IVec2 vec);

        static IDimention squared(IVec2 vec);

        static IDimention dot(IVec2 a, IVec2 b);

        static IDimention cross(IVec2 a, IVec2 b);

        static IDimention distanceSquared(IVec2 a, IVec2 b);

        static IDimention distance(IVec2 a, IVec2 b);

        static IVec2 floor(IVec2 vec);

        static IVec2 ceil(IVec2 vec);

        static RadAngle lookAt(IVec2 a,IVec2 b);

        static IDimention length(IVec2 vec);

        static STD::string toString(IVec2 vec);

        static HashIVec2 hash(IVec2 vec);
    };

    IVec2 operator*(IDimention left,const IVec2& right);
    IVec2 operator/(IDimention left,const IVec2& right);

    #pragma endregion

    #pragma region Vec3

    struct Vec3{
        Dimention x;
        Dimention y;
        Dimention z;

        Vec3() : x(0), y(0), z(0) {}
        Vec3(Dimention x, Dimention y, Dimention z) : x(x), y(y), z(z) {}

        static Vec3 random(Dimention min, Dimention max);

        static Vec3 random3(Vec3 min, Vec3 max);

        Vec3& operator+=(const Vec3& other);
        Vec3 operator+(const Vec3& other);
        Vec3& operator+=(const IVec3& other);
        Vec3 operator+(const IVec3& other);

        Vec3& operator-=(const Vec3& other);
        Vec3 operator-(const Vec3& other);
        Vec3& operator-=(const IVec3& other);
        Vec3 operator-(const IVec3& other);

        Vec3& operator*=(const Vec3& other);
        Vec3 operator*(const Vec3& other);
        Vec3& operator*=(const IVec3& other);
        Vec3 operator*(const IVec3& other);
        Vec3& operator*=(Dimention other);
        Vec3 operator*(Dimention other);

        Vec3& operator/=(const Vec3& other);
        Vec3 operator/(const Vec3& other);
        Vec3& operator/=(const IVec3& other);
        Vec3 operator/(const IVec3& other);
        Vec3& operator/=(Dimention other);
        Vec3 operator/(Dimention other);

        bool operator==(const Vec3& other);
        bool operator==(const IVec3& other);

        bool operator>(const Vec3& other);
        bool operator>(const IVec3& other);
        bool operator>=(const Vec3& other);
        bool operator>=(const IVec3& other);
    
        bool operator<(const Vec3& other);
        bool operator<(const IVec3& other);
        bool operator<=(const Vec3& other);
        bool operator<=(const IVec3& other);

        std::ostream& operator<<(std::ostream& os);

        static bool greaterOr(Vec3 a, Vec3 b);

        static bool lessOr(Vec3 a, Vec3 b);

        static bool isOr(Vec3 a, Vec3 b);

        static Vec3 absolute(Vec3 a);

        static Vec3 maxDecimal(Vec3 vec, int decimalPlaces);

        static Vec3 round(Vec3 vec);

        static Vec3 min1(Vec3 vec, Dimention min);

        static Vec3 min3(Vec3 a, Vec3 b);

        static Vec3 max1(Vec3 vec, Dimention max);

        static Vec3 max3(Vec3 a, Vec3 b);

        static Vec3 clamp1(Vec3 vec, Dimention min, Dimention max);

        static Vec3 clamp3(Vec3 vec, Vec3 min, Vec3 max);

        static Vec3 lerp(Vec3 current, Vec3 end, Dimention interpolation);

        static Vec3 normalizeSafe(Vec3 vec, Vec3 fallback);

        static Vec3 normalize(Vec3 vec);

        static Vec3 duplicate(Vec3 vec);

        static Vec3 neg(Vec3 vec);

        static Dimention squared(Vec3 vec);

        static Dimention dot(Vec3 a, Vec3 b);

        static Dimention cross(Vec3 a, Vec3 b);

        static Dimention distanceSquared(Vec3 a, Vec3 b);

        static Dimention distance(Vec3 a, Vec3 b);

        static Vec3 floor(Vec3 vec);

        static Vec3 ceil(Vec3 vec);

        static Dimention length(Vec3 vec);

        static STD::string toString(Vec3 vec);

        static Vec3 pyramid_loop(Vec3 vec, Dimention minY,Dimention maxY,Dimention maxLoopSize,Dimention minLoop);

        static Vec2 isometric_proj(Vec3 vec);
    };

    struct IVec3{
        IDimention x;
        IDimention y;
        IDimention z;

        IVec3() : x(0), y(0), z(0) {}
        IVec3(IDimention x, IDimention y, IDimention z) : x(x), y(y), z(z) {}

        static IVec3 random(Dimention min, Dimention max);

        static IVec3 random3(IVec3 min, IVec3 max);

        IVec3& operator+=(const Vec3& other);
        IVec3 operator+(const Vec3& other);
        IVec3& operator+=(const IVec3& other);
        IVec3 operator+(const IVec3& other);

        IVec3& operator-=(const Vec3& other);
        IVec3 operator-(const Vec3& other);
        IVec3& operator-=(const IVec3& other);
        IVec3 operator-(const IVec3& other);

        IVec3& operator*=(const Vec3& other);
        IVec3 operator*(const Vec3& other);
        IVec3& operator*=(const IVec3& other);
        IVec3 operator*(const IVec3& other);
        IVec3& operator*=(IDimention other);
        IVec3 operator*(IDimention other);

        IVec3& operator/=(const Vec3& other);
        IVec3 operator/(const Vec3& other);
        IVec3& operator/=(const IVec3& other);
        IVec3 operator/(const IVec3& other);
        IVec3& operator/=(IDimention other);
        IVec3 operator/(IDimention other);

        bool operator==(const Vec3& other);
        bool operator==(const IVec3& other);

        bool operator>(const Vec3& other);
        bool operator>(const IVec3& other);
        bool operator>=(const Vec3& other);
        bool operator>=(const IVec3& other);
    
        bool operator<(const Vec3& other);
        bool operator<(const IVec3& other);
        bool operator<=(const Vec3& other);
        bool operator<=(const IVec3& other);

        std::ostream& operator<<(std::ostream& os);

        static bool greaterOr(IVec3 a, IVec3 b);

        static bool lessOr(IVec3 a, IVec3 b);

        static bool isOr(IVec3 a, IVec3 b);

        static IVec3 absolute(IVec3 a);

        static IVec3 maxDecimal(IVec3 vec, int decimalPlaces);

        static IVec3 round(IVec3 vec);

        static IVec3 min1(IVec3 vec, Dimention min);

        static IVec3 min3(IVec3 a, IVec3 b);

        static IVec3 max1(IVec3 vec, Dimention max);

        static IVec3 max3(IVec3 a, IVec3 b);

        static IVec3 clamp1(IVec3 vec, Dimention min, Dimention max);

        static IVec3 clamp3(IVec3 vec, IVec3 min, IVec3 max);

        static IVec3 lerp(IVec3 current, IVec3 end, Dimention interpolation);

        static IVec3 normalizeSafe(IVec3 vec, IVec3 fallback);

        static IVec3 normalize(IVec3 vec);

        static IVec3 duplicate(IVec3 vec);

        static IVec3 neg(IVec3 vec);

        static Dimention squared(IVec3 vec);

        static Dimention dot(IVec3 a, IVec3 b);

        static Dimention cross(IVec3 a, IVec3 b);

        static Dimention distanceSquared(IVec3 a, IVec3 b);

        static Dimention distance(IVec3 a, IVec3 b);

        static IVec3 floor(IVec3 vec);

        static IVec3 ceil(IVec3 vec);

        static Dimention length(IVec3 vec);

        static STD::string toString(IVec3 vec);

        static HashIVec3 hash(IVec3 vec);

        static IVec3 pyramid_loop(IVec3 vec, IDimention minY, IDimention maxY, IDimention maxLoopSize, IDimention minLoop);

        static IVec2 isometric_proj(IVec3 vec);
    };

    #pragma endregion

    struct Transform3D{
        Vec3 position;
        Vec3 scale;
        Vec3 rotation;
        ~Transform3D()=default;
        Transform3D():position(Vec3()),scale(Vec3(1,1,1)),rotation(Vec3()){};
        Transform3D(Vec3 position, Vec3 scale, Vec3 rotation):position(position),scale(scale),rotation(rotation){}
    };
    struct Transform2D{
        Vec2 position;
        Dimention zIndex;
        Vec2 scale;
        Dimention rotation;

        ~Transform2D()=default;
        Transform2D():position(Vec2()),scale(Vec2(1,1)),rotation(0),zIndex(0){};
        Transform2D(Vec2 position, Vec2 scale, Dimention rotation):position(position),scale(scale),rotation(rotation){}
    };

    #pragma region Math
    namespace Math
    {
        const Dimention PI=3.1415926;
        RadAngle deg_to_rad(DegAngle ang);
        DegAngle rad_to_deg(RadAngle ang);

        Dimention mod(Dimention x, Dimention y);
        Dimention loop(Dimention n, Dimention min, Dimention max);
        Dimention loop_range(Dimention y,Dimention minY, Dimention maxY ,Dimention maxLoopSize,Dimention min_loop);

        IDimention imod(IDimention x, IDimention y);
        IDimention iloop(IDimention n, IDimention min, IDimention max);
        IDimention iloop_range(IDimention y,IDimention minY, IDimention maxY, IDimention maxLoopSize, IDimention min_loop);
    } // namespace math
    #pragma endregion
}
#endif