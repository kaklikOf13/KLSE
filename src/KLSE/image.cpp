#include <KLSE/rendering/image.hpp>
namespace KLSE
{
    Image* Image::fill(Color default_color,IVec2 size){
        Image* ret=new Image(size);
        uint64 ss=size.x*size.y;
        RGBA dd=RGBA(default_color);
        for(uint64 i = 0; i < ss; ++i) {
            ret->content[i]=dd;
        }
        return ret;
    }
    int countr_zero(uint32_t mask) {
        int count = 0;
        while ((mask & 1) == 0 && count < 32) {
            ++count;
            mask >>= 1;
        }
        return count;
    }
    
    int popcount(uint32_t mask) {
        int count = 0;
        while (mask) {
            count += (mask & 1);
            mask >>= 1;
        }
        return count;
    }
    byte extract_channel(uint32_t value, uint32_t mask) {
        if (mask == 0) return 0;
        int shift = countr_zero(mask);
        int bits = popcount(mask);
        uint32_t raw = (value & mask) >> shift;
    
        if (bits >= 8) return raw >> (bits - 8);
        else return (raw << (8 - bits)) | (raw >> (2 * bits - 8));
    }
    Image* Image::parse_bitmap(std::vector<byte> code) {
        if (code.size() < 54) return nullptr;

        if (code[0] != 'B' || code[1] != 'M') return nullptr;

        int32 width  = *(int32*)&code[18];
        int32 height = *(int32*)&code[22];
        uint16 bpp   = *(uint16*)&code[28];
        uint32 compression = *(uint32*)&code[30];
        uint32 dataOffset = *(uint32*)&code[10];

        if (width <= 0 || height == 0) {
            std::cerr << "Invalid BMP dimensions." << std::endl;
            return nullptr;
        }

        bool flipY = true;
        if (height < 0) {
            height = -height;
            flipY = false;
        }

        Image* img = new Image(IVec2(width, height));

        const byte* pixelData = code.data() + dataOffset;

        switch (bpp) {
            case 24:
                if (compression != 0) {
                    std::cerr << "Unsupported compression for 24bpp BMP: " << compression << std::endl;
                    delete img;
                    return nullptr;
                }
                {
                    int rowSize = ((width * 3 + 3) / 4) * 4;
                    for (int y = 0; y < height; ++y) {
                        int bmpY = flipY ? (height - 1 - y) : y;
                        for (int x = 0; x < width; ++x) {
                            int bmpIndex = bmpY * rowSize + x * 3;
                            if (bmpIndex + 2 >= code.size()) {
                                std::cerr << "BMP data out of bounds." << std::endl;
                                delete img;
                                return nullptr;
                            }
                            byte B = pixelData[bmpIndex + 0];
                            byte G = pixelData[bmpIndex + 1];
                            byte R = pixelData[bmpIndex + 2];
                            img->content[y * width + x] = RGBA(R, G, B, 255);
                        }
                    }
                }
                break;

            case 32:
                if(compression==0){
                    int rowSize = width * 4;
                    for (int y = 0; y < height; ++y) {
                        int bmpY = flipY ? (height - 1 - y) : y;
                        for (int x = 0; x < width; ++x) {
                            int bmpIndex = bmpY * rowSize + x * 4;
                            if (bmpIndex + 3 >= code.size()) {
                                std::cerr << "BMP data out of bounds." << std::endl;
                                delete img;
                                return nullptr;
                            }
                            byte B = pixelData[bmpIndex + 0];
                            byte G = pixelData[bmpIndex + 1];
                            byte R = pixelData[bmpIndex + 2];
                            byte A = pixelData[bmpIndex + 3];
                            img->content[y * width + x] = RGBA(R, G, B, A);
                        }
                    }
                }else if (compression == 3) {
                    // BI_BITFIELDS (bitmasks customizadas)
                    if (code.size() < dataOffset) {
                        std::cerr << "BMP too small for bitfields.\n";
                        delete img;
                        return nullptr;
                    }
    
                    uint32 redMask   = *(uint32*)&code[54];
                    uint32 greenMask = *(uint32*)&code[58];
                    uint32 blueMask  = *(uint32*)&code[62];
                    uint32 alphaMask = 0;
                    if (code.size() >= 70) {
                        alphaMask = *(uint32*)&code[66];
                    }
    
                    const byte* pixelData = code.data() + dataOffset;
                    int rowSize = width * 4;
    
                    for (int y = 0; y < height; ++y) {
                        int bmpY = flipY ? (height - 1 - y) : y;
                        for (int x = 0; x < width; ++x) {
                            int bmpIndex = bmpY * rowSize + x * 4;
                            if (bmpIndex + 3 >= code.size()) {
                                std::cerr << "BMP data out of bounds.\n";
                                delete img;
                                return nullptr;
                            }
    
                            uint32 pixel = *(uint32*)&pixelData[bmpIndex];
                            byte R = extract_channel(pixel, redMask);
                            byte G = extract_channel(pixel, greenMask);
                            byte B = extract_channel(pixel, blueMask);
                            byte A = alphaMask ? extract_channel(pixel, alphaMask) : 255;
    
                            img->content[y * width + x] = RGBA(R, G, B, A);
                        }
                    }
    
                    return img;
                }else{
                    std::cerr << "Unsupported compression for 32bpp BMP: " << compression << std::endl;
                    delete img;
                    return nullptr;
                }
                break;

            default:
                std::cerr << "Unsupported BMP bit depth: " << bpp << std::endl;
                delete img;
                return nullptr;
        }

        return img;
    }
    Image* Image::load_image(const std::string& path){
        std::ifstream file(path, std::ios::binary); // precisa ser binário
        if (!file.is_open()) {
            std::cerr << "Error On Open File: " << path << std::endl;
            return nullptr;
        }

        std::vector<byte> content((std::istreambuf_iterator<char>(file)), {});
        file.close();

        if (content.size() < 8) {
            std::cerr << "File too small: " << path << std::endl;
            return nullptr;
        }

        if (content[0] == 'B' && content[1] == 'M') {
            return parse_bitmap(content);
        }
        return nullptr;
    }
    void Image::print(Image* img){
        uint64 i=0;
        for(uint64 y=0;y<img->size.y;y++){
            for(uint64 x=0;x<img->size.x;x++){
                printf("(%llu,%llu,%llu,%llu) ",img->content[i]);
                i++;
            }
            printf("\n");
        }
    }
} // namespace KLSE
