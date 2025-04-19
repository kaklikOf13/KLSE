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
#include <KLSE/GL/renderer.hpp>

namespace KLSE
{
    /*void GLSprite::drawr(Renderer* r, std::vector<Dimention> vertices, std::vector<unsigned int> indices, unsigned int program){
        VAO vao1;

        vao1.Bind();

        VBO vbo1((GLdouble*)vertices.data(),sizeof(Vertex3D)*vertices.size());
        EBO ebo1((GLuint*)indices.data(),sizeof(uint32_t)*indices.size());

        vao1.LinkAttrib(vbo1,0,2,GL_DOUBLE,sizeof(Vertex3D),(void*)0);
        vao1.LinkAttrib(vbo1,1,2,GL_DOUBLE,sizeof(Vertex3D),(void*)(2*sizeof(Dimention)));

        glUseProgram(program);

        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, texture);
        glUniform1i(glGetUniformLocation(program, "u_Texture"), 0);

        ebo1.Free();
        vbo1.Free();
        vao1.Free();

        checkOpenGLError("_draw_sprite_2d");
    }*/
} // namespace KLSE