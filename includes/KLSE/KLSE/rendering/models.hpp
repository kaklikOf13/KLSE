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
#ifndef KLSE_MODELS_HPP
#define KLSE_MODELS_HPP

#include "../physics/geometry.hpp"
#include "../physics/colliders.hpp"
#include "../basics/default_lib.hpp"
#include <string>
#include <vector>
#include <sstream>
#include <cmath>
#include <fstream>

namespace KLSE {

    struct Vertex3D {
        Vec3 coords;
        Vec3 normals;
        //Vec2 texCoords;
    };

    class Model3D {
    public:
        std::vector<Vertex3D> _vertex;
        std::vector<uint32_t> _index;

        Model3D() = default;
        
        // Static methods
        static Model3D* cube(Vec3 min=Vec3(-0.5,-0.5,-0.5),Vec3 max=Vec3(0.5,0.5,0.5));
        static Model3D* parse_obj(const STD::string& objText);
        static Model3D* load_obj(const STD::string& path);
    };

    struct Vertex2D {
        Vec2 coords;
        Vec2 texCoords;
    };

    class Model2D {
    public:
        std::vector<Vertex2D> _vertex;
        std::vector<uint32_t> _index;

        static Model2D* rect(Vec2 min=Vec2(0,0),Vec2 max=Vec2(1,1),Vec2 uv_min=Vec2(0,0),Vec2 uv_max=Vec2(1,1));
        Model2D() = default;
    };

    using Matrix4 = std::vector<float>;
    
    namespace matrix4 {
        void print(Matrix4 m);
        Matrix4 identity();
        Matrix4 projection(Vec3 size);
        Matrix4 zToMatrix(Dimention fov);
        Matrix4 transpose(const Matrix4& m);
        Matrix4 perspective(Dimention fov, Dimention aspect, Dimention near, Dimention far);
        Matrix4 translation(Vec3 pos);
        Matrix4 mult(const Matrix4& a, const Matrix4& b);
        Matrix4 div(const Matrix4& a, const Matrix4& b);
        Matrix4 xRotation(Dimention angle);
        Matrix4 yRotation(Dimention angle);
        Matrix4 zRotation(Dimention angle);
        Matrix4 translate(const Matrix4& m, Vec3 pos);
        Matrix4 xRotate(const Matrix4& m, Dimention angle);
        Matrix4 yRotate(const Matrix4& m, Dimention angle);
        Matrix4 zRotate(const Matrix4& m, Dimention angle);
        Matrix4 rotate(const Matrix4& m, Vec3 angle);
        Matrix4 inverse(const Matrix4& m);
        Vec3 vecMultiply(Vec3 vec, const Matrix4& m);
    }

} // namespace KLSE

#endif // KLSE_MODELS_HPP
