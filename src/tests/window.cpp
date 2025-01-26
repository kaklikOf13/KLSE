#include <KLSE/klse.hpp>
#include <KLSE/GFX/klse.hpp>
//#include <KLSE/vulkan/klse.hpp>
using namespace KLSE;
int main(int argc, char const *argv[])
{
    Init();
    GLInit(GLAntialias::MSAA4X);
    GLWindow* window=new GLWindow();
    
    RectCollider2D* rect=new RectCollider2D(Vec2(1,1),Vec2(1,1));
    Collider2D* circle = new CircleCollider2D(Vec2(1,3),0.5);

    window->renderer->backgroundColor=RGBA::create(0,100,0);

    Math::Random random("kaklik");

    for(int i=0;i<10;i++){
        std::cout<<random.idimention(0,100)<<" ";
    }
    std::cout<<"\n";
    Model3D* m=Model3D::cube();
    Transform3D t = Transform3D();
    Color color=HEXCOLOR::create("#009");
    for(uint16_t i=0;i<m->_vertex.size();i++){

    }
    Clock c = Clock(60);
    t.position.x=3;
    t.position.y=0;
    t.position.z=-2;
    CameraIso3D* cam=CameraIso3D::TibiaStyle();

    Dimention speed=1.5;

    while (!window->closed()) {
        window->renderer->clear();
        if(window->input->keyPress(Key::S)){
            t.rotation.z-=speed;
        }else if(window->input->keyPress(Key::W)){
            t.rotation.z+=speed;
        }

        if(window->input->keyPress(Key::D)){
            t.rotation.x+=speed;
        }else if(window->input->keyPress(Key::A)){
            t.rotation.x-=speed;
        }

        if(window->input->keyPress(Key::Space)){
            t.rotation.y-=speed;
        }else if(window->input->keyPress(Key::LShift)){
            t.rotation.y+=speed;
        }
        window->renderer->draw_rect2D(rect,RGBA::create(0,0,0),Vec2());
        window->renderer->draw_collider2D(circle,RGBA::create(255,0,0),Vec2());
        window->renderer->draw_model_iso3D(m,t,color,cam);
        window->update();
        c.tick();
    }
    window->close();
    return 0;
}