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
#ifndef KLSE_GL_MATERIAL_HPP
#define KLSE_GL_MATERIAL_HPP
#include "../rendering/materials.hpp"
#include "utils.hpp"
#include "renderer.hpp"
#include "../rendering/renderer.hpp"
namespace KLSE
{
    struct GLMaterialColorArgs{
        Color color;
    };
    struct GLMaterialFArgs{
        uint32_t program;
    };
    extern Material3DFactory<GLMaterialColorArgs,GLMaterialFArgs>* MF3_color;

    extern Material3DFactory<GLMaterialColorArgs,GLMaterialFArgs>* MFI3_color;

    extern Material2DFactory<GLMaterialColorArgs,GLMaterialFArgs>* MF2_color;

    struct GLMaterialSpriteArgs{
        GLSprite* sprite;
    };
    struct GLMaterialSpriteAdditional{
        IVec2 uv_size;
    };
    extern Material2DFactory<GLMaterialSpriteArgs,GLMaterialFArgs>* MF2_sprite;
    void InitOpenGLMaterials();
} // namespace KLSE
#endif