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
#include <KLSE/GL/materials.hpp>
namespace KLSE
{
    const char* vertex3Dcolor = R"(
        #version 330 core
        layout (location = 0) in vec3 a_Position;
        layout (location = 1) in vec3 a_Normal;
        out vec3 v_normal;
        uniform mat4 u_MainMatrix;
        uniform vec3 u_Position;
        uniform mat4 u_Rotation;
        uniform vec3 u_Scale;

        void main() {
            vec3 scaledPosition = (u_Rotation*vec4(a_Position,1.0)).xyz * u_Scale;
            vec3 translatedPosition = scaledPosition + u_Position;

            v_normal=a_Normal;
            gl_Position = u_MainMatrix * vec4(translatedPosition,1.0);
        }
    )";

    const char* frag3Dcolor = R"(
        #version 330 core
        out vec4 FragColor;
        uniform vec4 u_Color;
        in vec3 v_normal;

        void main() {
            vec3 normal = normalize(v_normal);
            float light=dot(normal, vec3(0.1,0.2,-1));
            FragColor = u_Color;
            FragColor.rgb*=light;
        }
    )";

    const char* vertexI3Dcolor = R"(
        #version 330 core
        layout (location = 0) in vec3 a_Position;
        layout (location = 1) in vec3 a_Normal;
        out vec3 v_normal;
        uniform mat4 u_MainMatrix;
        uniform vec3 u_Position;
        uniform mat4 u_Rotation;
        uniform vec3 u_Scale;

        void main() {
            vec3 rotPos=(vec4(a_Position,1.0)*u_Rotation).xyz;
            vec3 translatedPosition = (rotPos * u_Scale) + u_Position;

            vec2 iso_p=vec2(translatedPosition.x+translatedPosition.z, (translatedPosition.x-translatedPosition.y)-translatedPosition.z);
            v_normal=a_Normal;
            gl_Position = u_MainMatrix * vec4(iso_p,-translatedPosition.z-10.0,1.0);
        }
    )";

    const char* fragI3Dcolor = R"(
        #version 330 core
        out vec4 FragColor;
        uniform vec4 u_Color;
        in vec3 v_normal;

        void main() {
            vec3 normal = normalize(v_normal);
            float light=dot(normal, vec3(0.3,-1,-1));
            FragColor = u_Color;
            FragColor.rgb*=light;
        }
    )";

    const char* vertex2Dcolor = R"(
        #version 330 core
        layout (location = 0) in vec2 a_Position;
        layout (location = 1) in vec2 a_UV;

        uniform vec3 u_Position;
        uniform vec2 u_Scale;

        uniform mat4 u_MainMatrix;

        void main() {
            vec3 scaledPos=vec3(a_Position*u_Scale,0);
            gl_Position = u_MainMatrix * vec4(u_Position+scaledPos, 1.0);
        }
    )";

    const char* frag2Dcolor = R"(
        #version 330 core
        out vec4 FragColor;
        uniform vec4 u_Color;

        void main() {
            FragColor = u_Color;
        }
    )";

    const char* vertex2Dtex = R"(
        #version 330 core
        layout (location = 0) in vec2 a_Position;
        layout (location = 1) in vec2 a_UV;
        out vec2 TexCoord;

        uniform vec3 u_Position;
        uniform vec2 u_Scale;

        uniform mat4 u_MainMatrix;

        void main() {
            vec3 scaledPos=vec3(a_Position*u_Scale,0);
            gl_Position = u_MainMatrix * vec4(u_Position+scaledPos, 1.0);
            TexCoord = a_UV;
        }
    )";

    const char* frag2Dtex = R"(
        #version 330 core

        out vec4 FragColor;
        in vec2 TexCoord;

        uniform sampler2D u_Texture;

        void main() {
            FragColor = texture(u_Texture, TexCoord);
        }
    )";
    void ColorMaterial3DExecute(Material3D<GLMaterialColorArgs,GLMaterialFArgs>* material,Window* window,Model3D* model, CameraI3D* camera,const Transform3D& t){
        VAO vao1;

        vao1.Bind();

        VBO vbo1((GLdouble*)model->_vertex.data(),sizeof(Vertex3D)*model->_vertex.size());
        EBO ebo1((GLuint*)model->_index.data(),sizeof(uint32_t)*model->_index.size());

        vao1.LinkAttrib(vbo1,0,3,GL_DOUBLE,sizeof(Vertex3D),(void*)0);
        vao1.LinkAttrib(vbo1,1,3,GL_DOUBLE,sizeof(Vertex3D),(void*)(3*sizeof(Dimention)));

        auto program=material->factory->args.program;

        glUseProgram(program);

        int projLoc = glGetUniformLocation(program, "u_MainMatrix");
        if (projLoc != -1) {
            glUniformMatrix4fv(projLoc, 1, GL_FALSE, camera->matrix.data());
        } else {
            std::cerr << "Uniform 'u_MainMatrix' not founded!" << std::endl;
        }

        int uLoc = glGetUniformLocation(program, "u_Color");
        if (uLoc != -1) {
            glUniform4f(uLoc, material->args.color.r, material->args.color.g, material->args.color.b, material->args.color.a);
        } else {
            std::cerr << "Uniform 'u_Color' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(program, "u_Position");
        if (uLoc != -1) {
            glUniform3f(uLoc, t.position.x, t.position.y, t.position.z);
        } else {
            std::cerr << "Uniform 'u_Position' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(program, "u_Rotation");
        if (uLoc != -1) {
            Matrix4 rotm=matrix4::rotate(matrix4::identity(),t.rotation);
            glUniformMatrix4fv(uLoc, 1, GL_FALSE, rotm.data());
        } else {
            std::cerr << "Uniform 'u_Rotation' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(program, "u_Scale");
        if (uLoc != -1) {
            glUniform3f(uLoc, t.scale.x, t.scale.y, t.scale.z);
        } else {
            std::cerr << "Uniform 'u_Scale' not founded!" << std::endl;
        }

        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

        glDrawElements(GL_TRIANGLES, model->_index.size(), GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);
        vao1.Free();
        vbo1.Free();
        ebo1.Free();

        checkOpenGLError("_draw_3d");
    }

    void ColorMaterial2DExecute(Material2D<GLMaterialColorArgs,GLMaterialFArgs>* material,Window* window,Model2D* model, Camera2D* camera,const Transform2D& t){
        VAO vao1;

        vao1.Bind();

        VBO vbo1((GLdouble*)model->_vertex.data(),sizeof(Vertex2D)*model->_vertex.size());
        EBO ebo1((GLuint*)model->_index.data(),sizeof(uint32_t)*model->_index.size());

        vao1.LinkAttrib(vbo1,0,2,GL_DOUBLE,sizeof(Vertex2D),(void*)0); //a_Position
        vao1.LinkAttrib(vbo1,1,2,GL_DOUBLE,sizeof(Vertex2D),(void*)(2*sizeof(Dimention)));//a_UV

        auto program=material->factory->args.program;

        glUseProgram(program);

        int projLoc = glGetUniformLocation(program, "u_MainMatrix");
        if (projLoc != -1) {
            glUniformMatrix4fv(projLoc, 1, GL_FALSE, camera->matrix.data());
        } else {
            std::cerr << "Uniform 'u_MainMatrix' not founded!" << std::endl;
        }

        int uLoc = glGetUniformLocation(program, "u_Color");
        if (uLoc != -1) {
            glUniform4f(uLoc, material->args.color.r, material->args.color.g, material->args.color.b, material->args.color.a);
        } else {
            std::cerr << "Uniform 'u_Color' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(program, "u_Position");
        if (uLoc != -1) {
            glUniform3f(uLoc, t.position.x, t.position.y, t.zIndex);
        } else {
            std::cerr << "Uniform 'u_Position' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(program, "u_Scale");
        if (uLoc != -1) {
            glUniform2f(uLoc, t.scale.x, t.scale.y);
        } else {
            std::cerr << "Uniform 'u_Scale' not founded!" << std::endl;
        }

        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

        glDrawElements(GL_TRIANGLES, model->_index.size(), GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);
        vao1.Free();
        vbo1.Free();
        ebo1.Free();

        checkOpenGLError("_draw_2d");
    }

    void SpriteMaterial2DExecute(Material2D<GLMaterialSpriteArgs,GLMaterialFArgs>* material,Window* window,Model2D* model, Camera2D* camera,const Transform2D& t){
        VAO vao1;

        vao1.Bind();

        VBO vbo1((GLdouble*)model->_vertex.data(),sizeof(Vertex2D)*model->_vertex.size());
        EBO ebo1((GLuint*)model->_index.data(),sizeof(uint32_t)*model->_index.size());

        vao1.LinkAttrib(vbo1,0,2,GL_DOUBLE,sizeof(Vertex2D),(void*)0); //a_Position
        vao1.LinkAttrib(vbo1,1,2,GL_DOUBLE,sizeof(Vertex2D),(void*)(2*sizeof(Dimention)));//a_UV

        auto program=material->factory->args.program;

        glUseProgram(program);

        int projLoc = glGetUniformLocation(program, "u_MainMatrix");
        if (projLoc != -1) {
            glUniformMatrix4fv(projLoc, 1, GL_FALSE, camera->matrix.data());
        } else {
            std::cerr << "Uniform 'u_MainMatrix' not founded!" << std::endl;
        }

        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, material->args.sprite->texture);
        glUniform1i(glGetUniformLocation(program, "u_Texture"), 0);

        int uLoc = glGetUniformLocation(program, "u_Position");
        if (uLoc != -1) {
            glUniform3f(uLoc, t.position.x, t.position.y, t.zIndex);
        } else {
            std::cerr << "Uniform 'u_Position' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(program, "u_Scale");
        if (uLoc != -1) {
            glUniform2f(uLoc, t.scale.x, t.scale.y);
        } else {
            std::cerr << "Uniform 'u_Scale' not founded!" << std::endl;
        }

        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

        glDrawElements(GL_TRIANGLES, model->_index.size(), GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);
        vao1.Free();
        vbo1.Free();
        ebo1.Free();

        checkOpenGLError("_draw_sprite_2d");
    }

    Material3DFactory<GLMaterialColorArgs,GLMaterialFArgs>* MF3_color;
    Material3DFactory<GLMaterialColorArgs,GLMaterialFArgs>* MFI3_color;
    Material2DFactory<GLMaterialColorArgs,GLMaterialFArgs>* MF2_color;

    Material2DFactory<GLMaterialSpriteArgs,GLMaterialFArgs>* MF2_sprite;
    void InitOpenGLMaterials(){
        MF3_color=new Material3DFactory(&ColorMaterial3DExecute,{
            createShaderProgram(vertex3Dcolor,frag3Dcolor)
        });
        MFI3_color=new Material3DFactory(&ColorMaterial3DExecute,{
            createShaderProgram(vertexI3Dcolor,fragI3Dcolor)
        });
        MF2_color=new Material2DFactory(&ColorMaterial2DExecute,{
            createShaderProgram(vertex2Dcolor,frag2Dcolor)
        });

        MF2_sprite=new Material2DFactory(&SpriteMaterial2DExecute,{
            createShaderProgram(vertex2Dtex,frag2Dtex)
        });
    }
} // namespace KLSE