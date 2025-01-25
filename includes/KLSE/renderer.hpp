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

        Camera3D():position(Vec3()),rotation(Vec3()),fov(70),near(0.001),far(3000){};

        private:
    };
    class CameraIso3D{
        public:
        Vec3 position;
        Vec2 rotation;

        Vec2 IsometricPosition(Vec3 pos);

        CameraIso3D():position(Vec3()),rotation(Vec2(1,1)){};
        CameraIso3D(Vec3 position,Vec2 rotation):position(position),rotation(rotation){};
        static CameraIso3D* TibiaStyle(){
            return new CameraIso3D(Vec3(),Vec2(0.2,1.4));
        }
    };

    class Window;
    class Renderer {
        public:
        Dimention meter_size;
        Color backgroundColor;
        Window* window;
        virtual void draw_rect2D(RectCollider2D* rect, Color color,Vec2 offset)=0;
        virtual void draw_circle2D(CircleCollider2D* circle,Color color,Vec2 offset,unsigned int smooth=30)=0;
        virtual void draw_collider2D(Collider2D* hitbox,Color color,Vec2 offset,unsigned int smooth=30)=0;
        //virtual void draw_image2D(Sprite image,Vec2 position,Vec2 size,Vec2 offset){};

        virtual void draw_model3D(Model3D* model,Transform3D transform, Camera3D* camera)=0;
        virtual void draw_model_iso3D(Model3D* model,Transform3D transform,Color color, CameraIso3D* camera,RenderMode3D=RenderMode3D::normal)=0;
        virtual void clear(){};

        virtual void set_viewport(IVec2 size)=0;

        Renderer(Dimention meter_size,Color backgroundColor):meter_size(meter_size),backgroundColor(backgroundColor){}
        Renderer():meter_size(100),backgroundColor(0,0,0){}
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
} // namespace KLSE

#endif