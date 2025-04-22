#include <KLSE/klse.hpp>
#include <KLSE/GL/klse.hpp>
#include <KLSE/GLFW/klse.hpp>
using namespace KLSE;
int main(int argc, char const *argv[])
{
    Init();
    GLFWInit_GL(GLAntialias::MSAA4X);
    GLFWWindow* window=new GLFWWindow(new GLRenderer());
    window->renderer->backgroundColor=RGBA::create(0,100,0);

    Math::Random random(STD::string("suroimd2"));

    for(int i=0;i<10;i++){
        std::cout<<random.idimention(0,100)<<" ";
    }
    std::cout<<"\n";

    Camera2D* cam2=new Camera2D();

    while (!window->closed()) {
        window->renderer->clear();

        cam2->update(window->get_size());
        window->update();
    }
    window->close();
    return 0;
}