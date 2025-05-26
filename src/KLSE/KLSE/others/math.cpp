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
#include <algorithm>
#include <KLSE/KLSE/others/math.hpp>
#include <iostream>
#include <thread>
namespace KLSE{

    namespace Math
    {
        int32 floor(float32 x){
            int32 i = static_cast<int32>(x);
            return (x < 0 && x != i) ? i - 1 : i;
        }
        int64 floor(float64 x){
            int64 i = static_cast<int64>(x);
            return (x < 0 && x != i) ? i - 1 : i;
        }

        float64 max(float64 a,float64 b){
            return a>b?a:b;
        }
        float32 max(float32 a,float32 b){
            return a>b?a:b;
        }

        float64 min(float64 a,float64 b){
            return a<b?a:b;
        }
        float32 min(float32 a,float32 b){
            return a<b?a:b;
        }

        float64 abs(float64 val){
            return val<0?-val:val;
        }
        float32 abs(float32 val){
            return val<0?-val:val;
        }
        int64 abs(int64 val){
            return val<0?-val:val;
        }
    }
}