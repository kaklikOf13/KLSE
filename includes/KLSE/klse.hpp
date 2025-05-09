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
#ifndef KLSE_HPP
#define KLSE_HPP
//Basics
#include "KLSE/basics/types.hpp"
#include "KLSE/basics/default_lib.hpp"

//NET
#include "KLSE/net/net.hpp"

//Others
#include "KLSE/others/utils.hpp"
#include "KLSE/others/input.hpp"

//Physics
#include "KLSE/physics/geometry.hpp"
#include "KLSE/physics/colliders.hpp"
#include "KLSE/physics/objects2d.hpp"

//Rendering
#include "KLSE/rendering/models.hpp"
#include "KLSE/rendering/renderer.hpp"
#include "KLSE/rendering/image.hpp"
#include "KLSE/rendering/materials.hpp"
namespace KLSE
{
    void Init();
} // namespace KLSE
#endif