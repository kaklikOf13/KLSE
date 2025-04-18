#include <KLSE/klse.hpp>
#include <KLSE/GL/klse.hpp>
#include <KLSE/GLFW/klse.hpp>
using namespace KLSE;
int main(int argc, char const *argv[])
{
    Init();
    GLFWInit_GL(GLAntialias::MSAA4X);
    GLFWWindow* window=new GLFWWindow(new GLRenderer());

    auto rect=new RectCollider2D(Vec2(0,0),Vec2(5,5));

    window->renderer->backgroundColor=RGBA::create(0,100,0);

    Math::Random random("kaklik");

    for(int i=0;i<10;i++){
        std::cout<<random.idimention(0,100)<<" ";
    }
    std::cout<<"\n";

    Model3D* m3=Model3D::cube();
    Transform3D t3 = Transform3D();
    t3.position.z=-2;
    auto material3=MF3_color->createMaterial({HEXCOLOR::create("#009")});

    Model2D* m2=Model2D::rect();
    Transform2D t2 = Transform2D();
    auto material2=MF2_color->createMaterial({HEXCOLOR::create("#034")});

    Clock c = Clock(60);
    Camera3D* cam3=new Camera3D();
    Camera2D* cam2=new Camera2D();

    Dimention speed=0.1;

    while (!window->closed()) {
        window->renderer->clear();

        if(window->input->keyPress(Key::S)){
            cam3->position.z-=speed;
        }else if(window->input->keyPress(Key::W)){
            cam3->position.z+=speed;
        }

        if(window->input->keyPress(Key::D)){
            cam3->position.x+=speed;
        }else if(window->input->keyPress(Key::A)){
            cam3->position.x-=speed;
        }

        if(window->input->keyPress(Key::Space)){
            cam3->position.y-=speed;
        }else if(window->input->keyPress(Key::LShift)){
            cam3->position.y+=speed;
        }

        if(window->input->keyPress(Key::Q)){
            cam3->rotation.y-=speed*20;
        }else if(window->input->keyPress(Key::E)){
            cam3->rotation.y+=speed*20;
        }

        cam3->update(window->get_size());
        cam2->update(window->get_size());

        window->renderer->draw_model3D(m3,t3,material3,cam3);
        window->renderer->draw_model2D(m2,t2,material2,cam2);

        window->update();
        c.tick();
    }
    window->close();
    return 0;
}