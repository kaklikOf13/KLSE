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
#include <KLSE/models.hpp>
#include <sstream>
#include <cmath>

namespace KLSE {

    /*// Model3D methods
    BoxCollider3D* Model3D::toRect() const {
        Vec3 min(0, 0, 0), max(0, 0, 0);

        for (size_t i = 0; i + 2 < _vertex.size(); i += 3) {
            Vec3 p(-_vertex[i], _vertex[i + 1], _vertex[i + 2]);
            if (p.x < min.x) min.x = p.x;
            if (p.y < min.y) min.y = p.y;
            if (p.z < min.z) min.z = p.z;
            if (p.x > max.x) max.x = p.x;
            if (p.y > max.y) max.y = p.y;
            if (p.z > max.z) max.z = p.z;
        }
        return new BoxCollider3D(Vec3(0, 0, 0), Vec3::sub(max, min), Vec3());
    }*/

    Model3D* Model3D::cube(Vec3 min,Vec3 max) {
        Model3D* ret=new Model3D();
        
        ret->_vertex = {
            //Front Face
            {min,Vec3(0,0,1)},{Vec3(min.x,max.y,min.z),Vec3(0,0,1)},{Vec3(max.x,max.y,min.z),Vec3(0,0,1)},{Vec3(max.x,min.y,min.z),Vec3(0,0,1)},
            //Back Face
            {Vec3(min.x,min.x,max.z),Vec3(0,0,-1)},{Vec3(min.x,max.y,max.z),Vec3(0,0,-1)},{Vec3(max.x,max.y,max.z),Vec3(0,0,-1)},{Vec3(max.x,min.y,max.z),Vec3(0,0,-1)},
            //Left Face
            {min,Vec3(-1,0,0)},{Vec3(min.x,min.y,max.z),Vec3(-1,0,0)},{Vec3(min.x,max.y,max.z),Vec3(-1,0,0)},{Vec3(min.x,max.y,min.z),Vec3(-1,0,0)},
            //Right Face
            {Vec3(max.x,min.y,min.z),Vec3(1,0,0)},{Vec3(max.x,min.y,max.z),Vec3(1,0,0)},{Vec3(max.x,max.y,max.z),Vec3(1,0,0)},{Vec3(max.x,max.y,min.z),Vec3(1,0,0)},
            //Top Face
            {Vec3(min.x,min.y,min.z),Vec3(0,1,0)},{Vec3(min.x,min.y,max.z),Vec3(0,1,0)},{Vec3(max.x,min.y,max.z),Vec3(0,1,0)},{Vec3(max.x,min.y,min.z),Vec3(0,1,0)},
            //Bottom Face
            {Vec3(min.x,max.y,min.z),Vec3(0,-1,0)},{Vec3(max.x,max.y,min.z),Vec3(0,-1,0)},{Vec3(max.x,max.y,max.z),Vec3(0,-1,0)},{Vec3(min.x,max.y,max.z),Vec3(0,-1,0)},
        };

        ret->_index = {
            //Front Face
            0, 1, 2, 0, 3, 2,
            //Back Face
            4, 5, 6, 4, 7, 6,
            //Left Face
            8, 9,10, 8,11,10,
            //Right Face
            12,13,14,12,15,14,
            //Top Face
            16,17,18,16,19,18,
            //Bottom Face
            20,21,22,20,23,22
        };

        return ret;
    }

