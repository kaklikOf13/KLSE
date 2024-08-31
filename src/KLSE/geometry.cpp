#include <KLSE/geometry.hpp>
#include <KLSE/utils.hpp>
namespace KLSE{
    #pragma region Vec2
    Vec2 Vec2::random(Dimention min, Dimention max) {
        return Vec2(random::dimention(min, max), random::dimention(min, max));
    }

    Vec2 Vec2::random2(Vec2 min, Vec2 max) {
        return Vec2(random::dimention(min.x, max.x), random::dimention(min.y, max.y));
    }

    Vec2 Vec2::add(Vec2 a, Vec2 b) {
        return Vec2(a.x + b.x, a.y + b.y);
    }

    Vec2 Vec2::sub(Vec2 a, Vec2 b) {
        return Vec2(a.x - b.x, a.y - b.y);
    }

    Vec2 Vec2::mult(Vec2 a, Vec2 b) {
        return Vec2(a.x * b.x, a.y * b.y);
    }

    Vec2 Vec2::div(Vec2 a, Vec2 b) {
        return Vec2(a.x / b.x, a.y / b.y);
    }

    Vec2 Vec2::scale(Vec2 a, Dimention scalar) {
        return Vec2(a.x * scalar, a.y * scalar);
    }

    Vec2 Vec2::dscale(Vec2 a, Dimention scalar) {
        return Vec2(a.x / scalar, a.y / scalar);
    }

    bool Vec2::is(Vec2 a, Vec2 b) {
        return a.x == b.x && a.y == b.y;
    }

    bool Vec2::greater(Vec2 a, Vec2 b) {
        return a.x > b.x && a.y > b.y;
    }

    bool Vec2::less(Vec2 a, Vec2 b) {
        return a.x < b.x && a.y < b.y;
    }

    bool Vec2::isEqual(Vec2 a, Vec2 b) {
        return a.x == b.x && a.y == b.y;
    }

    bool Vec2::greaterOr(Vec2 a, Vec2 b) {
        return a.x > b.x || a.y > b.y;
    }

    bool Vec2::lessOr(Vec2 a, Vec2 b) {
        return a.x < b.x || a.y < b.y;
    }

    bool Vec2::isOr(Vec2 a, Vec2 b) {
        return a.x == b.x || a.y == b.y;
    }

    Vec2 Vec2::absolute(Vec2 a) {
        return Vec2(abs(a.x), abs(a.y));
    }

    Vec2 Vec2::maxDecimal(Vec2 vec, int decimalPlaces) {
        Dimention factor = std::pow(10.0f, decimalPlaces);
        return Vec2(std::round(vec.x * factor) / factor, std::round(vec.y * factor) / factor);
    }

    Vec2 Vec2::round(Vec2 vec) {
        return Vec2(std::round(vec.x), std::round(vec.y));
    }

    Vec2 Vec2::min1(Vec2 vec, Dimention min) {
        return Vec2(std::max(vec.x, min), std::max(vec.y, min));
    }

    Vec2 Vec2::min2(Vec2 a, Vec2 b) {
        return Vec2(std::max(a.x, b.x), std::max(a.y, b.y));
    }

    Vec2 Vec2::max1(Vec2 vec, Dimention max) {
        return Vec2(std::min(vec.x, max), std::min(vec.y, max));
    }

    Vec2 Vec2::max2(Vec2 a, Vec2 b) {
        return Vec2(std::min(a.x, b.x), std::min(a.y, b.y));
    }

    Vec2 Vec2::clamp1(Vec2 vec, Dimention min, Dimention max) {
        return Vec2(std::max(std::min(vec.x, max), min), std::max(std::min(vec.y, max), min));
    }

    Vec2 Vec2::clamp2(Vec2 vec, Vec2 min, Vec2 max) {
        return Vec2(std::max(std::min(vec.x, max.x), min.x), std::max(std::min(vec.y, max.y), min.y));
    }

    Vec2 Vec2::lerp(Vec2 current, Vec2 end, Dimention interpolation) {
        return add(scale(current, 1 - interpolation), scale(end, interpolation));
    }

    Vec2 Vec2::normalizeSafe(Vec2 vec, Vec2 fallback) {
        Dimention len = length(vec);
        return len > 0.000001f ? Vec2(vec.x / len, vec.y / len) : fallback;
    }

    Vec2 Vec2::normalize(Vec2 vec) {
        Dimention len = length(vec);
        return len > 0.000001f ? Vec2(vec.x / len, vec.y / len) : vec;
    }

    Vec2 Vec2::neg(Vec2 vec) {
        return Vec2(-vec.x, -vec.y);
    }

