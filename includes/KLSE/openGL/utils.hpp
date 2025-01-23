#ifndef KLSE_GL_UTILS_HPP
#define KLSE_GL_UTILS_HPP
#include "glad.h"
#include <GLFW/glfw3.h>
#include <iostream>
#include <map>
#include "../input.hpp"
namespace KLSE
{
    enum class GLAntialias:uint8_t{
        none,
        MSAA1X,
        MSAA2X,
        MSAA4X,
    };

    unsigned int compileShader(unsigned int type, const char* source);
    unsigned int createShaderProgram(const char* vertexSource, const char* fragmentSource);
} // namespace KLSE
#endif