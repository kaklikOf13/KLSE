#include <KLSE/klse.hpp>
#include <KLSE/GFX/klse.hpp>
using namespace KLSE;
int main(int argc, char const *argv[])
{
    Init();
    GLInit(GLAntialias::MSAA4X);
    GLFWWindow* window=new GLFWWindow(new GLRenderer());
    
    auto container=new RContainer();
    container->add_rectangle(Vec2(0,0),Vec2(1,1),RGBA::create(100,0,20));
    auto cc=container->add_container();
    cc->add_circle(Vec2(1,-0.1),0.3,RGBA::create(100,0,20));
    cc->add_circle(Vec2(1,1.1),0.3,RGBA::create(100,0,20));

    container->position.x+=1;
    container->position.y+=1;
    cc->position.y=1;

    auto sprite=window->renderer->create_sprite(Vec2(300,300));
    auto rect=new RectCollider2D(Vec2(0,0),Vec2(5,5));
    sprite->draw_collider2D(rect,RGBA::create(0,0,0),Vec2());

    window->renderer->backgroundColor=RGBA::create(0,100,0);

    Math::Random random("kaklik");

    for(int i=0;i<10;i++){
        std::cout<<random.idimention(0,100)<<" ";
    }
    std::cout<<"\n";
    Model3D* m=Model3D::cube();
    Transform3D t = Transform3D();
    t.position.z=-2;
    auto material=MF3_color->createMaterial({HEXCOLOR::create("#009")});
    Clock c = Clock(60);
    Camera3D* cam=new Camera3D();

    Dimention speed=0.1;

    while (!window->closed()) {
        window->renderer->clear();
        if(window->input->keyPress(Key::S)){
            cam->position.z-=speed;
            container->position.y+=speed;
        }else if(window->input->keyPress(Key::W)){
            cam->position.z+=speed;
            container->position.y-=speed;
        }

        if(window->input->keyPress(Key::D)){
            cam->position.x+=speed;
            container->position.x+=speed;
        }else if(window->input->keyPress(Key::A)){
            cam->position.x-=speed;
            container->position.x-=speed;
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
        container->draw(window->renderer);
        cam->update(window->get_size());
        window->renderer->draw_model3D(m,t,material,cam);
        window->update();
        c.tick();
    }
    window->close();
    return 0;
}