    Dimention Vec2::squared(Vec2 vec) {
        return vec.x * vec.x + vec.y * vec.y;
    }

    Dimention Vec2::dot(Vec2 a, Vec2 b) {
        return a.x * b.x + a.y * b.y;
    }

    Dimention Vec2::cross(Vec2 a, Vec2 b) {
        return a.x * b.y - a.y * b.x;
    }

    Dimention Vec2::distanceSquared(Vec2 a, Vec2 b) {
        Dimention dx = a.x - b.x;
        Dimention dy = a.y - b.y;
        return dx * dx + dy * dy;
    }

    Dimention Vec2::distance(Vec2 a, Vec2 b) {
        return std::sqrt(distanceSquared(a, b));
    }


    Vec2 Vec2::floor(Vec2 vec) {
        return Vec2(std::floor(vec.x), std::floor(vec.y));
    }

    Vec2 Vec2::ceil(Vec2 vec) {
        return Vec2(std::ceil(vec.x), std::ceil(vec.y));
    }

    Vec2 Vec2::duplicate(Vec2 vec) {
        return Vec2(vec.x,vec.y);
    }

    Dimention Vec2::length(Vec2 vec) {
        return std::sqrt(squared(vec));
    }

    RadAngle Vec2::lookAt(Vec2 a,Vec2 b){
        return std::atan2(b.y-a.y,a.x-b.x);
    }

    std::string Vec2::toString(Vec2 vec){
        return "{ X: "+std::to_string(vec.x)+", Y: "+std::to_string(vec.y)+" }";
    }

    //#DefIVec2

    IVec2 IVec2::random(IDimention min, IDimention max) {
        return IVec2(random::dimention(min, max), random::dimention(min, max));
    }

    IVec2 IVec2::random2(IVec2 min, IVec2 max) {
        return IVec2(random::dimention(min.x, max.x), random::dimention(min.y, max.y));
    }

    IVec2 IVec2::add(IVec2 a, IVec2 b) {
        return IVec2(a.x + b.x, a.y + b.y);
    }

    IVec2 IVec2::sub(IVec2 a, IVec2 b) {
        return IVec2(a.x - b.x, a.y - b.y);
    }

    IVec2 IVec2::mult(IVec2 a, IVec2 b) {
        return IVec2(a.x * b.x, a.y * b.y);
    }

    IVec2 IVec2::div(IVec2 a, IVec2 b) {
        return IVec2(a.x / b.x, a.y / b.y);
    }

    IVec2 IVec2::scale(IVec2 a, IDimention scalar) {
        return IVec2(a.x * scalar, a.y * scalar);
    }

    IVec2 IVec2::dscale(IVec2 a, IDimention scalar) {
        return IVec2(a.x / scalar, a.y / scalar);
    }

    bool IVec2::is(IVec2 a, IVec2 b) {
        return a.x == b.x && a.y == b.y;
    }

    bool IVec2::greater(IVec2 a, IVec2 b) {
        return a.x > b.x && a.y > b.y;
    }

    bool IVec2::less(IVec2 a, IVec2 b) {
        return a.x < b.x && a.y < b.y;
    }

    bool IVec2::isEqual(IVec2 a, IVec2 b) {
        return a.x == b.x && a.y == b.y;
    }

    bool IVec2::greaterOr(IVec2 a, IVec2 b) {
        return a.x > b.x || a.y > b.y;
    }

    bool IVec2::lessOr(IVec2 a, IVec2 b) {
        return a.x < b.x || a.y < b.y;
    }

    bool IVec2::isOr(IVec2 a, IVec2 b) {
        return a.x == b.x || a.y == b.y;
    }

    IVec2 IVec2::absolute(IVec2 a) {
        return IVec2(abs(a.x), abs(a.y));
    }

    IVec2 IVec2::maxDecimal(IVec2 vec, int decimalPlaces) {
        IDimention factor = std::pow(10.0f, decimalPlaces);
        return IVec2(std::round(vec.x * factor) / factor, std::round(vec.y * factor) / factor);
    }

    IVec2 IVec2::round(IVec2 vec) {
        return IVec2(std::round(vec.x), std::round(vec.y));
    }

    IVec2 IVec2::min1(IVec2 vec, IDimention min) {
        return IVec2(std::max(vec.x, min), std::max(vec.y, min));
    }

    IVec2 IVec2::min2(IVec2 a, IVec2 b) {
        return IVec2(std::max(a.x, b.x), std::max(a.y, b.y));
    }

    IVec2 IVec2::max1(IVec2 vec, IDimention max) {
        return IVec2(std::min(vec.x, max), std::min(vec.y, max));
    }

