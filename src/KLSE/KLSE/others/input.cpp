/* Copyright (c) 2025 Kaklik
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/
#include <KLSE/KLSE/others/input.hpp>
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
