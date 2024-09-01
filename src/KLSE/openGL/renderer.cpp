#include <KLSE/openGL/renderer.hpp>
#include <GLFW/glfw3.h>
#include <iostream>
namespace KLSE
{
    std::map<int, Key> GLKey2KKey = {
        {GLFW_KEY_A, Key::A},
        {GLFW_KEY_B, Key::B},
        {GLFW_KEY_C, Key::C},
        {GLFW_KEY_D, Key::D},
        {GLFW_KEY_E, Key::E},
        {GLFW_KEY_F, Key::F},
        {GLFW_KEY_G, Key::G},
        {GLFW_KEY_H, Key::H},
        {GLFW_KEY_I, Key::I},
        {GLFW_KEY_J, Key::J},
        {GLFW_KEY_K, Key::K},
        {GLFW_KEY_L, Key::L},
        {GLFW_KEY_M, Key::M},
        {GLFW_KEY_N, Key::N},
        {GLFW_KEY_O, Key::O},
        {GLFW_KEY_P, Key::P},
        {GLFW_KEY_Q, Key::Q},
        {GLFW_KEY_R, Key::R},
        {GLFW_KEY_S, Key::S},
        {GLFW_KEY_T, Key::T},
        {GLFW_KEY_U, Key::U},
        {GLFW_KEY_V, Key::V},
        {GLFW_KEY_W, Key::W},
        {GLFW_KEY_X, Key::X},
        {GLFW_KEY_Y, Key::Y},
        {GLFW_KEY_Z, Key::Z},
        {GLFW_KEY_0, Key::Number_0},
        {GLFW_KEY_1, Key::Number_1},
        {GLFW_KEY_2, Key::Number_2},
        {GLFW_KEY_3, Key::Number_3},
        {GLFW_KEY_4, Key::Number_4},
        {GLFW_KEY_5, Key::Number_5},
        {GLFW_KEY_6, Key::Number_6},
        {GLFW_KEY_7, Key::Number_7},
        {GLFW_KEY_8, Key::Number_8},
        {GLFW_KEY_9, Key::Number_9},
        {GLFW_KEY_ENTER, Key::Enter},
        {GLFW_KEY_BACKSPACE, Key::Backspace},
        {GLFW_KEY_SPACE, Key::Space},
        {GLFW_KEY_DELETE, Key::Delete},
        {GLFW_KEY_TAB, Key::Tab},
        {GLFW_KEY_LEFT_SHIFT, Key::LShift},
        {GLFW_KEY_RIGHT_SHIFT, Key::RShift},
        {GLFW_KEY_LEFT_CONTROL, Key::LCtrl},
        {GLFW_KEY_RIGHT_CONTROL, Key::RCtrl},
        {GLFW_KEY_LEFT_ALT, Key::LALT},
        {GLFW_KEY_RIGHT_ALT, Key::RALT},
        {GLFW_KEY_UP, Key::Arrow_Up},
        {GLFW_KEY_DOWN, Key::Arrow_Down},
        {GLFW_KEY_LEFT, Key::Arrow_Left},
        {GLFW_KEY_RIGHT, Key::Arrow_Right},
        {GLFW_MOUSE_BUTTON_LEFT, Key::Mouse_Left},
        {GLFW_MOUSE_BUTTON_MIDDLE, Key::Mouse_Middle},
        {GLFW_MOUSE_BUTTON_RIGHT, Key::Mouse_Right},
        {GLFW_MOUSE_BUTTON_4, Key::Mouse_Option1},
        {GLFW_MOUSE_BUTTON_5, Key::Mouse_Option2}
    };

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

    void keyCallback(GLFWwindow* window, int key, int scancode, int action, int mods) {
        GLWindow* wuser=reinterpret_cast<GLWindow*>(glfwGetWindowUserPointer(window));
        if(wuser){
            if (action == GLFW_PRESS) {
                wuser->input->pressKey(GLKey2KKey[key]);
            } else if (action == GLFW_RELEASE) {
                wuser->input->releaseKey(GLKey2KKey[key]);
            }
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

        // Callbacks
        glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
        glfwSetKeyCallback(window, keyCallback);

        renderer->init(this);
        renderer->set_viewport(IVec2(DEFAULT_WINDOWS_SIZE_X, DEFAULT_WINDOWS_SIZE_Y));

        input = new PCInputListener();

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
        input->update();
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