    IVec2 IVec2::max2(IVec2 a, IVec2 b) {
        return IVec2(std::min(a.x, b.x), std::min(a.y, b.y));
    }

    IVec2 IVec2::clamp1(IVec2 vec, IDimention min, IDimention max) {
        return IVec2(std::max(std::min(vec.x, max), min), std::max(std::min(vec.y, max), min));
    }

    IVec2 IVec2::clamp2(IVec2 vec, IVec2 min, IVec2 max) {
        return IVec2(std::max(std::min(vec.x, max.x), min.x), std::max(std::min(vec.y, max.y), min.y));
    }

    IVec2 IVec2::lerp(IVec2 current, IVec2 end, IDimention interpolation) {
        return add(scale(current, 1 - interpolation), scale(end, interpolation));
    }

    IVec2 IVec2::normalizeSafe(IVec2 vec, IVec2 fallback) {
        IDimention len = length(vec);
        return len > 0.000001f ? IVec2(vec.x / len, vec.y / len) : fallback;
    }

    IVec2 IVec2::normalize(IVec2 vec) {
        IDimention len = length(vec);
        return len > 0.000001f ? IVec2(vec.x / len, vec.y / len) : vec;
    }

    IVec2 IVec2::neg(IVec2 vec) {
        return IVec2(-vec.x, -vec.y);
    }

    IDimention IVec2::squared(IVec2 vec) {
        return vec.x * vec.x + vec.y * vec.y;
    }

    IDimention IVec2::dot(IVec2 a, IVec2 b) {
        return a.x * b.x + a.y * b.y;
    }

    IDimention IVec2::cross(IVec2 a, IVec2 b) {
        return a.x * b.y - a.y * b.x;
    }

    IDimention IVec2::distanceSquared(IVec2 a, IVec2 b) {
        IDimention dx = a.x - b.x;
        IDimention dy = a.y - b.y;
        return dx * dx + dy * dy;
    }

    IDimention IVec2::distance(IVec2 a, IVec2 b) {
        return std::sqrt(distanceSquared(a, b));
    }


    IVec2 IVec2::floor(IVec2 vec) {
        return IVec2(std::floor(vec.x), std::floor(vec.y));
    }

    IVec2 IVec2::ceil(IVec2 vec) {
        return IVec2(std::ceil(vec.x), std::ceil(vec.y));
    }

    IVec2 IVec2::duplicate(IVec2 vec) {
        return IVec2(vec.x,vec.y);
    }

    IDimention IVec2::length(IVec2 vec) {
        return std::sqrt(squared(vec));
    }

    RadAngle IVec2::lookAt(IVec2 a,IVec2 b){
        return std::atan2(b.y-a.y,a.x-b.x);
    }

    std::string IVec2::toString(IVec2 vec){
        return "{ X: "+std::to_string(vec.x)+", Y: "+std::to_string(vec.y)+" }";
    }

    #pragma endregion

    #pragma region Vec3

    Vec3 Vec3::random(Dimention min, Dimention max) {
        return Vec3(random::dimention(min, max), random::dimention(min, max), random::dimention(min, max));
    }

    Vec3 Vec3::random3(Vec3 min, Vec3 max) {
        return Vec3(random::dimention(min.x, max.x), random::dimention(min.y, max.y), random::dimention(min.z, max.z));
    }

