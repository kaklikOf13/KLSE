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
#ifndef KLSE_GL_UTILS_HPP
#define KLSE_GL_UTILS_HPP
#include "glad.h"
#include <GLFW/glfw3.h>
#include <iostream>
#include <map>
#include "../input.hpp"
namespace KLSE
{
    void checkOpenGLError(const std::string& context);

    #pragma region Buffers
    //By Victor Gordan YT
    class VBO
    {
    public:
        // Reference ID of the Vertex Buffer Object
        GLuint ID;
        // Constructor that generates a Vertex Buffer Object and links it to vertices
        VBO(GLdouble* vertices, size_t size);

        // Binds the VBO
        void Bind();
        // Unbinds the VBO
        void Unbind();
        // Deletes the VBO
        void Free();
    };

    
    class EBO
    {
    public:
        // ID reference of Elements Buffer Object
        GLuint ID;
        // Constructor that generates a Elements Buffer Object and links it to indices
        EBO(GLuint* indices, size_t size);

        // Binds the EBO
        void Bind();
        // Unbinds the EBO
        void Unbind();
        // Deletes the EBO
        void Free();
    };

    class VAO
    {
    public:
        // ID reference for the Vertex Array Object
        GLuint ID;
        // Constructor that generates a VAO ID
        VAO();

        // Links a VBO Attribute such as a position or color to the VAO
        void LinkAttrib(VBO& VBO, GLuint layout, GLuint numComponents, GLenum type, GLsizeiptr stride, void* offset);
        // Binds the VAO
        void Bind();
        // Unbinds the VAO
        void Unbind();
        // Deletes the VAO
        void Free();
    };
    #pragma endregion


    unsigned int compileShader(unsigned int type, const char* source);
    unsigned int createShaderProgram(const char* vertexSource, const char* fragmentSource);
} // namespace KLSE
#endif