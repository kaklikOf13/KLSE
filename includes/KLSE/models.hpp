#ifndef KLSE_MODELS_HPP
#define KLSE_MODELS_HPP

#include "geometry.hpp"
#include "colliders.hpp"
#include <string>
#include <vector>

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
        static Model3D* parseObj(const std::string& objText);
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
