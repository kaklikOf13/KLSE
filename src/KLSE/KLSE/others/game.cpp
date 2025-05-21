#include "KLSE/KLSE/others/game.hpp"
namespace KLSE
{
    void Game::run(bool render){
        running=true;
        on_start();
        if(render){
            while(running){
                if(window->closed())running=false;
                tick();
                draw();
                clock.tick();
            }
        }else{
            while(running){
                tick();
                clock.tick();
            }
        }
        on_stop();
    }
    void Game::tick(){
        on_tick();
        objects2d->update(clock.deltaTime);
    }
    void Game::draw(){
        IVec2 size=window->get_size();
        camera2d->update(size);
        camera3d->update(size);
        camerai3d->update(size);
        renderer->clear();
        if(camera2d){
            objects2d->draw(renderer,camera2d);
        }
        on_draw();
        window->update();
    }
} // namespace KLSE
