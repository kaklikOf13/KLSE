#include <KLSE/klse.hpp>
#include <KLSE/openGL/klse.hpp>
//#include <KLSE/vulkan/klse.hpp>
using namespace KLSE;

RectCollider2D* player=new RectCollider2D(Vec2(1,3),Vec2(.3,.3));
Vec2 playerVelocity=Vec2();
Color playerColor=HEXCOLOR::create("#d4ba11");
const Color pipesColor=HEXCOLOR::create("#13b50b");

const Dimention gravity=0.008;
const Dimention jumpForce=.13;
Dimention PipeSpeed=.1;

unsigned int score=0;

Vec2 screenSize;

std::vector<Collider2D*> pipes;

void generatePipe(){
    Vec2 size=Vec2(.5,screenSize.y);
    Vec2 pos=Vec2::random2(Vec2(screenSize.x,(-size.y)+1),Vec2::add(screenSize,Vec2(5,(-size.y)-2)));

    pipes.push_back(new RectCollider2D(Vec2::add(pos,Vec2(0,size.y+1.5)),size));
    pipes.push_back(new RectCollider2D(pos,size));
}

int main(int argc, char const *argv[])
{
    //VulkanInit();
    //VulkanWindow* window=new VulkanWindow();
    GLInit(GLAntialias::MSAA4X);
    GLWindow* window=new GLWindow();
    window->renderer->backgroundColor=HEXCOLOR::create("#2a8ce8");

    Clock clock=Clock(60);
    window->setResizable(false);

    while (!window->closed()) {
        screenSize=Vec2::dscale(window->get_size(),window->renderer->meter_size);

        window->renderer->clear();

        playerVelocity.y+=gravity;
        
        if(player->position.y<0){
            player->position.y=0;
            playerVelocity.y=0;
        }else if(player->position.y>screenSize.y-player->size.y){
            player->position.y=screenSize.y-player->size.y;
            playerVelocity.y=0;
        }
        
        if(window->input->keyDown(Key::Space)){
            playerVelocity.y=-jumpForce;
        }

        player->position=Vec2::add(player->position,playerVelocity);

        if(pipes.size()<2){
            generatePipe();
        }

        for(unsigned int i=0;i<pipes.size();i++){
            pipes[i]->position.x-=PipeSpeed;
            if(pipes[i]->position.x<-reinterpret_cast<RectCollider2D*>(pipes[i])->size.x){
                delete pipes[i];
                pipes.erase(pipes.begin()+i);
                score++;
                std::cout<<"SCORE: "<<score<<"\n";
                continue;
            }

            if(player->collidingWith(pipes[i])){
                std::cout<<"YOU LOSE!\n";
                score=0;
                for(unsigned int j=0;j<pipes.size();j++){
                    delete pipes[j];
                }
                pipes.clear();
            }

            window->renderer->draw_collider2D(pipes[i],pipesColor,Vec2());
        }

        window->renderer->draw_collider2D(player,playerColor,Vec2());
        window->update();

        clock.tick();
    }
    window->close();
    return 0;
}