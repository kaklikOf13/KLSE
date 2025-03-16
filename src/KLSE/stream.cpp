#include <KLSE/net/stream.hpp>
namespace KLSE
{
    void Stream::writeUInt8(uint8 val){
        content[pointer]=val;
        pointer++;
    }
    void Stream::writeUInt16(uint16 val){
        content[pointer++] = val & 0xFF;
        content[pointer++] = (val >> 8) & 0xFF;
    }
    void Stream::writeUInt32(uint32 val){
        content[pointer++] = val & 0xFF;
        content[pointer++] = (val >> 8) & 0xFF;
        content[pointer++] = (val >> 16) & 0xFF;
        content[pointer++] = (val >> 24) & 0xFF;
    }
    void Stream::writeUInt64(uint64 val){
        content[pointer++] = val & 0xFF;
        content[pointer++] = (val >> 8) & 0xFF;
        content[pointer++] = (val >> 16) & 0xFF;
        content[pointer++] = (val >> 24) & 0xFF;
        content[pointer++] = (val >> 32) & 0xFF;
        content[pointer++] = (val >> 40) & 0xFF;
        content[pointer++] = (val >> 48) & 0xFF;
        content[pointer++] = (val >> 56) & 0xFF;
    }

    void Stream::writeFloat32(float32 val) {
        content[pointer++] = Math::Floor(val) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 8) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 16) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 24) & 0xFF;
    }
    void Stream::writeFloat64(float64 val) {
        content[pointer++] = Math::Floor(val) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 8) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 16) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 24) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 32) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 40) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 48) & 0xFF;
        content[pointer++] = (Math::Floor(val) >> 56) & 0xFF;
    }

    uint8 Stream::readUInt8(){
        return content[pointer++];
    }
    uint16 Stream::readUInt16(){
        uint16 val = content[pointer] | (content[pointer + 1] << 8);
        pointer += 2;
        return val;
    }
    uint32 Stream::readUInt32(){
        uint32 val = content[pointer] | (content[pointer + 1] << 8) |
             (content[pointer + 2] << 16) | (content[pointer + 3] << 24);
        pointer += 4;
        return val;
    }
    uint64 Stream::readUInt64(){
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
    float32 Stream::readFloat32(){
        union {
            uint32 i;
            float f;
        } converter;
        converter.i = readUInt32();
        return converter.f;
    }
    float64 Stream::readFloat64(){
        union {
            uint64 i;
            double d;
        } converter;
        converter.i = readUInt64();
        return converter.d;
    }
} // namespace KLSE