    Vec3 Vec3::add(Vec3 a, Vec3 b) {
        return Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    Vec3 Vec3::sub(Vec3 a, Vec3 b) {
        return Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    Vec3 Vec3::mult(Vec3 a, Vec3 b) {
        return Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    Vec3 Vec3::div(Vec3 a, Vec3 b) {
        return Vec3(a.x / b.x, a.y / b.y, a.z / b.z);
    }

    Vec3 Vec3::scale(Vec3 a, Dimention scalar) {
        return Vec3(a.x * scalar, a.y * scalar, a.z * scalar);
    }

    Vec3 Vec3::dscale(Vec3 a, Dimention scalar) {
        return Vec3(a.x / scalar, a.y / scalar, a.z / scalar);
    }

    bool Vec3::is(Vec3 a, Vec3 b) {
        return a.x == b.x && a.y == b.y && a.z == b.z;
    }

    bool Vec3::greater(Vec3 a, Vec3 b) {
        return a.x > b.x && a.y > b.y && a.z > b.z;
    }

    bool Vec3::less(Vec3 a, Vec3 b) {
        return a.x < b.x && a.y < b.y && a.z < b.z;
    }

    bool Vec3::isEqual(Vec3 a, Vec3 b) {
        return a.x == b.x && a.y == b.y && a.z == b.z;
    }

    bool Vec3::greaterOr(Vec3 a, Vec3 b) {
        return a.x > b.x || a.y > b.y || a.z > b.z;
    }

    bool Vec3::lessOr(Vec3 a, Vec3 b) {
        return a.x < b.x || a.y < b.y || a.z < b.z;
    }

    bool Vec3::isOr(Vec3 a, Vec3 b) {
        return a.x == b.x || a.y == b.y || a.z == b.z;
    }

    Vec3 Vec3::absolute(Vec3 a) {
        return Vec3(std::abs(a.x), std::abs(a.y), std::abs(a.z));
    }

    Vec3 Vec3::maxDecimal(Vec3 vec, int decimalPlaces) {
        Dimention factor = std::pow(10.0f, decimalPlaces);
        return Vec3(std::round(vec.x * factor) / factor, std::round(vec.y * factor) / factor, std::round(vec.z * factor) / factor);
    }

    Vec3 Vec3::round(Vec3 vec) {
        return Vec3(std::round(vec.x), std::round(vec.y), std::round(vec.z));
    }

    Vec3 Vec3::min1(Vec3 vec, Dimention min) {
        return Vec3(std::max(vec.x, min), std::max(vec.y, min), std::max(vec.z, min));
    }

    Vec3 Vec3::min3(Vec3 a, Vec3 b) {
        return Vec3(std::max(a.x, b.x), std::max(a.y, b.y), std::max(a.z, b.z));
    }

    Vec3 Vec3::max1(Vec3 vec, Dimention max) {
        return Vec3(std::min(vec.x, max), std::min(vec.y, max), std::min(vec.z, max));
    }

    Vec3 Vec3::max3(Vec3 a, Vec3 b) {
        return Vec3(std::min(a.x, b.x), std::min(a.y, b.y), std::min(a.z, b.z));
    }

    Vec3 Vec3::clamp1(Vec3 vec, Dimention min, Dimention max) {
        return Vec3(std::max(std::min(vec.x, max), min), std::max(std::min(vec.y, max), min), std::max(std::min(vec.z, max), min));
    }

    Vec3 Vec3::clamp3(Vec3 vec, Vec3 min, Vec3 max) {
        return Vec3(std::max(std::min(vec.x, max.x), min.x), std::max(std::min(vec.y, max.y), min.y), std::max(std::min(vec.z, max.z), min.z));
    }

    Vec3 Vec3::lerp(Vec3 current, Vec3 end, Dimention interpolation) {
        return add(scale(current, 1 - interpolation), scale(end, interpolation));
    }

    Vec3 Vec3::normalizeSafe(Vec3 vec, Vec3 fallback) {
        Dimention len = length(vec);
        return len > 0.000001f ? Vec3(vec.x / len, vec.y / len, vec.z / len) : fallback;
    }

    Vec3 Vec3::normalize(Vec3 vec) {
        Dimention len = length(vec);
        return len > 0.000001f ? Vec3(vec.x / len, vec.y / len, vec.z / len) : vec;
    }

    Vec3 Vec3::neg(Vec3 vec) {
        return Vec3(-vec.x, -vec.y, -vec.z);
    }

    Dimention Vec3::squared(Vec3 vec) {
        return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z;
    }

    Dimention Vec3::dot(Vec3 a, Vec3 b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    Dimention Vec3::cross(Vec3 a, Vec3 b) {
        return a.x * b.x - a.y * b.y - a.z * b.z;
    }

    Dimention Vec3::distanceSquared(Vec3 a, Vec3 b) {
        Dimention dx = a.x - b.x;
        Dimention dy = a.y - b.y;
        Dimention dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    }

    Dimention Vec3::distance(Vec3 a, Vec3 b) {
        return sqrt(distanceSquared(a, b));
    }

    Vec3 Vec3::floor(Vec3 vec) {
        return Vec3(std::floor(vec.x), std::floor(vec.y), std::floor(vec.z));
    }

    Vec3 Vec3::ceil(Vec3 vec) {
        return Vec3(std::ceil(vec.x), std::ceil(vec.y), std::ceil(vec.z));
    }

    Dimention Vec3::length(Vec3 vec) {
        return sqrt(squared(vec));
    }

    Vec3 Vec3::duplicate(Vec3 vec) {
        return Vec3(vec.x,vec.y,vec.z);
    }

    std::string Vec3::toString(Vec3 vec){
        return "{ X: "+std::to_string(vec.x)+", Y: "+std::to_string(vec.y)+", Z: "+std::to_string(vec.z)+" }";
    }
    #pragma endregion
}