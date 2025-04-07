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
#include <KLSE/GFX/renderer.hpp>
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

    const char* simpleTeVertexShaderSource = R"(
        #version 330 core
        layout (location = 0) in vec2 a_Position;
        layout (location = 1) in vec2 a_TexCoord;
        out vec2 TexCoord;
        
        void main() {
            gl_Position = vec4(a_Position, 0.0, 1.0);
            TexCoord = a_TexCoord;
        }
    )";

    const char* simpleTeFragmentShaderSource = R"(
        #version 330 core
        out vec4 FragColor;
        in vec2 TexCoord;
        uniform sampler2D u_Texture;
        
        void main() {
            FragColor = texture(u_Texture, TexCoord);
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
        simple_tex_program=createShaderProgram(simpleTeVertexShaderSource,simpleTeFragmentShaderSource);

        InitOpenGLMaterials();

        glEnable(GL_DEPTH_TEST);
        glDepthFunc(GL_LEQUAL);
    }
    void GLRenderer::clear(){
        glClearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    }
    
    void GLRenderer::draw_rect2D(RectCollider2D* rect, Color color,Vec2 offset,Vec2 scale){
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
        _draw_simple_vertex(vertices, indices, color,scale,simple_program, GL_TRIANGLES);
    }

    void GLRenderer::draw_circle2D(CircleCollider2D* circle, Color color, Vec2 offset,Vec2 scale, unsigned int smooth) {
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
        _draw_simple_vertex(vertices, indices, color,scale,simple_program, GL_TRIANGLES);
    }

    void GLRenderer::draw_collider2D(Collider2D* hitbox,Color color,Vec2 offset,Vec2 scale,unsigned int smooth){
        switch (hitbox->type)
        {
        case ColliderType2D::circle:
            draw_circle2D(reinterpret_cast<CircleCollider2D*>(hitbox),color,offset,scale,smooth);
            break;
        case ColliderType2D::rect:
            draw_rect2D(reinterpret_cast<RectCollider2D*>(hitbox),color,offset,scale);
            break;
        
        default:
            break;
        }
    }
    void GLRenderer::_draw_simple_vertex(const std::vector<Dimention>& vertex, const std::vector<unsigned int>& index, Color color,Vec2 scale,unsigned int s_program, GLenum mode) {
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
        glUseProgram(s_program);

        // Retrieve uniform locations
        int projLoc = glGetUniformLocation(s_program, "u_MainMatrix");
        if (projLoc == -1) {
            std::cerr << "Uniform 'u_MainMatrix' not found! " << std::endl;
        }

        int Loc = glGetUniformLocation(s_program, "u_Color");
        glUniform4f(Loc, color.r, color.g, color.b, color.a);
        /*Loc = glGetUniformLocation(s_program, "u_Scale");
        glUniform2f(Loc, scale.x, scale.y);*/

        // Set the projection matrix uniform
        if (projectionMatrix.size()==16) {
            glUniformMatrix4fv(projLoc, 1, GL_FALSE, projectionMatrix.data());
        } else {
            std::cerr << "Projection matrix is null!" << std::endl;
        }


        // 6. Draw the vertices using the index buffer
        glDrawElements(mode, index.size(), GL_UNSIGNED_INT, 0);

        // 7. Unbind the VAO
        glBindVertexArray(0);

        // 8. Cleanup
        glDeleteVertexArrays(1, &VAO);
        glDeleteBuffers(1, &VBO);
        glDeleteBuffers(1, &EBO);
    }
    void GLRenderer::draw_sprite(Sprite* s,Vec2 offset,Vec2 scale){
        Dimention x1 = offset.x;
        Dimention y1 = offset.y;
        Dimention x2 = x1 + offset.x;
        Dimention y2 = y1 + offset.y;

        std::vector<Dimention> vertices = {
        //Coord     TexCoords
            x1, y1, 0.0f, 1.0f,  // Bottom-left
            x2, y1, 0.0f, 0.0f,  // Bottom-right
            x2, y2, 1.0f, 0.0f,  // Top-right
            x1, y2, 1.0f, 1.0f   // Top-left
        };

        std::vector<unsigned int> indices = {
            0, 1, 2,  // First triangle
            2, 3, 0   // Second triangle
        };

        reinterpret_cast<GLSprite*>(s)->drawr(this,vertices,indices,simple_tex_program);
    }
    void GLRenderer::draw_model3D(Model3D* model,const Transform3D& transform,void* material, Camera3D* camera,RenderMode3D m){
        reinterpret_cast<Material3DExecutionFunction2>(reinterpret_cast<Material3D<ZeroStruct,GLMaterialFArgs>*>(material)->factory->execute)(material,this->window,model,camera,transform);
    }
    void GLRenderer::set_viewport(IVec2 size){
        projectionMatrix=matrix4::projection(Vec3(size.x/meter_size,size.y/meter_size,500));
        glViewport(0,0,size.x, size.y);
    }

    Sprite* GLRenderer::create_sprite(IVec2 size){
        GLuint fbo, texture;
        glGenFramebuffers(1, &fbo);
        glBindFramebuffer(GL_FRAMEBUFFER, fbo);

        glGenTextures(1, &texture);
        glBindTexture(GL_TEXTURE_2D, texture);
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, size.x, size.y, 0, GL_RGBA, GL_UNSIGNED_BYTE, nullptr);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, texture, 0);

        glBindFramebuffer(GL_FRAMEBUFFER, fbo);
        glViewport(0, 0, size.x, size.y);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        IVec2 ws=window->get_size();
        glViewport(0, 0, ws.x, ws.y);
        glBindFramebuffer(GL_FRAMEBUFFER, 0);
        auto s=new GLSprite(fbo,texture,Vec2(size)/this->meter_size,size,this);
        return reinterpret_cast<Sprite*>(s);
    }
}
