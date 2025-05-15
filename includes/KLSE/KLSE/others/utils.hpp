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
#include "../basics/types.hpp"
#include "../basics/default_lib.hpp"
#include <algorithm>

#include <chrono>
#include <thread>
#include <functional>

#include <map>
#include <stdexcept>
#include <sstream>

namespace KLSE{

    namespace Math
    {
        class Random{
            public:
                //INFO
                uint64 seed;
                uint64 current;

                //GENERATORS
                uint64 next();
                Dimention dimention();
                Dimention dimention(Dimention min, Dimention max);
                IDimention idimention();
                IDimention idimention(IDimention min, IDimention max);

                //CONSTRUCTORS
                Random();
                Random(uint64 seed):seed(seed){};
                Random(const STD::string& seed):seed(seed.hash()){};
        };

        namespace random
        {
            Dimention dimention(Dimention min, Dimention max);
            unsigned long int object_id();
        }

        int32 Floor(float32);
        int64 Floor(float64);
    } // namespace Math

    /*class Formatter
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

        STD::string str() const         { return stream_.str(); }
        operator STD::string () const   { return stream_.str(); }

        enum ConvertToString 
        {
            to_str
        };
        STD::string operator >> (ConvertToString) { return stream_.str(); }

    private:
        std::stringstream stream_;

        Formatter(const Formatter &);
        Formatter & operator = (Formatter &);
    };*/
    

    STD::Array<STD::string> splitPath(STD::string path);

    using Tags = STD::Array<STD::string>;

    bool hasTags(Tags& tags1, Tags& tags2);
    struct Timeout{
        double delay;
        void(*callback)();
        Timeout(void(*callback)(),double delay):callback(callback),delay(delay){};
    };

    class Clock {
    private:
        double frameDuration;    // Frame duration in milliseconds
        std::chrono::high_resolution_clock::time_point lastFrameTime;
        std::vector<Timeout> timeouts;
    public:
        Clock(int targetFPS, double timeScale);
        Clock(int targetFPS);
        void tick();
        void timeout(void(*)(),double);
        double timeScale;
        double deltaTime;
    };

    /*class WebPath {
    private:
        STD::string IP;
        int Port;
        bool HTTP;
    public:
        WebPath(STD::string ip, int port, bool http = false)
            : IP(ip), Port(port), HTTP(http) {}

        STD::string toString();
    };*/
}
#endif