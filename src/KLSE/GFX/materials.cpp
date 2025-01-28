#include <KLSE/GFX/materials.hpp>
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
    void ColorMaterialExecute(Material3D<GLMaterialColorArgs,GLMaterialFArgs>* material,Window* window,Model3D* model, Camera3D* camera,const Transform3D& t){
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
    Material3DFactory<GLMaterialColorArgs,GLMaterialFArgs>* MF3_color;
    void InitOpenGLMaterials(){
        MF3_color=new Material3DFactory(&ColorMaterialExecute,{
            createShaderProgram(vertex3Dcolor,frag3Dcolor)
        });
    }
} // namespace KLSE