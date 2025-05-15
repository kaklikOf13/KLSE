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
#include <algorithm>
#include <KLSE/KLSE/others/utils.hpp>
#include <KLSE/KLSE/physics/geometry.hpp>
#include <iostream>
#include <thread>
namespace KLSE{

    namespace Math
    {
        unsigned long long Random::next(){
            // Update current using modulo
            current = (current + 1) % (IDimentionLimit / 23);

            // LCG calculation
            uint64_t x = (seed + random_a * (current * 23) + random_c) % IDimentionLimit;

            // XORShift
            x ^= x >> 21;
            x ^= x << 35;
            x ^= x >> 4;

            // Ensure x is within the desired limit
            x %= IDimentionLimit;

            // Return the result
            return x;
        }
        Dimention Random::dimention(){
            return static_cast<Dimention>(next()) / IDimentionLimit;
        }
        Dimention Random::dimention(Dimention min, Dimention max){
            return min+(this->dimention()*(max-min));
        }

        IDimention Random::idimention(){
            return next() / IDimentionLimit;
        }
        IDimention Random::idimention(IDimention min, IDimention max){
            return static_cast<IDimention>(ceil(min+(this->dimention()*(max-min))))%max+1;
        }
        Random::Random(){
            auto now = std::chrono::high_resolution_clock::now();
            auto duration = now.time_since_epoch();
            seed = static_cast<unsigned long long>(std::chrono::duration_cast<std::chrono::nanoseconds>(duration).count());
        }

        namespace random
        {
            Dimention dimention(Dimention min, Dimention max) {
                return min + static_cast<Dimention>(rand()) / (static_cast<Dimention>(RAND_MAX / (max - min)));
            }
            unsigned long int object_id() {
                return static_cast<unsigned long int>(rand());
            }
        }
        int32 Floor(float32 x){
            int32 i = static_cast<int32>(x);
            return (x < 0 && x != i) ? i - 1 : i;
        }
        int64 Floor(float64 x){
            int64 i = static_cast<int64>(x);
            return (x < 0 && x != i) ? i - 1 : i;
        }
    } // namespace Math

    std::vector<std::string> splitPath(std::string path) {
        std::vector<std::string> result;
        std::string temp;
        std::istringstream stream(path);
        char delimiter;

        // Determine the appropriate delimiter based on the path
        if (path.find('/') != std::string::npos) {
            delimiter = '/';
        } else {
            delimiter = '\\';
        }

        // Split the path
        while (std::getline(stream, temp, delimiter)) {
            if (!temp.empty()) {
                result.push_back(temp);
            }
        }

        // Ensure at least one element in result
        if (result.empty()) {
            result.push_back("");
        }

        return result;
    }
    bool hasTags(Tags& tags1, Tags& tags2) {
        /*for (uint64 i=0;i<tags1.length;i++) {
            if (tags2.contains(tags1[i])) {
                return true;
            }
        }*/
        return false;
    }

    void Clock::tick() {
        auto currentTime = std::chrono::high_resolution_clock::now();

        // Calculate the delta time between frames
        deltaTime = std::chrono::duration<double>(currentTime - lastFrameTime).count();

        // Sleep to maintain target frame duration (but without oversleeping)
        double sleepTime = (frameDuration * timeScale) - deltaTime;

        for(uint64 t=0;t<timeouts.size();t++){
            timeouts[t].delay-=deltaTime;
            if(timeouts[t].delay<=0){
                timeouts[t].callback();
                timeouts.erase(timeouts.begin()+t);
                t--;
            }
        }

        // Update last frame time
        lastFrameTime = std::chrono::high_resolution_clock::now();

        // Sleep only if we need to reduce time
        if (sleepTime > 0) {
            std::this_thread::sleep_for(std::chrono::duration<double>(sleepTime));
        }
    }
    void Clock::timeout(void(*callback)(),double delay) {
        if(delay<=0){
            callback();
        }else{
            timeouts.push_back({callback,delay});
        }
    }

    Clock::Clock(int targetFPS, double timeScale)
        : frameDuration(1.0 / targetFPS), timeScale(timeScale), deltaTime(0) {
        lastFrameTime = std::chrono::high_resolution_clock::now();
    }

    Clock::Clock(int targetFPS)
        : frameDuration(1.0 / targetFPS), timeScale(1.0), deltaTime(0) {
        lastFrameTime = std::chrono::high_resolution_clock::now();
    }

    /*std::string WebPath::toString() {
        std::ostringstream oss;
        oss << (HTTP ? "https://" : "http://") << IP << ":" << Port;
        return oss.str();
    }*/

    /*STD::string replaceAll(STD::string str, STD::string toReplace, STD::string replaceWith) {
        std::string result = str;
        size_t pos = 0;

        // Replace all occurrences of toReplace with replaceWith
        while ((pos = result.find(toReplace, pos)) != std::string::npos) {
            result.replace(pos, toReplace.length(), replaceWith);
            pos += replaceWith.length(); // Advance position to avoid infinite loop
        }

        return result;
    }*/
    void Init(){
        
    }
}