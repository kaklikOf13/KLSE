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
#ifndef KLSE_GL_RENDERER_HPP
#define KLSE_GL_RENDERER_HPP
#include "glad.h"
#include "../KLSE/rendering/models.hpp"
#include "../KLSE/rendering/renderer.hpp"
#include "../KLSE/others/input.hpp"
#include "../KLSE/rendering/materials.hpp"

#include <iostream>
namespace KLSE
{

    class GLRenderer;
    class GLSprite:public Sprite{
        public:
        GLRenderer* render;
        GLuint texture;
        GLSprite(GLuint texture,IVec2 size,GLRenderer* render):Sprite(size),texture(texture),render(render){};
        ~GLSprite(){
            glDeleteTextures(1, &texture);
        };
    }; 
    class GLRenderer:public Renderer{
        public:
            void draw_model3D(Model3D* model,const Transform3D& transform,void* material, Camera* camera,RenderMode3D=RenderMode3D::normal,ZeroStruct* additional=nullptr)override;
            void draw_model2D(Model2D* model,const Transform2D& transform,void* material, Camera* camera,ZeroStruct* additional=nullptr)override;
            void draw_sprite2D(Sprite* sprite,const Transform2D& transform, Camera* camera,Vec2 hotspot,Vec2 uv_offset=Vec2(),IVec2 uv_size=IVec2(0,0))override;

            void clear() override;

            void set_viewport(IVec2 size) override;

            GLRenderer():Renderer(RGBA::create(0,0,0)){};
            GLRenderer(Color backgroundColor):KLSE::Renderer(backgroundColor){};

            void init(Window* window)override;

            Sprite* load_sprite(Image* img,bool create_material=true)override;
    };
} // namespace KLSE
#endif