#include <KLSE/GFX/renderer.hpp>
#include <GLFW/glfw3.h>
#include <iostream>
namespace KLSE
{
    const char* simpleVertexShaderSource = R"(
        #version 330 core
        layout (location = 0) in vec2 a_Position;
        uniform mat4 u_MainMatrix;

        void main() {
            gl_Position = u_MainMatrix * vec4(a_Position, 0.0, 1.0);
        }
    )";

    const char* simpleFragmentShaderSource = R"(
        #version 330 core
        out vec4 FragColor;
        uniform vec4 u_Color;

        void main() {
            FragColor = u_Color;
        }
    )";

    Material3DFactory<GLMaterialColorArgs,GLMaterialFArgs>* MF3_color;

    void GLInit(GLAntialias antialias){
        // Inicializar GLFW
        if (!glfwInit()) {
            std::cerr << "Failed to initialize GLFW" << std::endl;
            exit(-1);
        }
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

        switch (antialias)
        {
        case GLAntialias::MSAA1X:
            glfwWindowHint(GLFW_SAMPLES, 1);
        case GLAntialias::MSAA2X:
            glfwWindowHint(GLFW_SAMPLES, 2);
        case GLAntialias::MSAA4X:
            glfwWindowHint(GLFW_SAMPLES, 4);
            break;
        default:
            break;
        }
    }

    const char* vertex3Dc = R"(
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

    const char* frag3Dc = R"(
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

    void checkOpenGLError(const std::string& context) {
        GLenum err;
        while ((err = glGetError()) != GL_NO_ERROR) {
            std::cerr << "OpenGL error in " << context << ": " << err << std::endl;
        }
    }

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

    void GLRenderer::init(Window* window){
        this->window=window;
        simple_program=createShaderProgram(simpleVertexShaderSource,simpleFragmentShaderSource);

        MF3_color=new Material3DFactory(&ColorMaterialExecute,{
            createShaderProgram(vertex3Dc,frag3Dc)
        });

        glEnable(GL_DEPTH_TEST);
        glDepthFunc(GL_LEQUAL);
    }
    void GLRenderer::clear(){
        glClearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    }
    
    void GLRenderer::draw_rect2D(RectCollider2D* rect, Color color,Vec2 offset){
        // 1. Calculate the rectangle vertices
        Dimention x1 = rect->position.x - offset.x;
        Dimention y1 = rect->position.y - offset.y;
        Dimention x2 = x1 + rect->size.x;
        Dimention y2 = y1 + rect->size.y;

        std::vector<Dimention> vertices = {
            x1, y1,  // Bottom-left
            x2, y1,  // Bottom-right
            x2, y2,  // Top-right
            x1, y2   // Top-left
        };

        std::vector<unsigned int> indices = {
            0, 1, 2,  // First triangle
            2, 3, 0   // Second triangle
        };

        // 2. Call _draw_simple_vertex with the vertices and indices
        _draw_simple_vertex(vertices, indices, color, GL_TRIANGLES);
    }

    void GLRenderer::draw_circle2D(CircleCollider2D* circle, Color color, Vec2 offset, unsigned int smooth) {
        // 1. Calculate the circle's center position
        float cx = circle->position.x - offset.x;
        float cy = circle->position.y - offset.y;
        float radius = circle->radius;

        // 2. Prepare the vertices
        std::vector<Dimention> vertices;
        vertices.push_back(cx);  // Center vertex (x)
        vertices.push_back(cy);  // Center vertex (y)

        // Calculate the vertices around the circumference
        for (unsigned int i = 0; i <= smooth; ++i) {
            float angle = 2.0f * Math::PI * i / smooth;
            float x = cx + radius * cos(angle);
            float y = cy + radius * sin(angle);
            vertices.push_back(x);
            vertices.push_back(y);
        }

        // 3. Prepare the indices
        std::vector<unsigned int> indices;
        for (unsigned int i = 1; i <= smooth; ++i) {
            indices.push_back(0);  // Center vertex
            indices.push_back(i);
            indices.push_back(i + 1);
        }

        // 4. Call _draw_simple_vertex with the vertices and indices
        _draw_simple_vertex(vertices, indices, color, GL_TRIANGLES);
    }

    void GLRenderer::draw_collider2D(Collider2D* hitbox,Color color,Vec2 offset,unsigned int smooth){
        switch (hitbox->type)
        {
        case ColliderType2D::circle:
            draw_circle2D(reinterpret_cast<CircleCollider2D*>(hitbox),color,offset,smooth);
            break;
        case ColliderType2D::rect:
            draw_rect2D(reinterpret_cast<RectCollider2D*>(hitbox),color,offset);
            break;
        
        default:
            break;
        }
    }
    void GLRenderer::_draw_simple_vertex(const std::vector<Dimention>& vertex, const std::vector<unsigned int>& index, Color color, GLenum mode) {
        // 1. Generate and bind VAO
        unsigned int VAO, VBO, EBO;
        glGenVertexArrays(1, &VAO);
        glGenBuffers(1, &VBO);
        glGenBuffers(1, &EBO);

        glBindVertexArray(VAO);

        // 2. Bind and set vertex buffer data
        glBindBuffer(GL_ARRAY_BUFFER, VBO);
        glBufferData(GL_ARRAY_BUFFER, vertex.size() * sizeof(Dimention), vertex.data(), GL_STATIC_DRAW);

        // 3. Bind and set element buffer data
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, index.size() * sizeof(unsigned int), index.data(), GL_STATIC_DRAW);

        // 4. Define the vertex attribute pointers (assuming 2D position)
        glVertexAttribPointer(0, 2, GL_DOUBLE, GL_FALSE, 2 * sizeof(Dimention), (void*)0);
        glEnableVertexAttribArray(0);

        // 5. Use the shader program and set the uniform values
        glUseProgram(simple_program);

        // Retrieve uniform locations
        int projLoc = glGetUniformLocation(simple_program, "u_MainMatrix");
        if (projLoc == -1) {
            std::cerr << "Uniform 'u_MainMatrix' not found! " << std::endl;
        }

        int colorLoc = glGetUniformLocation(simple_program, "u_Color");
        if (colorLoc == -1) {
            std::cerr << "Uniform 'u_Color' not found!" << std::endl;
        }

        // Set the projection matrix uniform
        if (projectionMatrix.size()==16) {
            glUniformMatrix4fv(projLoc, 1, GL_FALSE, projectionMatrix.data());
        } else {
            std::cerr << "Projection matrix is null!" << std::endl;
        }

        // Set the color uniform (ensure color components are in [0,1])
        glUniform4f(colorLoc, color.r, color.g, color.b, color.a);

        // 6. Draw the vertices using the index buffer
        glDrawElements(mode, index.size(), GL_UNSIGNED_INT, 0);

        // 7. Unbind the VAO
        glBindVertexArray(0);

        // 8. Cleanup
        glDeleteVertexArrays(1, &VAO);
        glDeleteBuffers(1, &VBO);
        glDeleteBuffers(1, &EBO);
    }
    /*void GLRenderer::_draw_3d_vertices(const std::vector<Vertex3D>& vertex,const std::vector<uint32_t>& index,Camera3D* camera,Color color,Vec3 position,Vec3 rotation,Vec3 scale,RenderMode3D rmode,GLenum mode){
        VAO vao1;

        vao1.Bind();

        VBO vbo1((GLdouble*)vertex.data(),sizeof(Vertex3D)*vertex.size());
        EBO ebo1((GLuint*)index.data(),sizeof(uint32_t)*index.size());

        vao1.LinkAttrib(vbo1,0,3,GL_DOUBLE,sizeof(Vertex3D),(void*)0);
        vao1.LinkAttrib(vbo1,1,3,GL_DOUBLE,sizeof(Vertex3D),(void*)(3*sizeof(Dimention)));

        glUseProgram(simple_program_3d);

        int projLoc = glGetUniformLocation(simple_program_3d, "u_MainMatrix");
        if (projLoc != -1) {
            glUniformMatrix4fv(projLoc, 1, GL_FALSE, camera->matrix.data());
        } else {
            std::cerr << "Uniform 'u_MainMatrix' not founded!" << std::endl;
        }

        int uLoc = glGetUniformLocation(simple_program_3d, "u_Color");
        if (uLoc != -1) {
            glUniform4f(uLoc, color.r, color.g, color.b, color.a);
        } else {
            std::cerr << "Uniform 'u_Color' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(simple_program_3d, "u_Position");
        if (uLoc != -1) {
            glUniform3f(uLoc, position.x, position.y, position.z);
        } else {
            std::cerr << "Uniform 'u_Position' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(simple_program_3d, "u_Rotation");
        if (uLoc != -1) {
            glUniform3f(uLoc, rotation.x, rotation.y, rotation.z);
        } else {
            std::cerr << "Uniform 'u_Rotation' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(simple_program_3d, "u_Scale");
        if (uLoc != -1) {
            glUniform3f(uLoc, scale.x, scale.y, scale.z);
        } else {
            std::cerr << "Uniform 'u_Scale' not founded!" << std::endl;
        }
        if(rmode==RenderMode3D::wireframe){
            glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
        }

        glDrawElements(GL_TRIANGLES, index.size(), GL_UNSIGNED_INT, 0);

        if(rmode==RenderMode3D::wireframe){
            glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
        }

        glBindVertexArray(0);
        vao1.Free();
        vbo1.Free();
        ebo1.Free();

        checkOpenGLError("_draw_simple_3d");
    }*/
    void GLRenderer::draw_model3D(Model3D* model,const Transform3D& transform,void* material, Camera3D* camera,RenderMode3D m){
        reinterpret_cast<Material3DExecutionFunction2>(reinterpret_cast<Material3D<ZeroStruct,GLMaterialFArgs>*>(material)->factory->execute)(material,this->window,model,camera,transform);
    }
    void GLRenderer::set_viewport(IVec2 size){
        projectionMatrix=matrix4::projection(Vec3(size.x/meter_size,size.y/meter_size,500));
        glViewport(0,0,size.x, size.y);
    }
}
