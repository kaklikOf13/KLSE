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
#include "../models.hpp"
#include "../renderer.hpp"
#include "../input.hpp"
#include "../materials.hpp"
#include "materials.hpp"
#include <iostream>
namespace KLSE
{

    class GLRenderer;
    class GLRenderer:public Renderer{
        public:
            Window* window;

            void draw_model3D(Model3D* model,const Transform3D& transform,void* material, Camera3D* camera,RenderMode3D=RenderMode3D::normal)override;
            void draw_model2D(Model2D* model,const Transform2D& transform,void* material, Camera2D* camera)override;
            void clear() override;

            void set_viewport(IVec2 size) override;

            GLRenderer():Renderer(RGBA::create(0,0,0)){};
            GLRenderer(Color backgroundColor):KLSE::Renderer(backgroundColor){};

            void init(Window* window)override;

            Sprite* create_sprite(IVec2 size)override;
    };
    class GLSprite:public Sprite{
        public:
        Renderer* render;
        IVec2 real_size;
        Vec2 size;
        GLSprite(GLuint fbo,GLuint texture,Vec2 size,IVec2 real_size,GLRenderer* render):fbo(fbo),texture(texture),size(size),real_size(real_size),render(render){};
        ~GLSprite(){
            glDeleteFramebuffers(1, &fbo);
            glDeleteTextures(1, &texture);
        };
        void drawr(Renderer* r, std::vector<Dimention> vertices, std::vector<unsigned int> indices, unsigned int program);
        void draw_collider2D(Collider2D* hitbox,Color color,Vec2 offset,Vec2 scale=Vec2(1,1),unsigned int smooth=30) override;
        protected:
        GLuint fbo, texture;
    };
} // namespace KLSE
#endif