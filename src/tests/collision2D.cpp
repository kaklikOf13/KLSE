#include <KLSE/klse.hpp>
#include <KLSE/openGL/klse.hpp>
//#include <KLSE/vulkan/klse.hpp>
using namespace KLSE;
const unsigned int collidersN=100;

Vec2 spawnMin=Vec2(1,1);
Vec2 spawnMax=Vec2(2,2);
GLWindow* window;
Math::Random* rando=new Math::Random();
class OBJ:public Object2D{
    public:
    Color color;
    OBJ():color(RGBA::create(rando->idimention(0,255),rando->idimention(0,255),rando->idimention(0,255))){}
    void on_create(json args)override{
        if(Math::random::dimention(0,1)>0){
            collider=new CircleCollider2D(Vec2::random2(spawnMin,spawnMax),.1);
        }else{
            //collider=new RectCollider2D(Vec2::random2(spawnMin,spawnMax),Vec2(.2,.2));
        }
    }
    void on_update()override{
        window->renderer->draw_collider2D(collider,color,Vec2());
        auto objs=layer->get_objects(collider);
        for(unsigned int i=0;i<objs.size();i++){
            if(objs[i]==this){
                continue;
            }
            auto col=collider->overlapCollision(objs[i]->collider);
            if(col.colliding){
                collider->position=Vec2::sub(collider->position,Vec2::scale(col.overlap,.02));
                objs[i]->collider->position=Vec2::add(objs[i]->collider->position,Vec2::scale(col.overlap,.02));
            }
        }
       layer->update_object(this);
    }
};
int main(int argc, char const *argv[])
{
    //VulkanInit();
    //VulkanWindow* window=new VulkanWindow();
    Init();
    GLInit(GLAntialias::MSAA4X);
    window=new GLWindow();
    
    ObjectsManager2D* manager=new ObjectsManager2D();
    auto layer=manager->add_layer2D("main");

    for(unsigned int i=0;i<collidersN;i++){
       layer->registry(new OBJ());
    }

    window->renderer->backgroundColor=RGBA::create(0,100,0);

    Clock* clock=new Clock(30);

    while (!window->closed()) {
        window->renderer->clear();
        manager->update();
        window->update();

        clock->tick();
    }
    window->close();
    return 0;
}