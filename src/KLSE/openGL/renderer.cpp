#include <KLSE/openGL/renderer.hpp>
#include <GLFW/glfw3.h>
#include <KLSE/openGL/utils.hpp>
#include <iostream>
namespace KLSE
{
    const char* simpleVertexShaderSource = R"(
        #version 330 core
        layout (location = 0) in vec2 a_Position;
        uniform mat4 u_ProjectionMatrix;

        void main() {
            gl_Position = u_ProjectionMatrix * vec4(a_Position, 0.0, 1.0);
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

    #define DEFAULT_WINDOWS_SIZE_X 800
    #define DEFAULT_WINDOWS_SIZE_Y 600
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
    void framebuffer_size_callback(GLFWwindow* window, int width, int height) {
        GLWindow* wuser=reinterpret_cast<GLWindow*>(glfwGetWindowUserPointer(window));
        if(wuser){
            wuser->renderer->set_viewport(IVec2(width,height));
        }
    }
    GLWindow::GLWindow():Window(){
        window = glfwCreateWindow(DEFAULT_WINDOWS_SIZE_X, DEFAULT_WINDOWS_SIZE_Y, "KLSE Windows", nullptr, nullptr);
        if (!window) {
            std::cerr << "Failed to create GLFW window " << window << std::endl;
            glfwTerminate();
            exit(-1);
        }
        glfwMakeContextCurrent(window);
        if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
            std::cerr << "Failed to initialize GLAD" << std::endl;
            exit(-1);
        }

        renderer = new GLRenderer();

        // Set the user pointer to this instance
        glfwSetWindowUserPointer(window, this);

        glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

        renderer->init(this);
        renderer->set_viewport(IVec2(DEFAULT_WINDOWS_SIZE_X, DEFAULT_WINDOWS_SIZE_Y));

        glEnable(GL_DEPTH_TEST);
        glDepthFunc(GL_LEQUAL);
        //glDisable(GL_DEPTH_TEST);
    }
    IVec2 GLWindow::get_size(){
        IVec2 ret;
        glfwGetWindowSize(window,&(ret.x),&(ret.y));
        return ret;
    }
    void GLWindow::set_size(IVec2 size){
        glfwSetWindowSize(window,size.x,size.y);
    }
    std::string GLWindow::get_title(){
        return glfwGetWindowTitle(window);
    }
    void GLWindow::set_title(std::string title){
        return glfwSetWindowTitle(window,title.c_str());
    }
    void GLWindow::close(){
        glfwTerminate();
    }
    bool GLWindow::closed(){
        return glfwWindowShouldClose(window);
    }
    void GLWindow::update(){
        // Trocar os buffers
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    void GLRenderer::init(Window* window){
        this->window=window;
        simple_program=createShaderProgram(simpleVertexShaderSource,simpleFragmentShaderSource);
    }
    void GLRenderer::clear(){
        glClearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);
        glClear(GL_COLOR_BUFFER_BIT);
    }
    
    void GLRenderer::draw_rect2D(RectCollider2D* rect, Color color,Vec2 offset){
        // 1. Calculate the rectangle vertices
        float x1 = rect->position.x - offset.x;
        float y1 = rect->position.y - offset.y;
        float x2 = x1 + rect->size.x;
        float y2 = y1 + rect->size.y;

        std::vector<float> vertices = {
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
        std::vector<float> vertices;
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
        case HitboxType2D::circle:
            draw_circle2D(reinterpret_cast<CircleCollider2D*>(hitbox),color,offset,smooth);
            break;
        case HitboxType2D::rect:
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
    void GLRenderer::_draw_simple_vertex(const std::vector<float>& vertex, const std::vector<unsigned int>& index, Color color, GLenum mode) {
        // 1. Generate and bind VAO
        unsigned int VAO, VBO, EBO;
        glGenVertexArrays(1, &VAO);
        glGenBuffers(1, &VBO);
        glGenBuffers(1, &EBO);

        glBindVertexArray(VAO);

        // 2. Bind and set vertex buffer data
        glBindBuffer(GL_ARRAY_BUFFER, VBO);
        glBufferData(GL_ARRAY_BUFFER, vertex.size() * sizeof(float), vertex.data(), GL_STATIC_DRAW);

        // 3. Bind and set element buffer data
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, index.size() * sizeof(unsigned int), index.data(), GL_STATIC_DRAW);

        // 4. Define the vertex attribute pointers (assuming 2D position)
        glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 2 * sizeof(float), (void*)0);
        glEnableVertexAttribArray(0);

        // 5. Use the shader program and set the uniform values
        glUseProgram(simple_program);

        // Retrieve uniform locations
        int projLoc = glGetUniformLocation(simple_program, "u_ProjectionMatrix");
        if (projLoc == -1) {
            std::cerr << "Uniform 'u_ProjectionMatrix' not found! " << std::endl;
        }

        int colorLoc = glGetUniformLocation(simple_program, "u_Color");
        if (colorLoc == -1) {
            std::cerr << "Uniform 'u_Color' not found!" << std::endl;
        }

        // Set the projection matrix uniform
        if (projectionMatrix) {
            glUniformMatrix4fv(projLoc, 1, GL_FALSE, projectionMatrix);
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

        checkOpenGLError("_draw_simple_vertex");
    }
    void GLRenderer::set_viewport(IVec2 size){
        if(projectionMatrix){
            delete projectionMatrix;
        }
        projectionMatrix=matrix4::projection(Vec3(size.x/meter_size,size.y/meter_size,500));
        glViewport(0,0,size.x, size.y);
    }
}
