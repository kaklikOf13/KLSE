#include <KLSE/klse.hpp>
#include <KLSE/GL/klse.hpp>
#include <KLSE/GLFW/klse.hpp>
using namespace KLSE;
Model2D* mod=Model2D::rect();
class Object1:public Object2D{
    Material* material;
    void on_create(Renderer* renderer,ZeroStruct* args)override{
        collider=new CircleCollider2D(1);
        MF2_color->createMaterial({HEXCOLOR::create("#0f6")});
    }
    void on_update(Dimention deltaTime)override{
        /*auto objs = layer->cells.get_objects(transform.position);
        for(uint64 i=0;i<objs.size();i++){
            if(objs[i]->id==id)continue;
            auto collision=collider->overlap_collision(transform,objs[i]->collider,objs[i]->transform);
            if(!collision.colliding)continue;
            transform.position+=collision.dire*collision.lenght;
        }*/
    }
    void on_draw(Renderer* render,Camera* camera){
        render->draw_model2D(mod,transform,material,camera);
    }
};
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

    Camera2D* cam=new Camera2D();

    ObjectsManager2D* obj=new ObjectsManager2D();

    auto layer=obj->add_layer(0);
    for(uint64 i=0;i<30;i++){
        layer->registry(new Object1(),window->renderer,{});
    }

    while (!window->closed()) {
        window->renderer->clear();

        
        cam->update(window->get_size());
        obj->draw(window->renderer,cam);

        window->update();
    }
    window->close();
    return 0;
}