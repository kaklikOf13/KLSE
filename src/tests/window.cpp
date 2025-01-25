#include <KLSE/klse.hpp>
#include <KLSE/openGL/klse.hpp>
//#include <KLSE/vulkan/klse.hpp>
using namespace KLSE;
int main(int argc, char const *argv[])
{
    //VulkanInit();
    //VulkanWindow* window=new VulkanWindow();
    Init();
    GLInit(GLAntialias::MSAA4X);
    GLWindow* window=new GLWindow();
    
    RectCollider2D* rect=new RectCollider2D(Vec2(1,1),Vec2(1,1));
    Collider2D* circle = new CircleCollider2D(Vec2(3,2),1);

    window->renderer->backgroundColor=RGBA::create(0,100,0);

    Math::Random random("kaklik");

    for(int i=0;i<10;i++){
        std::cout<<random.idimention(0,100)<<" ";
    }
    std::cout<<"\n";
    Model3D* m=Model3D::cube(1);
    Transform3D t = Transform3D();
    Color color=HEXCOLOR::create("#000");
    for(uint16_t i=0;i<m->_vertex.size();i++){

    }
    Clock c = Clock(60);
    t.position.x=3;
    t.position.y=0;
    t.position.z=0;
    CameraIso3D* cam=new CameraIso3D();

    Dimention speed=0.1;

    while (!window->closed()) {
        window->renderer->clear();
        if(window->input->keyPress(Key::S)){
            t.position.z-=speed;
        }else if(window->input->keyPress(Key::W)){
            t.position.z+=speed;
        }

        if(window->input->keyPress(Key::D)){
            t.position.x+=speed;
        }else if(window->input->keyPress(Key::A)){
            t.position.x-=speed;
        }

        if(window->input->keyPress(Key::Space)){
            t.position.y-=speed;
        }else if(window->input->keyPress(Key::LShift)){
            t.position.y+=speed;
        }

        if(window->input->keyPress(Key::Q)){
            t.rotation.y-=speed;
        }else if(window->input->keyPress(Key::E)){
            t.rotation.y+=speed;
        }
        //window->renderer->draw_rect2D(rect,RGBA::create(0,0,0),Vec2());
        //window->renderer->draw_collider2D(circle,RGBA::create(255,0,0),Vec2());
        window->renderer->draw_model_iso3D(m,t,color,cam);
        window->update();
        c.tick();
    }
    window->close();
    return 0;
}