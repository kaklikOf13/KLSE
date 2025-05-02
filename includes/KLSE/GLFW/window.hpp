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
#ifndef KLSE_GLFW_WINDOW_HPP
#define KLSE_GLFW_WINDOW_HPP
#include "../rendering/renderer.hpp"
#include "../input.hpp"
#include <GLFW/glfw3.h>
namespace KLSE
{
    enum class GLAntialias:uint8_t{
        none,
        MSAA1X,
        MSAA2X,
        MSAA4X,
    };
    void GLFWInit_GL(GLAntialias antialias);
    class GLFWWindow:public Window{
        public:
            Renderer* renderer;

            PCInputListener* input;

            IVec2 get_size()override;
            void set_size(IVec2 size)override;

            void set_title(std::string title)override;

            void setResizable(bool resizable)override;

            void update()override;
            void close()override;
            bool closed()override;
            GLFWwindow* window;
            GLFWWindow(Renderer* renderer);
    };
} // namespace KLSE
#endif