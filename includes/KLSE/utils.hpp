#ifndef KLSE_UTILS_HPP
#define KLSE_UTILS_HPP
#include <algorithm>
#include "geometry.hpp"

#include <string.h>
#include <vector>

#include <chrono>
#include <thread>
#include <functional>

#include <map>
#include <nlohmann/json.hpp>

namespace KLSE{
    namespace random
    {
        Dimention dimention(Dimention min, Dimention max);
    }
    std::vector<std::string> splitPath(std::string path);

    using Tags = std::vector<std::string>;

    bool hasTag(Tags tags, std::string tag);

    bool hasTags(Tags tags1, Tags tags2);

    class Clock {
    private:
        double frameDuration;    // Frame duration in milliseconds
        std::chrono::steady_clock::time_point lastFrameTime;

    public:
        Clock(int targetFPS, double timeScale);
        Clock(int targetFPS);
        bool tick();
        double timeScale;
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