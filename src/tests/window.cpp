#include <KLSE/klse.hpp>
#include <KLSE/GFX/klse.hpp>
//#include <KLSE/vulkan/klse.hpp>
using namespace KLSE;
int main(int argc, char const *argv[])
{
    Init();
    GLInit(GLAntialias::MSAA4X);
    GLFWWindow* window=new GLFWWindow(new GLRenderer());
    
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
    t.position.z=-2;
    Color color=HEXCOLOR::create("#009");
    for(uint16_t i=0;i<m->_vertex.size();i++){

    }
    Clock c = Clock(60);
    Camera3D* cam=new Camera3D();
    CameraIso3D* cami=CameraIso3D::TibiaStyle();
    cami->position.x=-3;
    //cam->position.x=0.2;

    Dimention speed=0.1;

    while (!window->closed()) {
        window->renderer->clear();
        if(window->input->keyPress(Key::S)){
            cam->position.z-=speed;
        }else if(window->input->keyPress(Key::W)){
            cam->position.z+=speed;
        }

        if(window->input->keyPress(Key::D)){
            cam->position.x+=speed;
        }else if(window->input->keyPress(Key::A)){
            cam->position.x-=speed;
        }

        if(window->input->keyPress(Key::Space)){
            cam->position.y-=speed;
        }else if(window->input->keyPress(Key::LShift)){
            cam->position.y+=speed;
        }

        if(window->input->keyPress(Key::Q)){
            cam->rotation.y-=speed*20;
        }else if(window->input->keyPress(Key::E)){
            cam->rotation.y+=speed*20;
        }
        window->renderer->draw_rect2D(rect,RGBA::create(0,0,0),Vec2());
        window->renderer->draw_collider2D(circle,RGBA::create(255,0,0),Vec2());
        cam->update(window->get_size());
        window->renderer->draw_model3D(m,t,color,cam);
        //window->renderer->draw_model_iso3D(m,t,color,cami);
        window->update();
        c.tick();
    }
    window->close();
    return 0;
}