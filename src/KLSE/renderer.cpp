#include <KLSE/renderer.hpp>
#include <stdexcept>
#include <regex>
namespace KLSE
{
        Color RGBA::create(int r, int g, int b, int a) {
            return Color(r / 255.0f, g / 255.0f, b / 255.0f, a / 255.0f);
        }
        Color RGBA::create(int r, int g, int b) {
            return Color(r / 255.0f, g / 255.0f, b / 255.0f);
        }
        Color RGBA::from(RGBA json) {
            return Color(json.r / 255.0f, json.g / 255.0f, json.b / 255.0f, json.a / 255.0f);
        } 
    
    namespace HEXCOLOR
    {
        Color create(std::string hex) {
            std::smatch result;
            switch (hex.length()) {
                case 4: // #RGB
                    if (std::regex_match(hex, result, std::regex("^#?([a-fA-F\\d])([a-fA-F\\d])([a-fA-F\\d])$"))) {
                        return {
                            std::stoi(result[1].str(), nullptr, 16) / 15.0f,
                            std::stoi(result[2].str(), nullptr, 16) / 15.0f,
                            std::stoi(result[3].str(), nullptr, 16) / 15.0f,
                            1.0f
                        };
                    }
                    break;
                case 5: // #RGBA
                    if (std::regex_match(hex, result, std::regex("^#?([a-fA-F\\d])([a-fA-F\\d])([a-fA-F\\d])([a-fA-F\\d])$"))) {
                        return {
                            std::stoi(result[1].str(), nullptr, 16) / 15.0f,
                            std::stoi(result[2].str(), nullptr, 16) / 15.0f,
                            std::stoi(result[3].str(), nullptr, 16) / 15.0f,
                            std::stoi(result[4].str(), nullptr, 16) / 15.0f
                        };
                    }
                    break;
                case 7: // #RRGGBB
                    if (std::regex_match(hex, result, std::regex("^#?([a-fA-F\\d]{2})([a-fA-F\\d]{2})([a-fA-F\\d]{2})$"))) {
                        return {
                            std::stoi(result[1].str(), nullptr, 16) / 255.0f,
                            std::stoi(result[2].str(), nullptr, 16) / 255.0f,
                            std::stoi(result[3].str(), nullptr, 16) / 255.0f,
                            1.0f
                        };
                    }
                    break;
                case 9: // #RRGGBBAA
                    if (std::regex_match(hex, result, std::regex("^#?([a-fA-F\\d]{2})([a-fA-F\\d]{2})([a-fA-F\\d]{2})([a-fA-F\\d]{2})$"))) {
                        return {
                            std::stoi(result[1].str(), nullptr, 16) / 255.0f,
                            std::stoi(result[2].str(), nullptr, 16) / 255.0f,
                            std::stoi(result[3].str(), nullptr, 16) / 255.0f,
                            std::stoi(result[4].str(), nullptr, 16) / 255.0f
                        };
                    }
                    break;
                default:
                    throw std::invalid_argument("Invalid Hex");
            }
            throw std::invalid_argument("Invalid Hex");
        }
    } // namespace HEX
} // namespace KLSE
