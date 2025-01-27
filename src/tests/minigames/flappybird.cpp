#include <KLSE/klse.hpp>
#include <KLSE/GFX/klse.hpp>
//#include <KLSE/vulkan/klse.hpp>
using namespace KLSE;

RectCollider2D* player=new RectCollider2D(Vec2(1,3),Vec2(.3,.3));
Vec2 playerVelocity=Vec2();
Color playerColor=HEXCOLOR::create("#d4ba11");
const Color pipesColor=HEXCOLOR::create("#13b50b");

const Dimention gravity=0.007;
const Dimention jumpForce=.09;
Dimention PipeSpeed=.05;

unsigned int score=0;

Vec2 screenSize;

std::vector<Collider2D*> pipes;
std::vector<RectCollider2D*> mountains;
std::vector<Color> mountainsColor;
std::vector<Dimention> mountainsSpeed;

void generatePipe(){
    Vec2 size=Vec2(.5,screenSize.y);
    Vec2 pos=Vec2::random2(Vec2(screenSize.x,(-size.y)+1),Vec2::add(screenSize,Vec2(5,(-size.y)-2)));

    pipes.push_back(new RectCollider2D(Vec2::add(pos,Vec2(0,size.y+1.5)),size));
    pipes.push_back(new RectCollider2D(pos,size));
}
void initMountains(){
    mountainsColor.clear();
    for(int i=0;i<mountains.size();i++){
        delete mountains[i];
    }
    mountains.clear();

    //Big Mountain
    mountains.push_back(new RectCollider2D(Vec2(4,2),Vec2(4,4)));
    mountainsColor.push_back(HEXCOLOR::create("#eef"));
    mountainsSpeed.push_back(.03);

    //Green
    mountains.push_back(new RectCollider2D(Vec2(0,4),Vec2(2,4)));
    mountainsColor.push_back(HEXCOLOR::create("#10780b"));
    mountainsSpeed.push_back(.05);
    
    mountains.push_back(new RectCollider2D(Vec2(7,4.5),Vec2(2,4)));
    mountainsColor.push_back(HEXCOLOR::create("#10780b"));
    mountainsSpeed.push_back(.056);
}

int main(int argc, char const *argv[])
{
    //VulkanInit();
    //VulkanWindow* window=new VulkanWindow();
    GLInit(GLAntialias::MSAA4X);
    GLFWWindow* window=new GLFWWindow(new GLRenderer());
    window->renderer->backgroundColor=HEXCOLOR::create("#2a8ce8");

    initMountains();

    Clock clock=Clock(60,1.0);
    window->setResizable(false);

    uint8_t pp=0;

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

        for(unsigned int i=0;i<mountains.size();i++){
            mountains[i]->position.x-=mountainsSpeed[i];
            if(mountains[i]->position.x<=-mountains[i]->size.x){
                mountains[i]->position.x=screenSize.x;
            }
            window->renderer->draw_collider2D(mountains[i],mountainsColor[i],Vec2());
        }

        for(unsigned int i=0;i<pipes.size();i++){
            pipes[i]->position.x-=PipeSpeed;
            window->renderer->draw_collider2D(pipes[i],pipesColor,Vec2());
            if(pipes[i]->position.x<-reinterpret_cast<RectCollider2D*>(pipes[i])->size.x){
                delete pipes[i];
                pipes.erase(pipes.begin()+i);
                if(pp>=1){
                    score++;
                    pp=0;
                    std::cout<<"SCORE: "<<score<<"\n";
                }else{
                    pp++;
                }
                continue;
            }

            if(player->collidingWith(pipes[i])){
                std::cout<<"YOU LOSE!\n";
                score=0;
                for(unsigned int j=0;j<pipes.size();j++){
                    delete pipes[j];
                }
                initMountains();
                pipes.clear();
            }
        }

        window->renderer->draw_collider2D(player,playerColor,Vec2());
        window->update();

        clock.tick();
    }
    window->close();
    return 0;
}