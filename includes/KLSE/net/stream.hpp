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

        void writeUInt8(uint8 val);
        void writeUInt16(uint16 val);
        void writeUInt32(uint32 val);
        void writeUInt64(uint64 val);
        void writeFloat32(float32 val);
        void writeFloat64(float64 val);

        uint8 readUInt8();
        uint16 readUInt16();
        uint32 readUInt32();
        uint64 readUInt64();
        float32 readFloat32();
        float64 readFloat64();
    };
} // namespace KLSE

#endif