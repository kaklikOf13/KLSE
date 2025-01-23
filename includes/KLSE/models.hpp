#ifndef KLSE_MODELS_HPP
#define KLSE_MODELS_HPP

#include "geometry.hpp"
#include "colliders.hpp"
#include <string>
#include <vector>

namespace KLSE {

    class Model3D {
    public:
        std::vector<Dimention> _vertex;
        std::vector<unsigned int> _index;
        std::vector<Dimention> _normals;
        std::vector<unsigned int> _normalsM;
        std::vector<Dimention> _texCoords;
        std::vector<unsigned int> _texCoordsM;

        Model3D() = default;

        // Converts to a BoxCollider3D
        BoxCollider3D* toRect() const;
        
        // Static methods
        static Model3D* cube(Dimention s = 1.0f);
        static Model3D* parseObj(const std::string& objText);
    };

    using Matrix4 = std::vector<float>;
    
    namespace matrix4 {
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
