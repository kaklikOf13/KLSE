#include <KLSE/GFX/utils.hpp>
namespace KLSE{
    #pragma region Shaders
    unsigned int compileShader(unsigned int type, const char* source) {
        unsigned int shader = glCreateShader(type);
        glShaderSource(shader, 1, &source, nullptr);
        glCompileShader(shader);

        int success;
        glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
        if (!success) {
            char infoLog[512];
            glGetShaderInfoLog(shader, 512, nullptr, infoLog);
            std::cerr << "ERROR::SHADER::COMPILATION_FAILED\n" << infoLog << std::endl;
        }
        return shader;
    }

    unsigned int createShaderProgram(const char* vertexSource, const char* fragmentSource) {
        GLuint vertexShader = compileShader(GL_VERTEX_SHADER, vertexSource);
        GLuint fragmentShader = compileShader(GL_FRAGMENT_SHADER, fragmentSource);

        GLuint program = glCreateProgram();
        glAttachShader(program, vertexShader);
        glAttachShader(program, fragmentShader);
        glLinkProgram(program);

        GLint success;
        glGetProgramiv(program, GL_LINK_STATUS, &success);
        if (!success) {
            char infoLog[512];
            glGetProgramInfoLog(program, 512, nullptr, infoLog);
            std::cerr << "Program Linking Error: " << infoLog << std::endl;
            return 0;
        }

        glDeleteShader(vertexShader);
        glDeleteShader(fragmentShader);

        return program;
    }
    #pragma endregion
    #pragma region Buffers

    // Constructor that generates a Vertex Buffer Object and links it to vertices
    VBO::VBO(GLdouble* vertices, size_t size)
    {
        glGenBuffers(1, &ID);
        glBindBuffer(GL_ARRAY_BUFFER, ID);
        glBufferData(GL_ARRAY_BUFFER, size, vertices, GL_STATIC_DRAW);
    }

    // Binds the VBO
    void VBO::Bind()
    {
        glBindBuffer(GL_ARRAY_BUFFER, ID);
    }

    // Unbinds the VBO
    void VBO::Unbind()
    {
        glBindBuffer(GL_ARRAY_BUFFER, 0);
    }

    // Deletes the VBO
    void VBO::Free()
    {
        glDeleteBuffers(1, &ID);
    }

    // Constructor that generates a Elements Buffer Object and links it to indices
    EBO::EBO(GLuint* indices, size_t size)
    {
        glGenBuffers(1, &ID);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ID);
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, size, indices, GL_STATIC_DRAW);
    }

    // Binds the EBO
    void EBO::Bind()
    {
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ID);
    }

    // Unbinds the EBO
    void EBO::Unbind()
    {
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
    }

    // Deletes the EBO
    void EBO::Free()
    {
        glDeleteBuffers(1, &ID);
    }

    // Constructor that generates a VAO ID
    VAO::VAO()
    {
        glGenVertexArrays(1, &ID);
    }

    // Links a VBO Attribute such as a position or color to the VAO
    void VAO::LinkAttrib(VBO& VBO, GLuint layout, GLuint numComponents, GLenum type, GLsizeiptr stride, void* offset)
    {
        VBO.Bind();
        glVertexAttribPointer(layout, numComponents, type, GL_FALSE, stride, offset);
        glEnableVertexAttribArray(layout);
        VBO.Unbind();
    }

    // Binds the VAO
    void VAO::Bind()
    {
        glBindVertexArray(ID);
    }

    // Unbinds the VAO
    void VAO::Unbind()
    {
        glBindVertexArray(0);
    }

    // Deletes the VAO
    void VAO::Free()
    {
        glDeleteVertexArrays(1, &ID);
    }

    #pragma endregion
}