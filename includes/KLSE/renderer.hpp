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
#ifndef KLSE_RENDERER_HPP
#define KLSE_RENDERER_HPP
#include "geometry.hpp"
#include "colliders.hpp"
#include "models.hpp"
namespace KLSE
{
    enum RenderMode3D{
        normal=0,
        wireframe=1
    };

    struct Color {
        float r; // Red component (0.0 to 1.0)
        float g; // Green component (0.0 to 1.0)
        float b; // Blue component (0.0 to 1.0)
        float a; // Alpha component (0.0 to 1.0)
        Color(float r,float g, float b):r(r),g(g),b(b),a(1){};
        Color(float r,float g, float b, float a):r(r),g(g),b(b),a(a){};
    };

    struct RGBA {
        int r, g, b;
        int a = 255;

        static Color create(int r, int g, int b, int a);
        static Color create(int r, int g, int b);

        static Color from(RGBA json);
    };

    class VoxelModel{
        public:
            std::vector<Color> colors;
            std::vector<uint32_t> content;
            Vec3 size; 
    };

    namespace HEXCOLOR
    {
        Color create(std::string hex);
    }; // namespace HEX

    class Camera3D{
        public:
        Vec3 position;
        Vec3 rotation;

        Dimention fov;
        Dimention near;
        Dimention far;

        Matrix4 matrix;

        void update(Vec2 size);

        Camera3D():position(Vec3(0,0,0)),rotation(Vec3(0,0,0)),fov(70),near(0.001),far(3000){};

        private:
    };
    struct Camera2D{
        Dimention meter_size;
        Vec2 position;
        Dimention zoom;
        Dimention rotation;

        Matrix4 matrix;

        void update(Vec2 size);

        ~Camera2D()=default;
        Camera2D():position(Vec2()),zoom(1.0),meter_size(100.0),rotation(0.0){}
    };
    class Window;
    class Sprite;
    class Renderer {
        public:
        Color backgroundColor;
        Window* window;

        virtual void draw_model3D(Model3D* model,const Transform3D& transform,void* m, Camera3D* camera,RenderMode3D=RenderMode3D::normal)=0;
        virtual void draw_model2D(Model2D* model,const Transform2D& transform,void* m, Camera2D* camera)=0;

        virtual void clear(){};
        virtual void init(Window* window){};

        virtual void set_viewport(IVec2 size)=0;

        virtual Sprite* create_sprite(IVec2 size)=0;

        Renderer(Color backgroundColor):backgroundColor(backgroundColor){}
        Renderer():backgroundColor(0,0,0){}
    };

    class Window{
        public:
        Renderer* renderer;
        virtual void set_size(IVec2 size)=0;
        virtual IVec2 get_size()=0;

        virtual void setResizable(bool resizable)=0;

        virtual void set_title(std::string title)=0;
        virtual std::string get_title()=0;

        virtual void update()=0;

        virtual void close()=0;
        virtual bool closed()=0;
        Window():renderer(nullptr){};
    };
    class RContainer;
    class DrawForm2D{
        public:
        Collider2D* collider;
        Color color;
        void draw(Renderer* render,RContainer* container);
        DrawForm2D():color(RGBA::create(0,0,0)),collider(nullptr){};
        ~DrawForm2D();
    };
    class Sprite{
        public:
        std::string id;
        Renderer* render;
        IVec2 real_size;
        Vec2 size;
        virtual void draw_collider2D(Collider2D* hitbox,Color color,Vec2 offset,Vec2 scale=Vec2(1,1),unsigned int smooth=30)=0;
        ~Sprite(){};
    };
    class RContainer{
        public:
        std::vector<DrawForm2D*> forms;
        std::vector<RContainer*> childs;
        RContainer* parent;
        Vec2 position;
        Vec2 scale;
        Dimention rotation;
        void CalculateRealPosition();
        RContainer():scale(Vec2(1,1)){};
        ~RContainer();

        DrawForm2D* add_rectangle(Vec2 position, Vec2 size, Color color);
        DrawForm2D* add_circle(Vec2 position, Dimention size, Color color);
        RContainer* add_container();

        void draw(Renderer* render);

        Vec2 real_position;
        Vec2 real_scale;
    };
} // namespace KLSE

#endif