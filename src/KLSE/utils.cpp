#include <algorithm>
#include <KLSE/utils.hpp>
#include <iostream>
#include <sstream>
namespace KLSE{
    namespace random
    {
        Dimention dimention(Dimention min, Dimention max) {
            return min + static_cast<Dimention>(rand()) / (static_cast<Dimention>(RAND_MAX / (max - min)));
        }   
    }
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

    bool Clock::tick() {
        auto currentTime = std::chrono::steady_clock::now();
        std::chrono::duration<double, std::milli> elapsed = currentTime - lastFrameTime;
        double elapsedTime = elapsed.count();
        if(elapsedTime>=frameDuration*timeScale){
            lastFrameTime=std::chrono::steady_clock::now();
            return true;
        }
        return false;
    }

    Clock::Clock(int targetFPS, double timeScale): frameDuration(1000.0 / targetFPS), timeScale(timeScale) {
        lastFrameTime = std::chrono::steady_clock::now();
    }
    Clock::Clock(int targetFPS): frameDuration(1000.0 / targetFPS), timeScale(1) {
        lastFrameTime = std::chrono::steady_clock::now();
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
}