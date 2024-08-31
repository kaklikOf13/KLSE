#ifndef KLSE_VULKAN_RENDERER
#define KLSE_VULKAN_RENDERER
#include <vulkan/vulkan.h>
#include <GLFW/glfw3.h>
#include "../models.hpp"
#include "../renderer.hpp"
namespace KLSE
{

    void VulkanInit();

    class VulkanWindow;
    class VulkanRenderer;
    class VulkanRenderer:public Renderer{
        public:
            Window* window;

            GLfloat* projectionMatrix;

            unsigned int simple_program;

            void draw_rect2D(RectCollider2D* rect, Color normal,Vec2 offset) override;
            void draw_circle2D(CircleCollider2D circle,Color normal,Vec2 offset) override{};
            void draw_hitbox2D(Hitbox2D hitbox,Color normal,Vec2 offset) override{};
            void clear() override;

            void set_viewport(IVec2 size) override;

            void _draw_simple_vertex(const std::vector<float>& vertex, Color color, GLenum mode = GL_TRIANGLES);

            VulkanRenderer():Renderer(100,RGBA::create(0,0,0)){};
            VulkanRenderer(Dimention meter_size,Color backgroundColor):KLSE::Renderer(meter_size,backgroundColor){};

            void init(Window* window);
    };

    class VulkanWindow:public Window{
        public:
            VulkanRenderer* renderer;

            IVec2 get_size()override;
            void set_size(IVec2 size)override;

            std::string get_title()override;
            void set_title(std::string title)override;
            void update()override;
            void close()override;
            bool closed()override;
            GLFWwindow* window;
            VulkanWindow();
    };
} // namespace KLSE
#endif