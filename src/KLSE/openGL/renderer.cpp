#include <KLSE/openGL/renderer.hpp>
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

    const char* vertex3D = R"(
        #version 330 core
        layout (location = 0) in vec3 a_Position;
        uniform mat4 u_MainMatrix;

        void main() {
            gl_Position = u_MainMatrix * vec4(a_Position, 1.0);
        }
    )";

    const char* frag3D = R"(
        #version 330 core
        out vec4 FragColor;
        uniform vec4 u_Color;

        void main() {
            FragColor = u_Color;
        }
    )";

    const char* vertexIso3D = R"(
        #version 330 core
        layout (location = 0) in vec3 a_Position;
        uniform mat4 u_MainMatrix;
        uniform vec3 u_Position;
        uniform vec3 u_Rotation;
        uniform vec3 u_Scale;

        mat4 rotationMatrix(vec3 r) {
            vec3 radians = r * 3.14159265 / 180.0;
            mat4 rotX = mat4(
                1.0, 0.0, 0.0, 0.0,
                0.0, cos(radians.x), -sin(radians.x), 0.0,
                0.0, sin(radians.x), cos(radians.x), 0.0,
                0.0, 0.0, 0.0, 1.0
            );

            mat4 rotY = mat4(
                cos(radians.y), 0.0, sin(radians.y), 0.0,
                0.0, 1.0, 0.0, 0.0,
                -sin(radians.y), 0.0, cos(radians.y), 0.0,
                0.0, 0.0, 0.0, 1.0
            );

            mat4 rotZ = mat4(
                cos(radians.z), -sin(radians.z), 0.0, 0.0,
                sin(radians.z), cos(radians.z), 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            );

            return rotZ * rotY * rotX;
        }

        const float camRot=1;
        const float camRot2=1;

        void main() {
            vec3 scaledPosition = (rotationMatrix(u_Rotation) * vec4(a_Position, 1.0)).xyz * u_Scale;
            vec3 translatedPosition = scaledPosition + u_Position;
            vec2 isoPosition = vec2((translatedPosition.z+translatedPosition.x), (translatedPosition.x+translatedPosition.y)-translatedPosition.z);

            gl_Position = u_MainMatrix * vec4(isoPosition,0.0, 1.0);
        }
    )";

    const char* fragIso3D = R"(
        #version 330 core
        out vec4 FragColor;
        uniform vec4 u_Color;

        void main() {
            FragColor = u_Color;
        }
    )";

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

    void GLRenderer::init(Window* window){
        this->window=window;
        simple_program=createShaderProgram(simpleVertexShaderSource,simpleFragmentShaderSource);
        simple_program_3d=createShaderProgram(vertex3D,frag3D);
        simple_program_iso3d=createShaderProgram(vertexIso3D,fragIso3D);
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

    void checkOpenGLError(const std::string& context) {
        GLenum err;
        while ((err = glGetError()) != GL_NO_ERROR) {
            std::cerr << "OpenGL error in " << context << ": " << err << std::endl;
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
    void GLRenderer::_draw_3d_vertices(const std::vector<Dimention>& vertex,const std::vector<unsigned int>& index,Camera3D* camera,GLenum mode){
        unsigned int VAO, VBO, EBO;
        glGenVertexArrays(1, &VAO);
        glGenBuffers(1, &VBO);
        glGenBuffers(1, &EBO);

        glBindVertexArray(VAO);

        glBindBuffer(GL_ARRAY_BUFFER, VBO);
        glBufferData(GL_ARRAY_BUFFER, vertex.size() * sizeof(float), vertex.data(), GL_STATIC_DRAW);

        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, index.size() * sizeof(unsigned int), index.data(), GL_STATIC_DRAW);

        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(double), (void*)0);
        glEnableVertexAttribArray(0);

        glUseProgram(simple_program_3d);

        int projLoc = glGetUniformLocation(simple_program_3d, "u_MainMatrix");
        if (projLoc != -1) {
            glUniformMatrix4fv(projLoc, 1, GL_FALSE, camera->matrix.data());
        } else {
            std::cerr << "Uniform 'u_MainMatrix' not founded!" << std::endl;
        }

        int colorLoc = glGetUniformLocation(simple_program_3d, "u_Color");
        if (colorLoc != -1) {
            glUniform4f(colorLoc, 0.0f, 0.0f, 0.0f, 1.0f);
        } else {
            std::cerr << "Uniform 'u_Color' not founded!" << std::endl;
        }

        glDrawElements(GL_TRIANGLES, index.size(), GL_UNSIGNED_INT, 0);

        glBindVertexArray(0);
        glDeleteVertexArrays(1, &VAO);
        glDeleteBuffers(1, &VBO);
        glDeleteBuffers(1, &EBO);

        checkOpenGLError("_draw_simple_3d");
    }
    void GLRenderer::_draw_iso3d_vertices(const std::vector<Dimention>& vertex,const std::vector<unsigned int>& index,CameraIso3D* camera,Color color,Vec3 position,Vec3 rotation,Vec3 scale,RenderMode3D rmode,GLenum mode){
        unsigned int VAO, VBO, EBO;
        glGenVertexArrays(1, &VAO);
        glGenBuffers(1, &VBO);
        glGenBuffers(1, &EBO);

        glBindVertexArray(VAO);

        glBindBuffer(GL_ARRAY_BUFFER, VBO);
        glBufferData(GL_ARRAY_BUFFER, vertex.size() * sizeof(Dimention), vertex.data(), GL_STATIC_DRAW);

        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, index.size() * sizeof(uint32_t), index.data(), GL_STATIC_DRAW);

        glVertexAttribPointer(0, 3, GL_DOUBLE, GL_FALSE, 3 * sizeof(Dimention), (void*)0);
        glEnableVertexAttribArray(0);

        glUseProgram(simple_program_iso3d);

        int projLoc = glGetUniformLocation(simple_program_iso3d, "u_MainMatrix");
        if (projLoc != -1) {
            glUniformMatrix4fv(projLoc, 1, GL_FALSE, projectionMatrix.data());
        } else {
            std::cerr << "Uniform 'u_MainMatrix' not founded!" << std::endl;
        }

        int uLoc = glGetUniformLocation(simple_program_iso3d, "u_Color");
        if (uLoc != -1) {
            glUniform4f(uLoc, color.r, color.g, color.b, color.a);
        } else {
            std::cerr << "Uniform 'u_Color' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(simple_program_iso3d, "u_Position");
        if (uLoc != -1) {
            glUniform3f(uLoc, position.x-camera->position.x, position.y-camera->position.y, position.z-camera->position.z);
        } else {
            std::cerr << "Uniform 'u_Position' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(simple_program_iso3d, "u_Rotation");
        if (uLoc != -1) {
            glUniform3f(uLoc, rotation.x, rotation.y, rotation.z);
        } else {
            std::cerr << "Uniform 'u_Rotation' not founded!" << std::endl;
        }

        uLoc = glGetUniformLocation(simple_program_iso3d, "u_Scale");
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
        glDeleteVertexArrays(1, &VAO);
        glDeleteBuffers(1, &VBO);
        glDeleteBuffers(1, &EBO);

        checkOpenGLError("_draw_simple_iso3d");
    }
    void GLRenderer::draw_model3D(Model3D* model,Transform3D transform, Camera3D* camera){
        _draw_3d_vertices(model->_vertex,model->_index,camera);
    }
    void GLRenderer::draw_model_iso3D(Model3D* model,Transform3D transform,Color color, CameraIso3D* camera,RenderMode3D mode){
        _draw_iso3d_vertices(model->_vertex,model->_index,camera,color,transform.position,transform.rotation,transform.scale,mode);
    }
    void GLRenderer::set_viewport(IVec2 size){
        projectionMatrix=matrix4::projection(Vec3(size.x/meter_size,size.y/meter_size,500));
        glViewport(0,0,size.x, size.y);
    }
}
