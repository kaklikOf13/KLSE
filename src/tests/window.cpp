#include <KLSE/klse.hpp>
#include <KLSE/openGL/klse.hpp>
//#include <KLSE/vulkan/klse.hpp>
using namespace KLSE;
int main(int argc, char const *argv[])
{
    //VulkanInit();
    //VulkanWindow* window=new VulkanWindow();
    GLInit();
    GLWindow* window=new GLWindow();
    
    RectCollider2D* rect=new RectCollider2D(Vec2(1,0),Vec2(5,5));

    window->renderer->backgroundColor=RGBA::create(0,100,0);

    while (!window->closed()) {
        window->renderer->clear();
        window->renderer->draw_rect2D(rect,RGBA::create(0,0,0),Vec2());
        window->update();
    }
    window->close();
    return 0;
}