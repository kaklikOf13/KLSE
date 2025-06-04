#include <KLSE/klse.hpp>
#include <KLSE/GL/klse.hpp>
#include <KLSE/GLFW/klse.hpp>
using namespace KLSE;
Model2D* square=Model2D::rect();
void* material_r;
void* material_r2;
class ColliderOBJ:public Object2D{
    public:
    ColliderOBJ():Object2D(){
        number_type=10;
        string_type="collider";
    }
    ~ColliderOBJ(){

    }
    void on_create(ZeroStruct* args)override{
        transform.position=Vec2::random(0,7);
        transform.scale*=0.5;
        collider=new RectCollider2D(Vec2(0,0),Vec2(1,1));
    }
    void on_update(float64 deltaTime)override{
        auto objs=layer->cells.get_objects(transform.position);
        for(uint16 i=0;i<objs.size();i++){
            if(objs[i]->id==id||objs[i]->number_type==1)continue;
            auto col=collider->overlap_collision(transform,objs[i]->collider,objs[i]->transform);
            if(col.colliding){
                transform.position-=col.overlap*0.3;
            }
        }
        layer->cells.update_object(this);
    }
    void on_draw(Renderer* render,Camera* camera)override{
        render->draw_model2D(square,transform,material_r,camera,nullptr);
    }
};
class MColliderOBJ:public Object2D{
    public:
    MColliderOBJ():Object2D(){
        number_type=30;
        string_type="mcollider";
    }
    ~MColliderOBJ(){
    }

    void on_create(ZeroStruct* args)override{
        transform.position=Vec2(3,2);
        transform.scale*=0.5;
        collider=new RectCollider2D(Vec2(0,0),Vec2(1,1));
        number_type=1;
    }
    void on_update(float64 deltaTime)override{
        if(game->input->keyPress(Key::A)){
            transform.position.x-=1*deltaTime;
        }else if(game->input->keyPress(Key::D)){
            transform.position.x+=1*deltaTime;
        }
        if(game->input->keyPress(Key::W)){
            transform.position.y-=1*deltaTime;
        }else if(game->input->keyPress(Key::S)){
            transform.position.y+=1*deltaTime;
        }
        auto objs=layer->cells.get_objects(transform.position);
        for(uint16 i=0;i<objs.size();i++){
            if(objs[i]->id==id)continue;
            auto col=collider->overlap_collision(transform,objs[i]->collider,objs[i]->transform);
            if(col.colliding){
                transform.position-=col.dire*col.lenght;
            }
        }
        layer->cells.update_object(this);
    }
    void on_draw(Renderer* render,Camera* camera)override{
        render->draw_model2D(square,transform,material_r2,camera,nullptr);
    }
};
class WindowGame:public GameBase{
    public:
    WindowGame():GameBase(reinterpret_cast<Window*>(new GLFWWindow(new GLRenderer()))){}
    void on_start()override{
        objects2d->registry_object([]() -> Object2D* {
            return new ColliderOBJ();
        },{});
        /*objects2d->registry_object([]() -> Object2D* {
            return new MColliderOBJ();
        },{});*/

        objects2d->cells_size=2;
        Layer2D* layer=objects2d->add_layer(0);
        material_r=MF2_color->createMaterial({
            HEXCOLOR::create("#34f")
        });
        material_r2=MF2_color->createMaterial({
            HEXCOLOR::create("#f43")
        });
        
        layer->registry(new MColliderOBJ(),nullptr);
        for(uint16 i=0;i<25;i++){
            layer->registry(new ColliderOBJ(),nullptr);
        }
    }
    void on_tick()override{
    }
    void on_draw()override{
    }
    void on_awake(){

    }
};
int main(int argc, char const *argv[])
{
    Init();
    GLFWInit_GL(GLAntialias::MSAA4X);

    WindowGame* game = new WindowGame();

    game->run(true);
    return 0;
}