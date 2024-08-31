#ifndef KLSE_GL_UTILS_HPP
#define KLSE_GL_UTILS_HPP
#include <GLAD/glad.h>
#include <GLFW/glfw3.h>
#include <iostream>
namespace KLSE
{
    unsigned int compileShader(unsigned int type, const char* source);
    unsigned int createShaderProgram(const char* vertexSource, const char* fragmentSource);
} // namespace KLSE
#endif