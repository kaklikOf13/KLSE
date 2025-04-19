
#ifndef KLSE_GL_SPRITE_HPP
#define KLSE_GL_SPRITE_HPP
#include "renderer.hpp"
#include "../rendering/renderer.hpp"
namespace KLSE
{
    class GLSprite:public Sprite{
        public:
        GLRenderer* render;
        IVec2 size;
        GLuint texture;
        GLSprite(GLuint texture,IVec2 size,GLRenderer* render):texture(texture),size(size),render(render){};
        ~GLSprite(){
            glDeleteTextures(1, &texture);
        };
    }; 
} // namespace KLSE
#endif