#include <KLSE/input.hpp>
namespace KLSE
{
    PCInputListener::PCInputListener(){
        keypressed.reserve(255);
        keydowned.reserve(255);
        keyupped.reserve(255);
    };
    bool PCInputListener::keyPress(Key key){
        return std::find(keypressed.begin(), keypressed.end(), key) != keypressed.end();
    };
    bool PCInputListener::keyDown(Key key){
        return std::find(keydowned.begin(), keydowned.end(), key) != keydowned.end();
    };
    bool PCInputListener::keyUp(Key key){
        return std::find(keyupped.begin(), keyupped.end(), key) != keyupped.end();
    };

    void PCInputListener::pressKey(Key key){
        if(!keyPress(key)){
            keypressed.push_back(key);
            keydowned.push_back(key);
        }
    };
    void PCInputListener::releaseKey(Key key){
        if(keyPress(key)){
            keypressed.erase(std::find(keypressed.begin(), keypressed.end(),key));
            keyupped.push_back(key);
        }
    };
    void PCInputListener::update(){
        keyupped.clear();
        keydowned.clear();
    };
} // namespace KLSE
