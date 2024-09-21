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

    while (!window->closed()) {
        window->renderer->clear();
        window->renderer->draw_rect2D(rect,RGBA::create(0,0,0),Vec2());
        window->renderer->draw_collider2D(circle,RGBA::create(255,0,0),Vec2());
        window->update();
    }
    window->close();
    return 0;
}