    Model3D* Model3D::parseObj(const std::string& objText) {
        Model3D* ret;
        /*std::istringstream stream(objText);
        std::string line;
        std::vector<Vec3> coords;
        std::vector<Vec3> normals;
        std::vector<Vec3> normals;

        while (std::getline(stream, line)) {
            std::istringstream lineStream(line);
            std::string prefix;
            lineStream >> prefix;

            if (prefix == "v") {
                float x, y, z;
                lineStream >> x >> y >> z;
                ret->_vertex.push_back(-x); // Invert x coordinate
                ret->_vertex.push_back(y);
                ret->_vertex.push_back(z);
            } else if (prefix == "vn") {
                float x, y, z;
                lineStream >> x >> y >> z;
                ret->_normals.push_back(x);
                ret->_normals.push_back(y);
                ret->_normals.push_back(z);
            } else if (prefix == "vt") {
                float u, v;
                lineStream >> u >> v;
                ret->_texCoords.push_back(u);
                ret->_texCoords.push_back(v);
            } else if (prefix == "f") {
                std::vector<int> vertices, textures, normals;
                std::string part;
                while (lineStream >> part) {
                    std::istringstream partStream(part);
                    std::string index;
                    int v, vt, vn;
                    std::getline(partStream, index, '/');
                    v = std::stoi(index) - 1;

                    if (std::getline(partStream, index, '/')) {
                        if (!index.empty()) {
                            vt = std::stoi(index) - 1;
                            textures.push_back(vt);
                        }
                    }
                    
                    if (std::getline(partStream, index, '/')) {
                        if (!index.empty()) {
                            vn = std::stoi(index) - 1;
                            normals.push_back(vn);
                        }
                    }

                    vertices.push_back(v);
                }

                ret->_index.insert(ret->_index.end(), vertices.begin(), vertices.end());
                ret->_normalsM.insert(ret->_normalsM.end(), normals.begin(), normals.end());
                ret->_texCoordsM.insert(ret->_texCoordsM.end(), textures.begin(), textures.end());
            }
        }*/
        return ret;
    }

    namespace matrix4 {

        void print(Matrix4 m){
            for(uint16_t i=0;i<m.size()/4;i++){
                for(uint16_t j=0;j<4;j++){
                    printf("%f ",m[i*4+j]);
                }
            }
            printf("\n");
        }

        Matrix4 identity() {
            Matrix4 m = {
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            };
            return m;
        }

        Matrix4 projection(Vec3 size) {
            Matrix4 m = {
                2.0f / static_cast<float>(size.x), 0, 0.0f, 0.0f,
                0, -2.0f / static_cast<float>(size.y), 0.0f, 0.0f,
                0, 0, -2.0f / static_cast<float>(size.z), 0.0f,
                -1.0f, 1.0f, -1.0f, 1.0f
            };
            return m;
        }

        Matrix4 zToMatrix(Dimention fov) {
            Matrix4 m = {
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, static_cast<float>(fov),
                0, 0, 0, 1
            };
            return m;
        }

        Matrix4 transpose(const Matrix4& m) {
            Matrix4 result = Matrix4(16);
            for (int i = 0; i < 4; ++i) {
                for (int j = 0; j < 4; ++j) {
                    result[i * 4 + j] = m[j * 4 + i];
                }
            }
            return result;
        }

        Matrix4 perspective(Dimention fov, Dimention aspect, Dimention near, Dimention far) {
            Matrix4 dst = Matrix4(16);
            Dimention f = 1.0f / std::tan(fov * 0.5f);
            Dimention rangeInv = 1.0f / (far - near); // Corrigido!

            dst[0] = f / aspect;
            dst[1] = 0;
            dst[2] = 0;
            dst[3] = 0;
            dst[4] = 0;
            dst[5] = f;
            dst[6] = 0;
            dst[7] = 0;
            dst[8] = 0;
            dst[9] = 0;
            dst[10] = -(far + near) * rangeInv;
            dst[11] = -1;
            dst[12] = 0;
            dst[13] = 0;
            dst[14] = -2.0f * far * near * rangeInv;
            dst[15] = 0;

            return dst;
        }

        Matrix4 translation(Vec3 pos) {
            Matrix4 m = identity();
            m[12] = pos.x;
            m[13] = pos.y;
            m[14] = pos.z;
            return m;
        }

