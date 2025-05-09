#ifndef KLSE_BASICS_TYPES_HPP
#define KLSE_BASICS_TYPES_HPP
namespace KLSE
{
    const unsigned long long random_a = 1664525; // Multiplier
    const unsigned long long random_c = 1013904223; // Increment
    using byte=unsigned char;

    using uint8=byte;
    using uint16=short unsigned;
    using uint32=unsigned;
    using uint64=long long unsigned;

    using int8=char;
    using int16=short int;
    using int32=int;
    using int64=long long int;

    using float32=float;
    using float64=double;

    typedef float64 Dimention;
    typedef int64 IDimention;

    struct ZeroStruct{};
    class ZeroClass{public:ZeroClass(){};~ZeroClass()=default;};
} // namespace KLSE
#endif