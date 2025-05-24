#ifndef KLSE_BASICS_TYPES_HPP
#define KLSE_BASICS_TYPES_HPP
namespace KLSE
{
    const unsigned long long random_a = 1664525; // Multiplier
    const unsigned long long random_c = 1013904223; // Increment
    using byte=unsigned char;

    using uint8=byte;
    #define UINT8_LIMIT 255;
    using uint16=short unsigned;
    #define UINT16_LIMIT 65535;
    using uint32=unsigned;
    #define UINT32_LIMIT 4294967295;
    using uint64=long long unsigned;
    #define UINT64_LIMIT 18446744073709551615;

    #define INT8_LIMIT 128;
    using int8=char;
    #define INT16_LIMIT 32767;
    using int16=short int;
    #define INT64_LIMIT 2147483647;
    using int32=int;
    #define INT32_LIMIT 9223372036854775807;
    using int64=long long int;

    using float32=float;
    using float64=double;

    typedef float64 Dimention;
    typedef int64 IDimention;

    struct ZeroStruct{};
    class ZeroClass{public:ZeroClass(){};~ZeroClass()=default;};

    struct Color {
        float r; // Red component (0.0 to 1.0)
        float g; // Green component (0.0 to 1.0)
        float b; // Blue component (0.0 to 1.0)
        float a; // Alpha component (0.0 to 1.0)
        Color():r(0),g(0),b(0),a(1){};
        Color(float r,float g, float b):r(r),g(g),b(b),a(1){};
        Color(float r,float g, float b, float a):r(r),g(g),b(b),a(a){};
        static Color lerp(Color a, Color b, Dimention t);
    };

    union number32{
        float32 f;
        uint32 ui;
        int32 i;
    };
    union number64{
        float64 f;
        uint64 ui;
        int64 i;
    };
} // namespace KLSE
#endif