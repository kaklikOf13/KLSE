#include <KLSE/klse.hpp>
#include <KLSE/openGL/klse.hpp>
//#include <KLSE/vulkan/klse.hpp>
using namespace KLSE;
const unsigned int collidersN=100;

Vec2 spawnMin=Vec2(1,1);
Vec2 spawnMax=Vec2(5,5);

RectCollider2D* player=new RectCollider2D(Vec2(3.5,5),Vec2(.3,.3));
const Color playerColor=HEXCOLOR::create("#f05");

struct Projectile{
    Collider2D* collider;
    unsigned int lifeTime;
    Vec2 speed;
    Projectile(Collider2D* collider,unsigned int lifeTime,Vec2 speed):collider(collider),lifeTime(lifeTime),speed(speed){};
};
std::vector<Projectile> projectiles;

unsigned int Record=0;

const Dimention playerSpeed=0.07;
const auto dSD=25u;
auto shootDelay=dSD;
auto uSD=0u;

auto shootDelayReduce=0u;

Vec2 screenSize;

unsigned int score=0;

int main(int argc, char const *argv[])
{
    //VulkanInit();
    //VulkanWindow* window=new VulkanWindow();
    GLInit(GLAntialias::MSAA4X);
    GLWindow* window=new GLWindow();

    window->renderer->backgroundColor=RGBA::create(0,0,0);

    window->setResizable(false);

    Clock clock=Clock(60);

    while (!window->closed()) {
        window->renderer->clear();
        if(window->input->keyPress(Key::W)){
            player->position.y-=playerSpeed;
        }else if(window->input->keyPress(Key::S)){
            player->position.y+=playerSpeed;
        }

        if(window->input->keyPress(Key::D)){
            player->position.x+=playerSpeed;
        }else if(window->input->keyPress(Key::A)){
            player->position.x-=playerSpeed;
        }

        screenSize=Vec2::dscale(window->get_size(),window->renderer->meter_size);

        player->position=Vec2::clamp2(player->position,Vec2(),Vec2::sub(screenSize,player->size));

        if(shootDelayReduce==0){
            if(shootDelay>3){
                shootDelay--;
            }
            shootDelayReduce=30u;
        }else{
            shootDelayReduce--;
        }

        if(uSD==0){
            uSD=shootDelay;
            projectiles.push_back(Projectile(new CircleCollider2D(Vec2::random2(Vec2(0,-7),Vec2(screenSize.x,-3)),random::dimention(.07,.3)),70u,Vec2(0,random::dimention(0.2,.3))));
        }else{
            uSD--;
        }

        for(int i=0;i<projectiles.size();i++){
            projectiles[i].collider->position=Vec2::add(projectiles[i].collider->position,projectiles[i].speed);
            if(projectiles[i].lifeTime==0){
                delete projectiles[i].collider;
                projectiles.erase(projectiles.begin()+i);
                score++;
                std::cout<<"SCORE: "<<score<<"\n";
                continue;
            }else{
                projectiles[i].lifeTime-=1;
            }

            if(player->collidingWith(projectiles[i].collider)){
                player->position=Vec2(3.5,5);
                for(int j=0;j<projectiles.size();j++){
                    delete projectiles[j].collider;
                }
                projectiles.clear();
                shootDelay=dSD;
                std::cout<<"YOU LOSE!\n";
                if(score>Record){
                    Record=score;
                    std::cout<<"NEW RECORD OF "<<score<<"\n";
                }else{
                    std::cout<<"YOU FINAL SCORE: "<<score<<"\n";
                }
                score=0;
            }

            window->renderer->draw_collider2D(projectiles[i].collider,RGBA::create(255,255,255),Vec2());
        }

        window->renderer->draw_collider2D(player,playerColor,Vec2());

        window->update();

        clock.tick();
    }
    window->close();
    return 0;
}