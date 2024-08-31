#ifndef KLSE_GEOMETRY_HPP
#define KLSE_GEOMETRY_HPP
#include <iostream>
#include <cmath>
namespace KLSE{
    typedef double Dimention;
    typedef int IDimention;
    #pragma region Vec2

    typedef float RadAngle;
    typedef int DegAngle;

    struct Vec2{
        Dimention x;
        Dimention y;

        Vec2() : x(0), y(0) {};
        Vec2(Dimention x, Dimention y) : x(x), y(y) {};
        //Vec2(IVec2 t) : x(static_cast<Dimention>(t.x)), y(static_cast<Dimention>(t.y)) {};
        ~Vec2()=default;
    
        static Vec2 random(Dimention min, Dimention max);

        static Vec2 random2(Vec2 min, Vec2 max);

        static Vec2 add(Vec2 a, Vec2 b);

        static Vec2 sub(Vec2 a, Vec2 b);

        static Vec2 mult(Vec2 a, Vec2 b);

        static Vec2 div(Vec2 a, Vec2 b);

        static Vec2 scale(Vec2 a, Dimention scalar);

        static Vec2 dscale(Vec2 a, Dimention scalar);

        static bool is(Vec2 a, Vec2 b);

        static bool greater(Vec2 a, Vec2 b);

        static bool less(Vec2 a, Vec2 b);

        static bool isEqual(Vec2 a, Vec2 b);

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
    };

    struct IVec2{
        IDimention x;
        IDimention y;

        IVec2() : x(0), y(0) {}
        IVec2(IDimention x, IDimention y) : x(x), y(y) {}
        //IVec2(Vec2 t) : x(static_cast<IDimention>(t.x)), y(static_cast<IDimention>(t.y)) {}
        ~IVec2()=default;

        static IVec2 random(IDimention min, IDimention max);

        static IVec2 random2(IVec2 min, IVec2 max);

        static IVec2 add(IVec2 a, IVec2 b);

        static IVec2 sub(IVec2 a, IVec2 b);

        static IVec2 mult(IVec2 a, IVec2 b);

        static IVec2 div(IVec2 a, IVec2 b);

        static IVec2 scale(IVec2 a, IDimention scalar);

        static IVec2 dscale(IVec2 a, IDimention scalar);

        static bool is(IVec2 a, IVec2 b);

        static bool greater(IVec2 a, IVec2 b);

        static bool less(IVec2 a, IVec2 b);

        static bool isEqual(IVec2 a, IVec2 b);

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
    };
    
    #pragma endregion

    #pragma region Vec3

    struct Vec3{
        Dimention x;
        Dimention y;
        Dimention z;

        Vec3() : x(0), y(0), z(0) {}
        Vec3(Dimention x, Dimention y, Dimention z) : x(x), y(y), z(z) {}
        ~Vec3()=default;

        static Vec3 random(Dimention min, Dimention max);

        static Vec3 random3(Vec3 min, Vec3 max);

        static Vec3 add(Vec3 a, Vec3 b);

        static Vec3 sub(Vec3 a, Vec3 b);

        static Vec3 mult(Vec3 a, Vec3 b);

        static Vec3 div(Vec3 a, Vec3 b);

        static Vec3 scale(Vec3 a, Dimention scalar);

        static Vec3 dscale(Vec3 a, Dimention scalar);

        static bool is(Vec3 a, Vec3 b);

        static bool greater(Vec3 a, Vec3 b);

        static bool less(Vec3 a, Vec3 b);

        static bool isEqual(Vec3 a, Vec3 b);

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
        
    };

    #pragma endregion

    const Dimention prime1 = 2654435761;
    const Dimention prime2 = 2246822519;

    namespace Math
    {
        const Dimention PI=3.1415926;
        static RadAngle Deg2Rad(DegAngle ang){
            return ang * (PI / 180.0);
        }
        static DegAngle Rad2Deg(RadAngle ang){
            return ang * (180.0 / PI);
        }
    } // namespace math
    

    typedef Dimention HashVec2;
    typedef Dimention HashVec3;

    struct Transform3D{
        Vec3 position;
        Vec3 scale;
        Vec3 rotation;
        ~Transform3D()=default;
        Transform3D(Vec3 position, Vec3 scale, Vec3 rotation):position(position),scale(scale),rotation(rotation){}
    };
}
#endif