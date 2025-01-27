#ifndef KLSE_GL_RENDERER_HPP
#define KLSE_GL_RENDERER_HPP
#include "glad.h"
#include <GLFW/glfw3.h>
#include "../models.hpp"
#include "../renderer.hpp"
#include "../input.hpp"
#include "../materials.hpp"
#include "utils.hpp"
namespace KLSE
{
    void GLInit(GLAntialias antialias);

    struct GLMaterialColorArgs{
        Color color;
    };
    struct GLMaterialFArgs{
        uint32_t program;
    };
    extern Material3DFactory<GLMaterialColorArgs,GLMaterialFArgs>* MF3_color;

    class GLFWWindow;
    class GLRenderer;
    class GLRenderer:public Renderer{
        public:
            Window* window;

            Matrix4 projectionMatrix;

            unsigned int simple_program;

            void draw_rect2D(RectCollider2D* rect, Color color,Vec2 offset) override;
            void draw_circle2D(CircleCollider2D* circle,Color color,Vec2 offset,unsigned int smooth=30) override;
            void draw_collider2D(Collider2D* hitbox,Color color,Vec2 offset,unsigned int smooth=30) override;
            void draw_model3D(Model3D* model,const Transform3D& transform,void* material, Camera3D* camera,RenderMode3D=RenderMode3D::normal)override;
            void clear() override;

            void set_viewport(IVec2 size) override;

            void _draw_simple_vertex(const std::vector<Dimention>& vertex,const std::vector<unsigned int>& index, Color color, GLenum mode = GL_TRIANGLES);
            //void _draw_3d_vertices(const std::vector<Vertex3D>& vertex,const std::vector<uint32_t>& index,Camera3D* camera,Color color,Vec3 position,Vec3 rotation,Vec3 scale,RenderMode3D rmode,GLenum mode = GL_TRIANGLES);

            GLRenderer():Renderer(100,RGBA::create(0,0,0)){};
            GLRenderer(Dimention meter_size,Color backgroundColor):KLSE::Renderer(meter_size,backgroundColor){};

            void init(Window* window)override;
    };

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