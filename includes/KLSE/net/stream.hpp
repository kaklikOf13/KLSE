#ifndef KLSE_NET_STREAM_HPP
#define KLSE_NET_STREAM_HPP
#include "../utils.hpp"
namespace KLSE
{
    class Stream{
        public:
        byte* content;
        uint32 pointer;
        uint32 alloc;

        Stream(uint32 pre_alloc):alloc(alloc), pointer(0){
           content=new byte[pre_alloc]; 
        }
        ~Stream(){
            delete[] content;
        }

        void writeUInt8(uint8 val){
            content[pointer]=val;
            pointer++;
        }
        void writeUInt16(uint16 val){
            content[pointer++] = val & 0xFF;
            content[pointer++] = (val >> 8) & 0xFF;
        }
        void writeUInt32(uint32 val){
            content[pointer++] = val & 0xFF;
            content[pointer++] = (val >> 8) & 0xFF;
            content[pointer++] = (val >> 16) & 0xFF;
            content[pointer++] = (val >> 24) & 0xFF;
        }
        void writeUInt64(uint64 val){
            content[pointer++] = val & 0xFF;
            content[pointer++] = (val >> 8) & 0xFF;
            content[pointer++] = (val >> 16) & 0xFF;
            content[pointer++] = (val >> 24) & 0xFF;
            content[pointer++] = (val >> 32) & 0xFF;
            content[pointer++] = (val >> 40) & 0xFF;
            content[pointer++] = (val >> 48) & 0xFF;
            content[pointer++] = (val >> 56) & 0xFF;
        }

        void writeFloat32(float32 val) {
            content[pointer++] = (uint32)val & 0xFF;
            content[pointer++] = ((uint32)val >> 8) & 0xFF;
            content[pointer++] = ((uint32)val >> 16) & 0xFF;
            content[pointer++] = ((uint32)val >> 24) & 0xFF;
        }
        void writeFloat64(float64 val) {
            content[pointer++] = (uint64)val & 0xFF;
            content[pointer++] = ((uint64)val >> 8) & 0xFF;
            content[pointer++] = ((uint64)val >> 16) & 0xFF;
            content[pointer++] = ((uint64)val >> 24) & 0xFF;
            content[pointer++] = ((uint64)val >> 32) & 0xFF;
            content[pointer++] = ((uint64)val >> 40) & 0xFF;
            content[pointer++] = ((uint64)val >> 48) & 0xFF;
            content[pointer++] = ((uint64)val >> 56) & 0xFF;
        }
    };
} // namespace KLSE

#endif