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
#ifndef KLSE_NET_STREAM_HPP
#define KLSE_NET_STREAM_HPP
#include "../others/utils.hpp"
#include "../physics/geometry.hpp"
#include "../basics/default_lib.hpp"
namespace KLSE
{
    class Stream{
        public:
        byte* content;
        uint32 pointer;
        uint32 alloc;

        Stream(uint32 pre_alloc):pointer(0){
           content=new byte[pre_alloc];
           alloc=pre_alloc;
        }
        ~Stream(){
            delete[] content;
        }

        void write_uint8(uint8);
        void write_uint16(uint16);
        void write_uint32(uint32);
        void write_uint64(uint64);
        void write_float32(float32);
        void write_float64(float64);

        void write_bytes(byte*,uint64);
        void write_string(STD::string&,byte);

        void write_vec2(Vec2&);
        void write_ivec2(IVec2&);
        void write_vec3(Vec3&);
        void write_ivec3(IVec3&);

        void write_color(Color&);

        uint8 read_uint8();
        uint16 read_uint16();
        uint32 read_uint32();
        uint64 read_uint64();
        float32 read_float32();
        float64 read_float64();

        byte* read_bytes(uint64);
        STD::string read_string(byte);

        Vec2 read_vec2();
        IVec2 read_ivec2();
        Vec3 read_vec3();
        IVec3 read_ivec3();

        Color read_color();
        Stream* clone();
    };
} // namespace KLSE

#endif