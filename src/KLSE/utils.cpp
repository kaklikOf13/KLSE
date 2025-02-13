#include <algorithm>
#include <KLSE/utils.hpp>
#include <KLSE/geometry.hpp>
#include <iostream>
#include <thread>
namespace KLSE{

    namespace Math
    {
        unsigned long long Random::next(){
            // Update current using modulo
            current = (current + 1) % (IDimentionLimit / 23);

            // LCG calculation
            uint64_t x = (seed + a * (current * 23) + c) % IDimentionLimit;

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

    bool hasTag(Tags tags, std::string tag) {
        return std::find(tags.begin(), tags.end(), tag) != tags.end();
    }

    bool hasTags(Tags tags1, Tags tags2) {
        for (const std::string& t : tags1) {
            if (std::find(tags2.begin(), tags2.end(), t) != tags2.end()) {
                return true;
            }
        }
        return false;
    }

    void Clock::tick() {
        auto currentTime = std::chrono::high_resolution_clock::now();

        // Calculate the delta time between frames
        deltaTime = std::chrono::duration<double>(currentTime - lastFrameTime).count();

        // Sleep to maintain target frame duration (but without oversleeping)
        double sleepTime = (frameDuration * timeScale) - deltaTime;

        // Update last frame time
        lastFrameTime = std::chrono::high_resolution_clock::now();

        // Sleep only if we need to reduce time
        if (sleepTime > 0) {
            std::this_thread::sleep_for(std::chrono::duration<double>(sleepTime));
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

    std::string WebPath::toString() {
        std::ostringstream oss;
        oss << (HTTP ? "https://" : "http://") << IP << ":" << Port;
        return oss.str();
    }

    namespace KLSEFile
    {
    
        void t_from_json(json& j, Tasks& t) {
            // Deserialize the 'task' value
            j.at("task").get_to(t.task);

            // Check if 'childs' exists and deserialize it
            if (j.contains("childs")) {
                for (const auto& [key, value] : j.at("childs").items()) {
                    Tasks childTask;
                    t_from_json(value, childTask); // Recursively deserialize the child task
                    t.childs[key] = childTask;
                }
            }
        }

        // Define how KLSEFile is deserialized from JSON
        void d_from_json(json& j, KLSEDef& kf) {
            if (j.contains("name")) j.at("name").get_to(kf.name);
            if (j.contains("version")) j.at("version").get_to(kf.version);
            if (j.contains("owner")) j.at("owner").get_to(kf.owner);
            t_from_json(j.at("windows_tasks"),kf.windows_tasks);
        }
    }

    std::string replaceAll(std::string str, std::string toReplace, std::string replaceWith) {
        std::string result = str;
        size_t pos = 0;

        // Replace all occurrences of toReplace with replaceWith
        while ((pos = result.find(toReplace, pos)) != std::string::npos) {
            result.replace(pos, toReplace.length(), replaceWith);
            pos += replaceWith.length(); // Advance position to avoid infinite loop
        }

        return result;
    }
    void Init(){
        
    }
}