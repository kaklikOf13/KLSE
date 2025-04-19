
#ifndef KLSE_GL_SPRITE_HPP
#define KLSE_GL_SPRITE_HPP
#include "renderer.hpp"
#include "../renderer.hpp"
namespace KLSE
{
    class GLSprite:public Sprite{
        public:
        GLRenderer* render;
        IVec2 size;
        GLuint fbo, texture;
        GLSprite(GLuint fbo,GLuint texture,IVec2 size,GLRenderer* render):fbo(fbo),texture(texture),size(size),render(render){};
        ~GLSprite(){
            glDeleteFramebuffers(1, &fbo);
            glDeleteTextures(1, &texture);
        };
    }; 
} // namespace KLSE
#endif