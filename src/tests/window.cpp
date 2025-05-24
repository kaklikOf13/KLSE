#include <KLSE/klse.hpp>
#include <KLSE/GL/klse.hpp>
#include <KLSE/GLFW/klse.hpp>
using namespace KLSE;
Model3D* m3;

Model3D* mi3;

Transform3D t3;
Transform3D ti3;
ZeroStruct* material3;
ZeroStruct* materiali3;

Model2D* m2;
Transform2D t2;
Transform2D t2t;
ZeroStruct* material2;

Dimention speed;

Sprite* sprite1;
Sprite* sprite2;

Vec3 kaklik_pos;
Transform2D kaklik_t;

OfflineServer* server;
Socket* client_socket;
Socket* server_socket;
class WindowGame:public Game{
    public:
    WindowGame():Game(reinterpret_cast<Window*>(new GLFWWindow(new GLRenderer()))){}
    void on_start()override{
        auto rect=new RectCollider2D(Vec2(0,0),Vec2(5,5));

        renderer->backgroundColor=RGBA::create(0,100,0);
        m3=Model3D::cube();

        server=new OfflineServer();
        client_socket=OfflineSocket::ConnectTo(server);
        server_socket=server->accept();

        printf("client socket:%p, server socket:%p\n",client_socket,server_socket);

        mi3=Model3D::load_obj("../../../assets/models/montains.obj");

        t3 = Transform3D();
        t3.position.z=-2;
        ti3 = Transform3D();
        ti3.position.x=3;
        ti3.scale*=0.1;
        material3=reinterpret_cast<ZeroStruct*>(MF3_color->createMaterial({HEXCOLOR::create("#009")}));

        materiali3=reinterpret_cast<ZeroStruct*>(MFI3_color->createMaterial({HEXCOLOR::create("#fff")}));

        m2=Model2D::rect();
        t2 = Transform2D();
        t2t = Transform2D();
        t2t.position.y=3;
        t2t.position.x=3;
        material2=MF2_color->createMaterial({HEXCOLOR::create("#034")});

        speed=0.1;

        sprite1=renderer->load_sprite(Image::load_image("../../../assets/icons/icon_64x64.bmp"));
        sprite2=renderer->load_sprite(Image::load_image("../../../assets/images/kaklik.bmp"));

        kaklik_pos=Vec3(3,0,0);
        kaklik_t=Transform2D();
        kaklik_t.scale*=2;

        clock.timeout([](){
            Stream* stream=new Stream(1000);
            stream->write_uint64(1234);
            stream->write_float32(36.6f);
            client_socket->send(stream);

            delete stream;

            stream=server_socket->recv();

            auto intv=stream->read_uint64();
            auto floatv=stream->read_float32();
            printf("receved messages: %llu,%f, pointer:%llu\n",intv,floatv,stream->pointer);
            
            delete stream;
            printf("timeouted\n");
        },2);
    }
    void on_tick()override{
        if(input->keyPress(Key::S)){
            camera3d->position.z-=speed;
            t2.position.y+=speed;
            ti3.position.z-=speed;
            kaklik_pos.z-=speed*0.5;
        }else if(input->keyPress(Key::W)){
            camera3d->position.z+=speed;
            t2.position.y-=speed;
            ti3.position.z+=speed;
            kaklik_pos.z+=speed*0.5;
        }

        if(input->keyPress(Key::D)){
            camera3d->position.x+=speed;
            t2.position.x+=speed;
            ti3.position.x+=speed;
            kaklik_pos.x+=speed*0.5;
            kaklik_t.scale.x=2;
        }else if(input->keyPress(Key::A)){
            camera3d->position.x-=speed;
            t2.position.x-=speed;
            ti3.position.x-=speed;
            kaklik_pos.x-=speed*0.5;
            kaklik_t.scale.x=-2;
        }

        if(input->keyPress(Key::Space)){
            camera3d->position.y-=speed;
            camera2d->zoom-=0.1;
            ti3.position.y-=speed;
        }else if(input->keyPress(Key::LShift)){
            camera3d->position.y+=speed;
            camera2d->zoom+=0.1;
            ti3.position.y+=speed;
        }

        if(input->keyPress(Key::Q)){
            camera3d->rotation.y-=speed*20;
            camera2d->position.x+=speed/2;
            ti3.rotation.x+=1;
        }else if(input->keyPress(Key::E)){
            camera3d->rotation.y+=speed*20;
            camera2d->position.x-=speed/2;
            ti3.rotation.x-=1;
        }

        kaklik_t.position=Vec3::isometric_proj(kaklik_pos);
    }
    void on_draw()override{
        renderer->draw_model3D(m3,t3,material3,camera3d);
        renderer->draw_model3D(mi3,ti3,materiali3,camerai3d);

        renderer->draw_model2D(m2,t2,material2,camera2d);
    
        renderer->draw_sprite2D(sprite1,t2t,camera2d,Vec2());
        renderer->draw_sprite2D(sprite2,kaklik_t,camerai3d,Vec2(0.5,0),Vec2(),Vec2(22,45));
    }
};
int main(int argc, char const *argv[])
{
    Init();
    GLFWInit_GL(GLAntialias::MSAA4X);

    WindowGame* game = new WindowGame();

    Math::Random random(STD::string("kaklik"));

    for(int i=0;i<10;i++){
        std::cout<<random.idimention(0,100)<<" ";
    }
    std::cout<<"\n";

    game->run(true);
    return 0;
}