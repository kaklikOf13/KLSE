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
#include <KLSE/KLSE/net/stream.hpp>
#include <cstring>
namespace KLSE
{
    void Stream::write_uint8(uint8 val){
        content[pointer]=val;
        pointer++;
    }
    void Stream::write_uint16(uint16 val){
        content[pointer++] = val & 0xFF;
        content[pointer++] = (val >> 8) & 0xFF;
    }
    void Stream::write_uint32(uint32 val){
        content[pointer++] = val & 0xFF;
        content[pointer++] = (val >> 8) & 0xFF;
        content[pointer++] = (val >> 16) & 0xFF;
        content[pointer++] = (val >> 24) & 0xFF;
    }
    void Stream::write_uint64(uint64 val){
        content[pointer++] = val & 0xFF;
        content[pointer++] = (val >> 8) & 0xFF;
        content[pointer++] = (val >> 16) & 0xFF;
        content[pointer++] = (val >> 24) & 0xFF;
        content[pointer++] = (val >> 32) & 0xFF;
        content[pointer++] = (val >> 40) & 0xFF;
        content[pointer++] = (val >> 48) & 0xFF;
        content[pointer++] = (val >> 56) & 0xFF;
    }

    void Stream::write_float32(float32 val) {
        content[pointer++] = Math::Floor(val) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 8) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 16) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 24) & 0xFF;
    }
    void Stream::write_float64(float64 val) {
        content[pointer++] = Math::Floor(val) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 8) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 16) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 24) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 32) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 40) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 48) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 56) & 0xFF;
    }
    void Stream::write_vec2(Vec2& val) {
        write_float64(val.x);
        write_float64(val.y);
    }
    void Stream::write_ivec2(IVec2& val) {
        write_uint64(val.x);
        write_uint64(val.y);
    }
    void Stream::write_vec3(Vec3& val) {
        write_float64(val.x);
        write_float64(val.y);
        write_float64(val.z);
    }
    void Stream::write_ivec3(IVec3& val) {
        write_uint64(val.x);
        write_uint64(val.y);
        write_uint64(val.z);
    }
    void Stream::write_bytes(byte* val, uint64 size) {
        memcpy(content+pointer,val,size);
        pointer+=size;
    }
    void Stream::write_string(STD::string& val,byte sizeb) {
        switch (sizeb)
        {
        case 1:
            write_uint8(val.length);
            break;
        case 2:
            write_uint16(val.length);
            break;
        case 4:
            write_uint32(val.length);
            break;
        case 8:
            write_uint64(val.length);
            break;
        default:
            break;
        }
        memcpy(content+pointer,val.value,val.length);
        pointer+=val.length;
    }
    void Stream::write_color(Color& val) {
        write_uint8(static_cast<int>(val.r*255));
        write_uint8(static_cast<int>(val.g*255));
        write_uint8(static_cast<int>(val.b*255));
        write_uint8(static_cast<int>(val.a*255));
    }
    uint8 Stream::read_uint8(){
        return content[pointer++];
    }
    uint16 Stream::read_uint16(){
        uint16 val = content[pointer] | (content[pointer + 1] << 8);
        pointer += 2;
        return val;
    }
    uint32 Stream::read_uint32(){
        uint32 val = content[pointer] | (content[pointer + 1] << 8) |
             (content[pointer + 2] << 16) | (content[pointer + 3] << 24);
        pointer += 4;
        return val;
    }
    uint64 Stream::read_uint64(){
        uint64 val = static_cast<uint64>(content[pointer]) |
             (static_cast<uint64>(content[pointer + 1]) << 8) |
             (static_cast<uint64>(content[pointer + 2]) << 16) |
             (static_cast<uint64>(content[pointer + 3]) << 24) |
             (static_cast<uint64>(content[pointer + 4]) << 32) |
             (static_cast<uint64>(content[pointer + 5]) << 40) |
             (static_cast<uint64>(content[pointer + 6]) << 48) |
             (static_cast<uint64>(content[pointer + 7]) << 56);
        pointer += 8;
        return val;
    }
    float32 Stream::read_float32(){
        union {
            uint32 i;
            float f;
        } converter;
        converter.i = read_uint32();
        return converter.f;
    }
    float64 Stream::read_float64(){
        union {
            uint64 i;
            double d;
        } converter;
        converter.i = read_uint64();
        return converter.d;
    }
    Vec2 Stream::read_vec2() {
        return Vec2(read_float64(),read_float64());
    }
    IVec2 Stream::read_ivec2() {
        return IVec2(read_uint64(),read_uint64());
    }
    Vec3 Stream::read_vec3() {
        return Vec3(read_float64(),read_float64(),read_float64());
    }
    IVec3 Stream::read_ivec3() {
        return IVec3(read_uint64(),read_uint64(),read_uint64());
    }
    byte* Stream::read_bytes(uint64 size){
        byte* ret=content+pointer;
        pointer+=size;
        return ret;
    }
    STD::string Stream::read_string(byte ssize){
        uint64 size=0;
        switch(ssize){
            case 1:
                size=read_uint8();
            case 2:
                size=read_uint16();
            case 4:
                size=read_uint32();
            case 8:
                size=read_uint64();
        }
        byte* ret=new byte[ssize+1];
        memcpy(ret,content+pointer,size);
        pointer+=size;
        return STD::string(reinterpret_cast<const char*>(ret),size);
    }
    Color Stream::read_color() {
        return Color(static_cast<float>(read_uint8())*255,static_cast<float>(read_uint8())*255,static_cast<float>(read_uint8())*255,static_cast<float>(read_uint8())*255);
    }
} // namespace KLSE
