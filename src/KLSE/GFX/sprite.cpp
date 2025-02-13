#include <KLSE/GFX/renderer.hpp>

namespace KLSE
{
    void GLSprite::draw_collider2D(Collider2D* col, Color color,Vec2 offset,Vec2 scale,unsigned int s){
        render->set_viewport(real_size);

        glBindFramebuffer(GL_FRAMEBUFFER, fbo);
        render->draw_collider2D(col,color,offset,scale,s);

        glBindFramebuffer(GL_FRAMEBUFFER, 0);
        render->set_viewport(reinterpret_cast<GLRenderer*>(render)->window->get_size());
    }
    void GLSprite::drawr(Renderer* r, std::vector<Dimention> vertices, std::vector<unsigned int> indices, unsigned int program){
        VAO vao1;

        vao1.Bind();

        VBO vbo1((GLdouble*)vertices.data(),sizeof(Vertex3D)*vertices.size());
        EBO ebo1((GLuint*)indices.data(),sizeof(uint32_t)*indices.size());

        vao1.LinkAttrib(vbo1,0,2,GL_DOUBLE,sizeof(Vertex3D),(void*)0);
        vao1.LinkAttrib(vbo1,1,2,GL_DOUBLE,sizeof(Vertex3D),(void*)(2*sizeof(Dimention)));

        glUseProgram(program);

        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, texture);
        glUniform1i(glGetUniformLocation(program, "u_Texture"), 0);

        ebo1.Free();
        vbo1.Free();
        vao1.Free();

        checkOpenGLError("_draw_sprite_2d");
    }
} // namespace KLSE