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
#include "json.hpp"

#include <stdexcept>
#include <sstream>

namespace KLSE{
    const unsigned long long a = 1664525; // Multiplier
    const unsigned long long c = 1013904223; // Increment

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