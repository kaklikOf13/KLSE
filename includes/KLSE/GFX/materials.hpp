#ifndef KLSE_GL_MATERIAL_HPP
#define KLSE_GL_MATERIAL_HPP
#include "../materials.hpp"
#include "utils.hpp"
#include "../renderer.hpp"
namespace KLSE
{
    struct GLMaterialColorArgs{
        Color color;
    };
    struct GLMaterialFArgs{
        uint32_t program;
    };
    extern Material3DFactory<GLMaterialColorArgs,GLMaterialFArgs>* MF3_color;
    void InitOpenGLMaterials();
} // namespace KLSE
#endif