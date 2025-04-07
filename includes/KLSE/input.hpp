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
#ifndef KLSE_INPUT_HPP
#define KLSE_INPUT_HPP
#include <vector>
#include <algorithm> 
#include <iostream>
namespace KLSE
{
    enum class Key:unsigned char{
        A=0,
        B,
        C,
        D,
        E,
        F,
        G,
        H,
        I,
        J,
        K,
        L,
        M,
        N,
        O,
        P,
        Q,
        R,
        S,
        T,
        U,
        V,
        W,
        X,
        Y,
        Z,
        Number_0,
        Number_1,
        Number_2,
        Number_3,
        Number_4,
        Number_5,
        Number_6,
        Number_7,
        Number_8,
        Number_9,
        
        Enter,
        Backspace,
        Space,
        Delete,
        Tab,
        LShift,
        RShift,
        LCtrl,
        RCtrl,
        LALT,
        RALT,

        Arrow_Up,
        Arrow_Down,
        Arrow_Left,
        Arrow_Right,

        Mouse_Left,
        Mouse_Middle,
        Mouse_Right,

        Mouse_Option1,
        Mouse_Option2
    };
    class PCInputListener{
        protected:
        std::vector<Key> keypressed;
        std::vector<Key> keydowned;
        std::vector<Key> keyupped;
        public:
        PCInputListener();
        bool keyPress(Key key);
        bool keyDown(Key key);
        bool keyUp(Key key);

        void pressKey(Key key);
        void releaseKey(Key key);
        void update();
    };
} // namespace KLSE
#endif