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
#ifndef KLSE_UTILS_MATH_HPP
#define KLSE_UTILS_MATH_HPP
#include "../basics/types.hpp"
#include "../basics/default_lib.hpp"
namespace KLSE{

    namespace Math
    {
        int32 floor(float32);
        int64 floor(float64);

        float64 max(float64,float64);
        float32 max(float32,float32);

        float64 min(float64,float64);
        float32 min(float32,float32);

        float64 abs(float64);
        float32 abs(float32);
        int64 abs(int64);
    }
}
#endif