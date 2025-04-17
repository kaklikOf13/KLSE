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
#include "KLSE/GLFW/klse.hpp"
namespace KLSE
{
    #define DEFAULT_WINDOWS_SIZE_X 800
    #define DEFAULT_WINDOWS_SIZE_Y 600
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
    void framebuffer_size_callback(GLFWwindow* window, int width, int height) {
        GLFWWindow* wuser=reinterpret_cast<GLFWWindow*>(glfwGetWindowUserPointer(window));
        if(wuser){
            wuser->renderer->set_viewport(IVec2(width,height));
        }
    }

    void keyCallback(GLFWwindow* window, int key, int scancode, int action, int mods) {
        GLFWWindow* wuser=reinterpret_cast<GLFWWindow*>(glfwGetWindowUserPointer(window));
        if(wuser){
            if (action == GLFW_PRESS) {
                wuser->input->pressKey(GLKey2KKey[key]);
            } else if (action == GLFW_RELEASE) {
                wuser->input->releaseKey(GLKey2KKey[key]);
            }
        }
    }
    GLFWWindow::GLFWWindow(Renderer* renderer):Window(){
        window = glfwCreateWindow(DEFAULT_WINDOWS_SIZE_X, DEFAULT_WINDOWS_SIZE_Y, "KLSE Windows", nullptr, nullptr);
        if (!window) {
            std::cerr << "Failed to create GLFW window " << window << std::endl;
            glfwTerminate();
            exit(-1);
        }
        glfwMakeContextCurrent(window);


        this->renderer=renderer;

        // Set the user pointer to this instance
        glfwSetWindowUserPointer(window, this);

        // Callbacks
        glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
        glfwSetKeyCallback(window, keyCallback);

        renderer->init(this);
        renderer->set_viewport(IVec2(DEFAULT_WINDOWS_SIZE_X, DEFAULT_WINDOWS_SIZE_Y));

        input = new PCInputListener();
        /*glEnable(GL_CULL_FACE);
        glCullFace(GL_BACK);*/
    }
    IVec2 GLFWWindow::get_size(){
        IVec2 ret;
        int32 x,y;
        glfwGetWindowSize(window,&x,&y);
        ret.x=x;
        ret.y=y;
        return ret;
    }
    void GLFWWindow::set_size(IVec2 size){
        glfwSetWindowSize(window,size.x,size.y);
    }

    void GLFWWindow::setResizable(bool resizable){
        glfwSetWindowAttrib(window, GLFW_RESIZABLE, resizable);
    }

    std::string GLFWWindow::get_title(){
        return glfwGetWindowTitle(window);
    }
    void GLFWWindow::set_title(std::string title){
        return glfwSetWindowTitle(window,title.c_str());
    }
    void GLFWWindow::close(){
        glfwTerminate();
    }
    bool GLFWWindow::closed(){
        return glfwWindowShouldClose(window);
    }
    void GLFWWindow::update(){
        // Trocar os buffers
        input->update();
        glfwSwapBuffers(window);
        glfwPollEvents();
    }
}