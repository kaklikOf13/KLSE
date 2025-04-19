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

    Model3D* mi3=Model3D::loadObj("../../../assets/models/montains.obj");

    Transform3D t3 = Transform3D();
    t3.position.z=-2;
    Transform3D ti3 = Transform3D();
    ti3.position.x=3;
    ti3.scale*=0.1;
    auto material3=MF3_color->createMaterial({HEXCOLOR::create("#009")});

    auto materiali3=MFI3_color->createMaterial({HEXCOLOR::create("#fff")});

    Model2D* m2=Model2D::rect();
    Transform2D t2 = Transform2D();
    Transform2D t2t = Transform2D();
    t2t.position.y=3;
    t2t.position.x=3;
    auto material2=MF2_color->createMaterial({HEXCOLOR::create("#034")});

    Clock c = Clock(60);
    Camera3D* cam3=new Camera3D();
    CameraI3D* cami3=new CameraI3D();
    Camera2D* cam2=new Camera2D();

    Dimention speed=0.1;

    byte* data = new byte[64 * 64 * 4];

    for (int i = 0; i < 64 * 64; ++i) {
        data[i * 4 + 0] = i/64; // R
        data[i * 4 + 1] = 0;   // G
        data[i * 4 + 2] = 0;   // B
        data[i * 4 + 3] = 255; // A
    }

    auto material2t=MF2_sprite->createMaterial({reinterpret_cast<GLSprite*>(window->renderer->load_sprite_from_raw_data(data, 64, 64))});
    delete[] data;

    while (!window->closed()) {
        window->renderer->clear();

        if(window->input->keyPress(Key::S)){
            cam3->position.z-=speed;
            t2.position.y+=speed;
            ti3.position.z-=speed;
        }else if(window->input->keyPress(Key::W)){
            cam3->position.z+=speed;
            t2.position.y-=speed;
            ti3.position.z+=speed;
        }

        if(window->input->keyPress(Key::D)){
            cam3->position.x+=speed;
            t2.position.x+=speed;
            ti3.position.x+=speed;
        }else if(window->input->keyPress(Key::A)){
            cam3->position.x-=speed;
            t2.position.x-=speed;
            ti3.position.x-=speed;
        }

        if(window->input->keyPress(Key::Space)){
            cam3->position.y-=speed;
            cam2->zoom*=0.9;
            ti3.position.y-=speed;
        }else if(window->input->keyPress(Key::LShift)){
            cam3->position.y+=speed;
            cam2->zoom*=2;
            ti3.position.y+=speed;
        }

        if(window->input->keyPress(Key::Q)){
            cam3->rotation.y-=speed*20;
            cam2->position.x+=speed/2;
            ti3.rotation.x+=1;
        }else if(window->input->keyPress(Key::E)){
            cam3->rotation.y+=speed*20;
            cam2->position.x-=speed/2;
            ti3.rotation.x-=1;
        }

        cam3->update(window->get_size());
        cami3->update(window->get_size());
        cam2->update(window->get_size());

        window->renderer->draw_model3D(m3,t3,material3,cam3);
        window->renderer->draw_model3D(mi3,ti3,materiali3,cami3);
        window->renderer->draw_model2D(m2,t2,material2,cam2);
        window->renderer->draw_model2D(m2,t2t,material2t,cam2);

        window->update();
        c.tick();
    }
    window->close();
    return 0;
}