        Matrix4 mult(const Matrix4& a, const Matrix4& b) {
            float a00 = a[0 * 4 + 0];
            float a01 = a[0 * 4 + 1];
            float a02 = a[0 * 4 + 2];
            float a03 = a[0 * 4 + 3];
            float a10 = a[1 * 4 + 0];
            float a11 = a[1 * 4 + 1];
            float a12 = a[1 * 4 + 2];
            float a13 = a[1 * 4 + 3];
            float a20 = a[2 * 4 + 0];
            float a21 = a[2 * 4 + 1];
            float a22 = a[2 * 4 + 2];
            float a23 = a[2 * 4 + 3];
            float a30 = a[3 * 4 + 0];
            float a31 = a[3 * 4 + 1];
            float a32 = a[3 * 4 + 2];
            float a33 = a[3 * 4 + 3];
            float b00 = b[0 * 4 + 0];
            float b01 = b[0 * 4 + 1];
            float b02 = b[0 * 4 + 2];
            float b03 = b[0 * 4 + 3];
            float b10 = b[1 * 4 + 0];
            float b11 = b[1 * 4 + 1];
            float b12 = b[1 * 4 + 2];
            float b13 = b[1 * 4 + 3];
            float b20 = b[2 * 4 + 0];
            float b21 = b[2 * 4 + 1];
            float b22 = b[2 * 4 + 2];
            float b23 = b[2 * 4 + 3];
            float b30 = b[3 * 4 + 0];
            float b31 = b[3 * 4 + 1];
            float b32 = b[3 * 4 + 2];
            float b33 = b[3 * 4 + 3];
            Matrix4 m={
                b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
                b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
                b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
                b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
            };
            return m;
        }

        Matrix4 div(const Matrix4& a, const Matrix4& b) {
            Matrix4 result = Matrix4(16);
            for (int i = 0; i < 16; ++i) {
                result[i] = b[i] / a[i];
            }
            return result;
        }

        Matrix4 xRotation(Dimention angle) {
            Dimention c = std::cos(angle);
            Dimention s = std::sin(angle);

            Matrix4 m = {
                1, 0, 0, 0,
                0, static_cast<float>(c), static_cast<float>(s), 0,
                0, static_cast<float>(-s), static_cast<float>(c), 0,
                0, 0, 0, 1
            };
            return m;
        }

        Matrix4 yRotation(Dimention angle) {
            Dimention c = std::cos(angle);
            Dimention s = std::sin(angle);

            Matrix4 m = {
                static_cast<float>(c), 0, static_cast<float>(-s), 0,
                0, 1, 0, 0,
                static_cast<float>(s), 0, static_cast<float>(c), 0,
                0, 0, 0, 1
            };
            return m;
        }

        Matrix4 zRotation(Dimention angle) {
            Dimention c = std::cos(angle);
            Dimention s = std::sin(angle);

            Matrix4 m = {
                static_cast<float>(c), static_cast<float>(s), 0, 0,
                static_cast<float>(-s), static_cast<float>(c), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            };
            return m;
        }

        Matrix4 translate(const Matrix4& m, Vec3 pos) {
            return mult(m, translation(pos));
        }

        Matrix4 xRotate(const Matrix4& m, Dimention angle) {
            return mult(m, xRotation(angle));
        }

        Matrix4 yRotate(const Matrix4& m, Dimention angle) {
            return mult(m, yRotation(angle));
        }

        Matrix4 zRotate(const Matrix4& m, Dimention angle) {
            return mult(m, zRotation(angle));
        }

        Matrix4 rotate(const Matrix4& m, Vec3 angle) {
            Matrix4 result = zRotate(yRotate(xRotate(m, Math::Deg2Rad(angle.x)), Math::Deg2Rad(angle.y)), Math::Deg2Rad(angle.z));
            return result;
        }

        Matrix4 inverse(const Matrix4& m) {
            // Calculate the inverse of the matrix using standard methods
            // This is a placeholder. Implement as needed based on your specific requirements.
            Matrix4 result = Matrix4(16);
            // Your matrix inversion implementation here.
            return result;
        }

        Vec3 vecMultiply(Vec3 vec, const Matrix4& m) {
            Vec3 result = {
                vec.x * m[0] + vec.y * m[4] + vec.z * m[8] + m[12],
                vec.x * m[1] + vec.y * m[5] + vec.z * m[9] + m[13],
                vec.x * m[2] + vec.y * m[6] + vec.z * m[10] + m[14]
            };
            return result;
        }

    } // namespace matrix4

} // namespace KLSE
