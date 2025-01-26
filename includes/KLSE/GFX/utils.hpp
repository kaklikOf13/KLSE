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