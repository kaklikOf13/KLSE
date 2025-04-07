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
#ifndef KLSE_UTILS_HPP
#define KLSE_UTILS_HPP
#include <algorithm>

#include <string.h>

#include <chrono>
#include <thread>
#include <functional>

#include <map>
#include "json.hpp"

#include <stdexcept>
#include <sstream>

namespace KLSE{
    const unsigned long long a = 1664525; // Multiplier
    const unsigned long long c = 1013904223; // Increment

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

    

    namespace Math
    {
        class Random{
            public:
                //INFO
                unsigned long long seed;
                unsigned long long current;

                //GENERATORS
                unsigned long long next();
                Dimention dimention();
                Dimention dimention(Dimention min, Dimention max);
                IDimention idimention();
                IDimention idimention(IDimention min, IDimention max);

                //CONSTRUCTORS
                Random();
                Random(unsigned long long seed):seed(seed){};
                Random(const std::string& seed){
                    std::hash<std::string> hasher;
                    this->seed = static_cast<unsigned long long>(hasher(seed));
                };
        };

        namespace random
        {
            Dimention dimention(Dimention min, Dimention max);
            unsigned long int object_id();
        }

        int32 Floor(float32);
        int64 Floor(float64);
    } // namespace Math

    class Formatter
    {
    public:
        Formatter() {}
        ~Formatter() {}

        template <typename Type>
        Formatter & operator << (const Type & value)
        {
            stream_ << value;
            return *this;
        }

        std::string str() const         { return stream_.str(); }
        operator std::string () const   { return stream_.str(); }

        enum ConvertToString 
        {
            to_str
        };
        std::string operator >> (ConvertToString) { return stream_.str(); }

    private:
        std::stringstream stream_;

        Formatter(const Formatter &);
        Formatter & operator = (Formatter &);
    };
    

    std::vector<std::string> splitPath(std::string path);

    using Tags = std::vector<std::string>;

    bool hasTag(Tags tags, std::string tag);

    bool hasTags(Tags tags1, Tags tags2);

    class Clock {
    private:
        double frameDuration;    // Frame duration in milliseconds
        std::chrono::high_resolution_clock::time_point lastFrameTime;
    public:
        Clock(int targetFPS, double timeScale);
        Clock(int targetFPS);
        void tick();
        double timeScale;
        double deltaTime;
    };

    class WebPath {
    private:
        std::string IP;
        int Port;
        bool HTTP;
    public:
        WebPath(std::string ip, int port, bool http = false)
            : IP(ip), Port(port), HTTP(http) {}

        std::string toString();
    };

    struct Tasks;
    struct Tasks{
        std::string task;
        std::map<std::string,Tasks> childs;
        Tasks():task(""),childs({}){};
    };

    struct KLSEDef{
        std::string name; //optional
        std::string version; //optional
        std::string owner; //optional
        Tasks windows_tasks;
        KLSEDef():name(""),version(""),owner(""),windows_tasks(Tasks()){}
    };

    using json = nlohmann::json;


    namespace KLSEFile
    {
    
        // Define how Tasks is deserialized from JSON
        void t_from_json(json& j, Tasks& t);

        // Define how KLSEFile is deserialized from JSON
        void d_from_json(json& j, KLSEDef& kf);
    }
    // namespace KLSEFile

    std::string replaceAll(std::string str, std::string toReplace, std::string replaceWith);
}
#endif