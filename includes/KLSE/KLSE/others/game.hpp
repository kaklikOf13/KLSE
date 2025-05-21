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
#ifndef KLSE_OTHER_GAME_HPP
#define KLSE_OTHER_GAME_HPP
#include "../rendering/renderer.hpp"
#include "../physics/objects2d.hpp"
#include "input.hpp"
namespace KLSE{
    class Game{
        public:
        Window* window;
        Renderer* renderer;

        bool running;
        Clock clock;

        ObjectsManager2D* objects2d;

        Camera2D* camera2d;
        Camera3D* camera3d;
        CameraI3D* camerai3d;

        PCInputListener* input;

        Game():window(nullptr),renderer(nullptr),input(nullptr),clock(Clock(50)),camera2d(new Camera2D()),camera3d(new Camera3D()),camerai3d(new CameraI3D()),objects2d(new ObjectsManager2D()){};
        Game(Window* window):window(window),renderer(window->renderer),input(window->input),clock(Clock(50)),camera2d(new Camera2D()),camera3d(new Camera3D()),camerai3d(new CameraI3D()),objects2d(new ObjectsManager2D()){};

        void run(bool);

        void tick();

        void draw();

        virtual void on_tick(){};
        virtual void on_draw(){};
        virtual void on_start(){};
        virtual void on_stop(){};
    };
}
#endif