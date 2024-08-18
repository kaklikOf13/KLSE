import { type Vec3, v3, RadAngle } from "./geometry.ts"
import { BoxHitbox3D } from "./hitbox.ts"
export interface Face3{
    p1:Vec3
    p2:Vec3
    p3:Vec3
    normal?:{
        p1:Vec3
        p2:Vec3
        p3:Vec3
    }
    texture?:{
        p1:Vec3
        p2:Vec3
        p3:Vec3
    }
}
export interface Face4{
    p1:Vec3 // Left Top
    p2:Vec3 // Right Top
    p3:Vec3 // Right Bottom
    p4:Vec3 // Left Bottom
    normal?:{
        p1:Vec3 // Left Top
        p2:Vec3 // Right Top
        p3:Vec3 // Right Bottom
        p4:Vec3 // Left Bottom
    }
    texture?:{
        p1:Vec3 // Left Top
        p2:Vec3 // Right Top
        p3:Vec3 // Right Bottom
        p4:Vec3 // Left Bottom
    }
}
export interface FaceId{
    p1:number
    p2:number
    p3:number
    i:number
    normal?:{
        p1:number
        p2:number
        p3:number
        i:number
    }
    texture?:{
        p1:number
        p2:number
        p3:number
        i:number
    }
}
export class Model3D{
    _vertices: number[]
    _indices: number[]
    _normalsM:number[]
    _normals: number[]
    _texCoords:number[]
    _texCoordsM:number[]
    constructor(){
        this._vertices=[]
        this._indices=[]
        this._normals=[]
        this._normalsM=[]
        this._texCoords=[]
        this._texCoordsM=[]
    }
    toRect():BoxHitbox3D{
        const min=v3.new(0,0,0)
        const max=v3.new(0,0,0)
        for(let i=0;i+2<=this._vertices.length;i+=3){
            const p=v3.new(-this._vertices[i],this._vertices[i+1],this._vertices[i+2])
            if(v3.lessOr(p,min)){
                if(p.x<min.x){
                    min.x=p.x
                }
                if(p.y<min.y){
                    min.y=p.y
                }
                if(p.z<min.z){
                    min.z=p.z
                }
            }else if(v3.greaterOr(p,max)){
                if(p.x>max.x){
                    max.x=p.x
                }
                if(p.y>max.y){
                    max.y=p.y
                }
                if(p.z>max.z){
                    max.z=p.z
                }
            }
        }
        return new BoxHitbox3D(v3.new(0,0,0),v3.add(v3.absolute(min),v3.absolute(max)))
    }
    addFace3(face:Face3):FaceId{
        const ret:FaceId={p1:-1,p2:-1,p3:-1,i:0}

        for(let i=0;i<this._vertices.length;i+=3){
            const v=v3.new(-this._vertices[i],this._vertices[i+1],this._vertices[i+2])
            if(v3.is(face.p1,v)){
                ret.p1=i
            }
            if(v3.is(face.p2,v)){
                ret.p2=i
            }
            if(v3.is(face.p3,v)){
                ret.p3=i
            }
        }

        ret.i=this._indices.length
        if(ret.p1===-1){
            this._indices.push(Math.floor(this._vertices.length/3))
            ret.p1=this._vertices.length
            this._vertices.push(-face.p1.x,face.p1.y,face.p1.z)
        }else{
            this._indices.push(Math.floor(ret.p1/3))
        }

        if(ret.p2===-1){
            this._indices.push(Math.floor(this._vertices.length/3))
            ret.p2=this._vertices.length
            this._vertices.push(-face.p2.x,face.p2.y,face.p2.z)
        }else{
            this._indices.push(Math.floor(ret.p2/3))
        }

        if(ret.p3===-1){
            this._indices.push(Math.floor(this._vertices.length/3))
            ret.p3=this._vertices.length
            this._vertices.push(-face.p3.x,face.p3.y,face.p3.z)
        }else{
            this._indices.push(Math.floor(ret.p3/3))
        }

        if(face.normal){
            ret.normal={
                p1:-1,
                p2:-1,
                p3:-1,
                i:this._normalsM.length
            }
            for(let i=0;i<this._normals.length;i+=3){
                const v=v3.new(this._normals[i],this._normals[i+1],this._normals[i+2])
                if(v3.is(face.normal.p1,v)){
                    ret.normal.p1=i
                }
                if(v3.is(face.normal.p2,v)){
                    ret.normal.p2=i
                }
                if(v3.is(face.normal.p3,v)){
                    ret.normal.p3=i
                }
            }

            if(ret.normal.p1===-1){
                this._normalsM.push(Math.floor(this._normals.length/3))
                ret.normal.p1=this._normals.length
                this._normals.push(face.normal.p1.x,face.normal.p1.y,face.normal.p1.z)
            }else{
                this._normalsM.push(Math.floor(ret.normal.p1/3))
            }
    
            if(ret.normal.p2===-1){
                this._normalsM.push(Math.floor(this._normals.length/3))
                ret.normal.p2=this._vertices.length
                this._normals.push(face.normal.p2.x,face.normal.p2.y,face.normal.p2.z)
            }else{
                this._normalsM.push(Math.floor(ret.normal.p2/3))
            }
    
            if(ret.normal.p3===-1){
                this._normalsM.push(Math.floor(this._normals.length/3))
                ret.normal.p3=this._normals.length
                this._normals.push(face.normal.p3.x,face.normal.p3.y,face.normal.p3.z)
            }else{
                this._normalsM.push(Math.floor(ret.normal.p3/3))
            }
        }
        if(face.texture){
            ret.texture={
                p1:-1,
                p2:-1,
                p3:-1,
                i:this._normalsM.length
            }
            for(let i=0;i<this._texCoords.length;i+=3){
                const v=v3.new(this._texCoords[i],this._texCoords[i+1],this._texCoords[i+2])
                if(v3.is(face.texture.p1,v)){
                    ret.texture.p1=i
                }
                if(v3.is(face.texture.p2,v)){
                    ret.texture.p2=i
                }
                if(v3.is(face.texture.p3,v)){
                    ret.texture.p3=i
                }
            }

            if(ret.texture.p1===-1){
                this._texCoordsM.push(Math.floor(this._texCoords.length/3))
                ret.texture.p1=this._normals.length
                this._texCoords.push(face.texture.p1.x,face.texture.p1.y,face.texture.p1.z)
            }else{
                this._texCoordsM.push(Math.floor(ret.texture.p1/3))
            }

            if(ret.texture.p2===-1){
                this._texCoordsM.push(Math.floor(this._texCoords.length/3))
                ret.texture.p2=this._normals.length
                this._texCoords.push(face.texture.p2.x,face.texture.p2.y,face.texture.p2.z)
            }else{
                this._texCoordsM.push(Math.floor(ret.texture.p2/3))
            }

            if(ret.texture.p3===-1){
                this._texCoordsM.push(Math.floor(this._texCoords.length/3))
                ret.texture.p3=this._normals.length
                this._texCoords.push(face.texture.p3.x,face.texture.p3.y,face.texture.p3.z)
            }else{
                this._texCoordsM.push(Math.floor(ret.texture.p3/3))
            }
        }
        return ret
    }
    addFace4(face:Face4):{0:FaceId,1:FaceId}{
        const f1=this.addFace3({
            p1:face.p1,
            p2:face.p2,
            p3:face.p3,
            normal:face.normal?{
                p1:face.normal.p1,
                p2:face.normal.p2,
                p3:face.normal.p3,
            }:undefined,
            texture:face.texture?{
                p1:face.texture.p1,
                p2:face.texture.p2,
                p3:face.texture.p3,
            }:undefined
        })
        const f2=this.addFace3({
            p1:face.p1,
            p2:face.p4,
            p3:face.p3,
            normal:face.normal?{
                p1:face.normal.p1,
                p2:face.normal.p4,
                p3:face.normal.p3,
            }:undefined,
            texture:face.texture?{
                p1:face.texture.p1,
                p2:face.texture.p4,
                p3:face.texture.p3,
            }:undefined
        })
        return {0:f1,1:f2}
    }
}
export const m3=Object.freeze({
    cube(s:number=1){
        const ret=new Model3D()
        ret._vertices = [
            // Front face
            0, 0, s,
            -s, 0, s,
            -s, s, s,
            0, s, s,
    
            // Back face
            0, 0, 0,
            -s, 0, 0,
            -s, s, 0,
            0, s, 0,
        ]
        ret._normals.push(
            // Normals for the front face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            // Normals for the back face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Normals for the top face
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // Normals for the bottom face
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            // Normals for the right face
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            // Normals for the left face
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
        )

        // Define the indices
        ret._indices = [
            // Front face
            0, 1, 2, 0, 2, 3,
            // Back face
            4, 5, 6, 4, 6, 7,
            // Top face
            3, 2, 6, 3, 6, 7,
            // Bottom face
            0, 1, 5, 0, 5, 4,
            // Right face
            1, 2, 6, 1, 6, 5,
            // Left face
            0, 3, 7, 0, 7, 4
        ]
        return ret
    },
    parseObj(objText: string):Model3D{
        const ret=new Model3D()
        const lines = objText.split('\n')
        for (let line of lines) {
            line = line.trim()
            if (line.startsWith('v ')) {
              const parts = line.split(/\s+/)
              const vertex = parts.slice(1).map(parseFloat)
              vertex[0]*=-1
              ret._vertices.push(...vertex)
            } else if (line.startsWith('vn ')) {
              const parts = line.split(/\s+/)
              const normal = parts.slice(1).map(parseFloat)
              ret._normals.push(...normal)
            } else if (line.startsWith('vt ')) {
              const parts = line.split(/\s+/)
              const textureCoord = parts.slice(1).map(parseFloat)
              ret._texCoords.push(...textureCoord)
            } else if (line.startsWith('f ')) {
              const parts = line.split(/\s+/).slice(1)
              const vertices:number[] = []
              const textures:number[] = []
              const normals:number[] = []
        
              for (const part of parts) {
                const [v, vt, vn] = part.split('/').map(str => parseInt(str) - 1)
                vertices.push(v)
                if (vt !== undefined) textures.push(vt)
                if (vn !== undefined) normals.push(vn)
              }
        
              ret._indices.push(...vertices)
              ret._normalsM.push(...normals)
              ret._texCoordsM.push(...textures)
            }
        }
        return ret
    },
})
export type Matrix=number[]|Float32Array
export const matrix4=Object.freeze({
    new(){
        return new Float32Array([
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
        ])
    },
    identity(): Matrix {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
    },
    projection(size:Vec3):Matrix{
        return [
           2 / size.x, 0, 0, 0,
           0, -2 / size.y, 0, 0,
           0, 0, 2 / size.z, 0,
          -1, 1, 0, 1,
        ];
    },
    zToMatrix(fov:number):Matrix{
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, fov,
            0, 0, 0, 1,
        ]
    },
    lookAt(cameraPosition: Vec3, target: Vec3, up: Vec3): Matrix {
        const zAxis = v3.normalize(v3.sub(cameraPosition, target));
        const xAxis = v3.normalize(v3.cross(up, zAxis));
        const yAxis = v3.cross(zAxis, xAxis);
    
        return [
          xAxis.x, xAxis.y, xAxis.z, 0,
          yAxis.x, yAxis.y, yAxis.z, 0,
          zAxis.x, zAxis.y, zAxis.z, 0,
          0, 0, 0, 1,
        ];
      },
    transpose(m:Matrix):Matrix{
        return [
          m[0], m[4], m[8], m[12],
          m[1], m[5], m[9], m[13],
          m[2], m[6], m[10], m[14],
          m[3], m[7], m[11], m[15],
        ]
    },
    perspective(fov:RadAngle, aspect:number, near:number, far:number, dst?:Matrix) {
        dst = dst || this.new()
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fov)
        const rangeInv = 1.0 / (near - far)
    
        dst[0] = f / aspect
        dst[1] = 0
        dst[2] = 0
        dst[3] = 0
        dst[4] = 0
        dst[5] = f
        dst[6] = 0
        dst[7] = 0
        dst[8] = 0
        dst[9] = 0
        dst[10] = (near + far) * rangeInv
        dst[11] = -1
        dst[12] = 0
        dst[13] = 0
        dst[14] = near * far * rangeInv * 2
        dst[15] = 0
    
        return dst
    },
    translation(pos:Vec3):Matrix{
        return [
           1,  0,  0,  0,
           0,  1,  0,  0,
           0,  0,  1,  0,
           pos.x, pos.y, pos.z, 1,
        ]
    },
    mult(a:Matrix, b:Matrix):Matrix{
        const a00 = a[0 * 4 + 0]
        const a01 = a[0 * 4 + 1]
        const a02 = a[0 * 4 + 2]
        const a03 = a[0 * 4 + 3]
        const a10 = a[1 * 4 + 0]
        const a11 = a[1 * 4 + 1]
        const a12 = a[1 * 4 + 2]
        const a13 = a[1 * 4 + 3]
        const a20 = a[2 * 4 + 0]
        const a21 = a[2 * 4 + 1]
        const a22 = a[2 * 4 + 2]
        const a23 = a[2 * 4 + 3]
        const a30 = a[3 * 4 + 0]
        const a31 = a[3 * 4 + 1]
        const a32 = a[3 * 4 + 2]
        const a33 = a[3 * 4 + 3]
        const b00 = b[0 * 4 + 0]
        const b01 = b[0 * 4 + 1]
        const b02 = b[0 * 4 + 2]
        const b03 = b[0 * 4 + 3]
        const b10 = b[1 * 4 + 0]
        const b11 = b[1 * 4 + 1]
        const b12 = b[1 * 4 + 2]
        const b13 = b[1 * 4 + 3]
        const b20 = b[2 * 4 + 0]
        const b21 = b[2 * 4 + 1]
        const b22 = b[2 * 4 + 2]
        const b23 = b[2 * 4 + 3]
        const b30 = b[3 * 4 + 0]
        const b31 = b[3 * 4 + 1]
        const b32 = b[3 * 4 + 2]
        const b33 = b[3 * 4 + 3]
        return [
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
        ]
    },
    div(a:Matrix, b:Matrix):Matrix{
        const a00 = a[0 * 4 + 0]
        const a01 = a[0 * 4 + 1]
        const a02 = a[0 * 4 + 2]
        const a03 = a[0 * 4 + 3]
        const a10 = a[1 * 4 + 0]
        const a11 = a[1 * 4 + 1]
        const a12 = a[1 * 4 + 2]
        const a13 = a[1 * 4 + 3]
        const a20 = a[2 * 4 + 0]
        const a21 = a[2 * 4 + 1]
        const a22 = a[2 * 4 + 2]
        const a23 = a[2 * 4 + 3]
        const a30 = a[3 * 4 + 0]
        const a31 = a[3 * 4 + 1]
        const a32 = a[3 * 4 + 2]
        const a33 = a[3 * 4 + 3]
        const b00 = b[0 * 4 + 0]
        const b01 = b[0 * 4 + 1]
        const b02 = b[0 * 4 + 2]
        const b03 = b[0 * 4 + 3]
        const b10 = b[1 * 4 + 0]
        const b11 = b[1 * 4 + 1]
        const b12 = b[1 * 4 + 2]
        const b13 = b[1 * 4 + 3]
        const b20 = b[2 * 4 + 0]
        const b21 = b[2 * 4 + 1]
        const b22 = b[2 * 4 + 2]
        const b23 = b[2 * 4 + 3]
        const b30 = b[3 * 4 + 0]
        const b31 = b[3 * 4 + 1]
        const b32 = b[3 * 4 + 2]
        const b33 = b[3 * 4 + 3]
        return [
          b00 / a00 + b01 / a10 + b02 / a20 + b03 / a30,
          b00 / a01 + b01 / a11 + b02 / a21 + b03 / a31,
          b00 / a02 + b01 / a12 + b02 / a22 + b03 / a32,
          b00 / a03 + b01 / a13 + b02 / a23 + b03 / a33,
          b10 / a00 + b11 / a10 + b12 / a20 + b13 / a30,
          b10 / a01 + b11 / a11 + b12 / a21 + b13 / a31,
          b10 / a02 + b11 / a12 + b12 / a22 + b13 / a32,
          b10 / a03 + b11 / a13 + b12 / a23 + b13 / a33,
          b20 / a00 + b21 / a10 + b22 / a20 + b23 / a30,
          b20 / a01 + b21 / a11 + b22 / a21 + b23 / a31,
          b20 / a02 + b21 / a12 + b22 / a22 + b23 / a32,
          b20 / a03 + b21 / a13 + b22 / a23 + b23 / a33,
          b30 / a00 + b31 / a10 + b32 / a20 + b33 / a30,
          b30 / a01 + b31 / a11 + b32 / a21 + b33 / a31,
          b30 / a02 + b31 / a12 + b32 / a22 + b33 / a32,
          b30 / a03 + b31 / a13 + b32 / a23 + b33 / a33,
        ]
    },
    xRotation(angle:RadAngle):Matrix{
        const c = Math.cos(angle)
        const s = Math.sin(angle)
    
        return [
          1, 0, 0, 0,
          0, c, s, 0,
          0, -s, c, 0,
          0, 0, 0, 1,
        ]
    },
    
    yRotation(angle:RadAngle):Matrix{
        const c = Math.cos(angle)
        const s = Math.sin(angle)

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ]
    },

    zRotation(angle:RadAngle):Matrix{
        const c = Math.cos(angle)
        const s = Math.sin(angle)

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
    },

    translate(m:Matrix, pos:Vec3):Matrix{
        return this.mult(m, this.translation(pos))
    },

    xRotate(m:Matrix, angle:RadAngle):Matrix{
        return this.mult(m, this.xRotation(angle))
    },

    yRotate(m:Matrix, angle:RadAngle):Matrix{
        return this.mult(m, this.yRotation(angle))
    },

    zRotate(m:Matrix, angle:RadAngle):Matrix{
        return this.mult(m, this.zRotation(angle))
    },
    rotate(m:Matrix, angle:Vec3):Matrix{
        return this.zRotate(this.yRotate(this.xRotate(m,angle.x),angle.y),angle.z)
    },

    inverse(m:Matrix):Matrix{
        const m00 = m[0 * 4 + 0]
        const m01 = m[0 * 4 + 1]
        const m02 = m[0 * 4 + 2]
        const m03 = m[0 * 4 + 3]
        const m10 = m[1 * 4 + 0]
        const m11 = m[1 * 4 + 1]
        const m12 = m[1 * 4 + 2]
        const m13 = m[1 * 4 + 3]
        const m20 = m[2 * 4 + 0]
        const m21 = m[2 * 4 + 1]
        const m22 = m[2 * 4 + 2]
        const m23 = m[2 * 4 + 3]
        const m30 = m[3 * 4 + 0]
        const m31 = m[3 * 4 + 1]
        const m32 = m[3 * 4 + 2]
        const m33 = m[3 * 4 + 3]
        const tmp_0  = m22 * m33
        const tmp_1  = m32 * m23
        const tmp_2  = m12 * m33
        const tmp_3  = m32 * m13
        const tmp_4  = m12 * m23
        const tmp_5  = m22 * m13
        const tmp_6  = m02 * m33
        const tmp_7  = m32 * m03
        const tmp_8  = m02 * m23
        const tmp_9  = m22 * m03
        const tmp_10 = m02 * m13
        const tmp_11 = m12 * m03
        const tmp_12 = m20 * m31
        const tmp_13 = m30 * m21
        const tmp_14 = m10 * m31
        const tmp_15 = m30 * m11
        const tmp_16 = m10 * m21
        const tmp_17 = m20 * m11
        const tmp_18 = m00 * m31
        const tmp_19 = m30 * m01
        const tmp_20 = m00 * m21
        const tmp_21 = m20 * m01
        const tmp_22 = m00 * m11
        const tmp_23 = m10 * m01
    
        const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
    
        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)
    
        return [
          d * t0,
          d * t1,
          d * t2,
          d * t3,
          d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
          d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
          d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
          d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
          d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
          d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
          d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
          d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
          d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
          d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
          d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
          d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ]
    },
    vecMultiply(vec:Vec3, m:Matrix):Vec3{
        const v=[vec.x,vec.y,vec.z,1]
        const dst = []
        for (let i = 0; i < 4; ++i) {
            dst[i] = 0
            for (let j = 0; j < 4; ++j) {
                dst[i] += v[j] * m[j * 4 + i]
            }
        }
        return v3.new(v[0],v[1],v[2])
    },
})