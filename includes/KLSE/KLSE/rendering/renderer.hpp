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
#include "../physics/geometry.hpp"
#include "../physics/colliders.hpp"
#include "models.hpp"
#include <stdexcept>
#include <regex>
namespace KLSE
{
    enum RenderMode3D{
        normal=0,
        wireframe=1
    };
    struct Image;

    struct Color {
        float r; // Red component (0.0 to 1.0)
        float g; // Green component (0.0 to 1.0)
        float b; // Blue component (0.0 to 1.0)
        float a; // Alpha component (0.0 to 1.0)
        Color():r(0),g(0),b(0),a(1){};
        Color(float r,float g, float b):r(r),g(g),b(b),a(1){};
        Color(float r,float g, float b, float a):r(r),g(g),b(b),a(a){};
        static Color lerp(Color a, Color b, Dimention t);
    };

    struct RGBA {
        byte r, g, b;
        byte a = 255;

        static Color create(byte r, byte g, byte b, byte a=255);

        RGBA(Color color):r(static_cast<byte>(color.r*255)),g(static_cast<byte>(color.g*255)),b(static_cast<byte>(color.b*255)),a(static_cast<byte>(color.a*255)){};
        RGBA(byte r, byte g, byte b, byte a=255):r(r),g(g),b(b),a(a){};
        RGBA():r(0),b(0),g(0),a(255){};

        static Color to_color(RGBA rgba);
    };

    struct GradientColor{
        Color color;
        Dimention position;
        GradientColor():color(Color(0,0,0)),position(0){};
        GradientColor(Color color, Dimention position):color(color),position(position){};
    };

    namespace HEXCOLOR
    {
        Color create(std::string hex);
    }; // namespace HEX

    class Camera{
        public:
        Matrix4 matrix;
        virtual void update(Vec2 size){};
        virtual Vec2 pixel_to_meter(IVec2 px){return Vec2(px);};
        Camera(){};
    };
    class CameraI3D:public Camera{
        public:
        Vec3 position;

        Dimention meter_size;

        CameraI3D():Camera(),position(Vec3()),meter_size(100){};

        void update(Vec2 size);
        Vec2 pixel_to_meter(IVec2 px)override;

        private:
    };
    class Camera3D: public CameraI3D{
        public:
        Vec3 rotation;

        Dimention fov;
        Dimention near;
        Dimention far;

        void update(Vec2 size)override;

        Camera3D():CameraI3D(),rotation(Vec3(0,0,0)),fov(70),near(0.001),far(3000){};

        private:
    };
    class Camera2D:public Camera{
        public:
        Dimention meter_size;
        Vec2 position;
        Dimention zoom;
        Dimention rotation;

        void update(Vec2 size)override;
        Vec2 pixel_to_meter(IVec2 vec)override;

        ~Camera2D()=default;
        Camera2D():Camera(),position(Vec2()),zoom(1.0),meter_size(100.0),rotation(0.0){}
    };
    class Window;
    class Sprite;
    class Renderer {
        public:
        Color backgroundColor;
        Window* window;
        Model2D* default_rect;

        virtual void draw_model3D(Model3D* model,const Transform3D& transform,void* m, Camera* camera,RenderMode3D=RenderMode3D::normal,ZeroStruct* additional=nullptr)=0;
        virtual void draw_model2D(Model2D* model,const Transform2D& transform,void* m, Camera* camera,ZeroStruct* additional=nullptr)=0;
        virtual void draw_sprite2D(Sprite* sprite,const Transform2D& transform, Camera* camera,Vec2 hotspot,Vec2 uv_offset=Vec2(),IVec2 uv_size=IVec2(0,0))=0;

        virtual void clear(){};
        virtual void init(Window* window){};

        virtual void set_viewport(IVec2 size)=0;

        virtual Sprite* load_sprite(Image* img,bool create_material=true)=0;

        Renderer(Color backgroundColor):backgroundColor(backgroundColor),default_rect(Model2D::rect()){}
        Renderer():backgroundColor(0,0,0){}
    };

    class Window{
        public:
        Renderer* renderer;
        virtual void set_size(IVec2 size)=0;
        virtual IVec2 get_size()=0;

        virtual void setResizable(bool resizable)=0;

        virtual void set_title(std::string title)=0;

        virtual void update()=0;

        virtual void close()=0;
        virtual bool closed()=0;
        Window():renderer(nullptr){};
    };
    class Sprite{
        public:
        Renderer* render;
        ZeroClass* material;
        IVec2 size;
        Sprite(){};
        Sprite(IVec2 size):size(size){};
        ~Sprite(){
            delete material;
        };
    };
} // namespace KLSE

#endif