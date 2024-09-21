#include <KLSE/klse.hpp>
#include <KLSE/openGL/klse.hpp>
//#include <KLSE/vulkan/klse.hpp>
using namespace KLSE;
const unsigned int collidersN=100;

Vec2 spawnMin=Vec2(1,1);
Vec2 spawnMax=Vec2(5,5);

std::vector<Collider2D*> colliders={};
int main(int argc, char const *argv[])
{
    //VulkanInit();
    //VulkanWindow* window=new VulkanWindow();
    Init();
    GLInit(GLAntialias::MSAA4X);
    GLWindow* window=new GLWindow();
    
    for(unsigned int i=0;i<collidersN;i++){
        if(Math::random::dimention(0,1)<=.5){
            colliders.push_back(new CircleCollider2D(Vec2::random2(spawnMin,spawnMax),.3));
        }else{
            colliders.push_back(new CircleCollider2D(Vec2::random2(spawnMin,spawnMax),.3));
            //colliders.push_back(new RectCollider2D(Vec2::random2(spawnMin,spawnMax),Vec2(.3,.3)));
        }
    }

    window->renderer->backgroundColor=RGBA::create(0,100,0);

    Clock* clock=new Clock(60);

    while (!window->closed()) {
        window->renderer->clear();
        for(unsigned int i=0;i<colliders.size();i++){
            for(unsigned int j=0;j<colliders.size();j++){
                if(i==j){
                    continue;
                }
                auto col=colliders[i]->overlapCollision(colliders[j]);
                if(col.colliding){
                    colliders[i]->position=Vec2::sub(colliders[i]->position,Vec2::scale(col.overlap,.01));
                    colliders[j]->position=Vec2::add(colliders[j]->position,Vec2::scale(col.overlap,.01));
                }
            }
            window->renderer->draw_collider2D(colliders[i],RGBA::create(0,0,0),Vec2());
        }
        window->update();
        clock->tick();
    }
    window->close();
    return 0;
}