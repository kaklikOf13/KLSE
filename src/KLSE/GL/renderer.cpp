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
#include <KLSE/GL/renderer.hpp>
#include <KLSE/GL/materials.hpp>
#include <KLSE/rendering/image.hpp>
#include <GLFW/glfw3.h>
namespace KLSE
{

    void GLRenderer::init(Window* window){
        if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
            std::cerr << "Failed to initialize GLAD" << std::endl;
            exit(-1);
        }
        this->window=window;

        InitOpenGLMaterials();

        glEnable(GL_DEPTH_TEST);
        glDepthFunc(GL_LEQUAL);
    }
    void GLRenderer::clear(){
        glClearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    }
    
    /*
    void GLRenderer::draw_circle2D(CircleCollider2D* circle, Color color, Vec2 offset,Vec2 scale, unsigned int smooth) {
        // 1. Calculate the circle's center position
        float cx = circle->position.x - offset.x;
        float cy = circle->position.y - offset.y;
        float radius = circle->radius;

        // 2. Prepare the vertices
        std::vector<Dimention> vertices;
        vertices.push_back(cx);  // Center vertex (x)
        vertices.push_back(cy);  // Center vertex (y)

        // Calculate the vertices around the circumference
        for (unsigned int i = 0; i <= smooth; ++i) {
            float angle = 2.0f * Math::PI * i / smooth;
            float x = cx + radius * cos(angle);
            float y = cy + radius * sin(angle);
            vertices.push_back(x);
            vertices.push_back(y);
        }

        // 3. Prepare the indices
        std::vector<unsigned int> indices;
        for (unsigned int i = 1; i <= smooth; ++i) {
            indices.push_back(0);  // Center vertex
            indices.push_back(i);
            indices.push_back(i + 1);
        }

        // 4. Call _draw_simple_vertex with the vertices and indices
        _draw_simple_vertex(vertices, indices, color,scale,simple_program, GL_TRIANGLES);
    }*/

    /*void GLRenderer::draw_collider2D(Collider2D* hitbox,Color color,Vec2 offset,Vec2 scale,unsigned int smooth){
        switch (hitbox->type)
        {
        case ColliderType2D::circle:
            draw_circle2D(reinterpret_cast<CircleCollider2D*>(hitbox),color,offset,scale,smooth);
            break;
        case ColliderType2D::rect:
            draw_rect2D(reinterpret_cast<RectCollider2D*>(hitbox),color,offset,scale);
            break;
        
        default:
            break;
        }
    }*/
    void GLRenderer::draw_model3D(Model3D* model,const Transform3D& transform,void* material, CameraI3D* camera,RenderMode3D m){
        reinterpret_cast<Material3DExecutionFunction2>(reinterpret_cast<Material3D<ZeroStruct,GLMaterialFArgs>*>(material)->factory->execute)(material,window,model,camera,transform);
    }
    void GLRenderer::draw_model2D(Model2D* model,const Transform2D& transform,void* material, Camera2D* camera){
        reinterpret_cast<Material2DExecutionFunction2>(reinterpret_cast<Material3D<ZeroStruct,GLMaterialFArgs>*>(material)->factory->execute)(material,window,model,camera,transform);
    }
    void GLRenderer::draw_sprite2D(Sprite* sprite,const Transform2D& transform, Camera2D* camera){
        Model2D* mod=Model2D::rect(Vec2(),camera->pixel_to_meter(sprite->size));
        draw_model2D(mod,transform,sprite->material,camera);
        delete mod;
    }
    void GLRenderer::set_viewport(IVec2 size){
        glViewport(0,0,size.x, size.y);
    }
    Sprite* GLRenderer::load_sprite(Image* img,bool create_material) {
        GLuint texture;
        glGenTextures(1, &texture);
        glBindTexture(GL_TEXTURE_2D, texture);

        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, img->size.x, img->size.y, 0,
                     GL_RGBA, GL_UNSIGNED_BYTE, img->content);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

        glGenerateMipmap(GL_TEXTURE_2D);
    
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    
        auto s = new GLSprite(texture, IVec2(img->size.x,img->size.y), this);
        if(create_material)s->material=reinterpret_cast<ZeroClass*>(MF2_sprite->createMaterial({s}));
        delete img;
        return reinterpret_cast<Sprite*>(s);
    }
}
