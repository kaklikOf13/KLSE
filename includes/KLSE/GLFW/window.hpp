#ifndef KLSE_GLFW_WINDOW_HPP
#define KLSE_GLFW_WINDOW_HPP
#include "../renderer.hpp"
#include "../input.hpp"
#include <GLFW/glfw3.h>
namespace KLSE
{
    class GLFWWindow:public Window{
        public:
            Renderer* renderer;

            PCInputListener* input;

            IVec2 get_size()override;
            void set_size(IVec2 size)override;

            std::string get_title()override;
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