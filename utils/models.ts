import { type Vec3, v3 } from "./geometry.ts";
import { RectHitbox3D } from "./hitbox.ts";
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
    toRect():RectHitbox3D{
        const min=v3.new(0,0,0)
        const max=v3.new(0,0,0)
        for(let i=0;i+2<=this._vertices.length;i+=3){
            const p=v3.new(this._vertices[i],-this._vertices[i+1],this._vertices[i+2])
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
        return new RectHitbox3D(v3.new(0,0,0),v3.add(v3.absolute(min),v3.absolute(max)))
    }
    addFace3(face:Face3):FaceId{
        const ret:FaceId={p1:0,p2:0,p3:0,i:0}

        this._indices.push(Math.floor(this._vertices.length/3))
        ret.p1=this._vertices.length
        ret.i=this._indices.length
        this._vertices.push(face.p1.x,-face.p1.y,face.p1.z)

        this._indices.push(Math.floor(this._vertices.length/3))
        ret.p2=this._vertices.length
        this._vertices.push(face.p2.x,-face.p2.y,face.p2.z)

        this._indices.push(Math.floor(this._vertices.length/3))
        ret.p3=this._vertices.length
        this._vertices.push(face.p3.x,-face.p3.y,face.p3.z)

        if(face.normal){

            this._normalsM.push(Math.floor(this._normals.length/3))
            ret.normal={
                p1:this._normals.length,
                p2:0,
                p3:0,
                i:this._normalsM.length
            }
            this._normals.push(face.normal.p1.x,face.normal.p1.y,face.normal.p1.z)

            this._normalsM.push(Math.floor(this._normals.length/3))
            ret.normal.p2=this._normals.length
            this._normals.push(face.normal.p2.x,face.normal.p2.y,face.normal.p2.z)

            this._normalsM.push(Math.floor(this._normals.length/3))
            ret.normal.p3=this._normals.length
            this._normals.push(face.normal.p3.x,face.normal.p3.y,face.normal.p3.z)
        }
        if(face.texture){

            ret.texture={
                p1:this._texCoords.length,
                p2:0,
                p3:0,
                i:this._texCoordsM.length
            }
            this._texCoordsM.push(Math.floor(this._texCoords.length/3))

            this._texCoords.push(face.texture.p1.x,face.texture.p1.y,face.texture.p1.z)

            this._texCoordsM.push(Math.floor(this._texCoords.length/3))
            ret.p2=this._texCoords.length
            this._texCoords.push(face.texture.p2.x,face.texture.p2.y,face.texture.p2.z)

            this._texCoordsM.push(Math.floor(this._texCoords.length/3))
            ret.p3=this._texCoords.length
            this._texCoords.push(face.texture.p3.x,face.texture.p3.y,face.texture.p3.z)

        }
        return ret
    }
    addFace4(face:Face4):{0:FaceId,1:FaceId}{
        const f1=this.addFace3({
            p1:face.p1,
            p2:face.p2,
            p3:face.p4,
            normal:face.normal?{
                p1:face.normal.p1,
                p2:face.normal.p2,
                p3:face.normal.p4,
            }:undefined,
            texture:face.texture?{
                p1:face.texture.p1,
                p2:face.texture.p2,
                p3:face.texture.p4,
            }:undefined
        })
        const f2=this.addFace3({
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
        return {0:f1,1:f2}
    }
}
export const m3=Object.freeze({
    cube(s:number=1){
        const ret=new Model3D()
        ret._vertices=[
            0, 0, 0, // 0
            s, 0, 0, // 1
            0, -s, 0, // 2
            s, -s, 0, // 3
            0, 0, s, // 4
            s, 0, s, // 5
            0, -s, s, // 6
            s, -s, s  // 7
        ]
        ret._indices=[
            0, 1, 2, 1, 3, 2,
            4, 5, 6, 5, 7, 6,
            0, 1, 4, 1, 5, 4,
            2, 3, 6, 3, 7, 6,
            0, 2, 4, 2, 6, 4,
            1, 3, 5, 3, 7, 5 
        ]
        return ret
    },
    parseObj(objText: string):Model3D{
        const ret=new Model3D()
        const lines = objText.split('\n')
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('v ')) {
              const parts = line.split(/\s+/)
              const vertex = parts.slice(1).map(parseFloat)
              vertex[1]*=-1
              ret._vertices.push(...vertex)
            } else if (line.startsWith('vn ')) {
              const parts = line.split(/\s+/)
              const normal = parts.slice(1).map(parseFloat)
              ret._normals.push(...normal);
            } else if (line.startsWith('vt ')) {
              const parts = line.split(/\s+/)
              const textureCoord = parts.slice(1).map(parseFloat)
              ret._texCoords.push(...textureCoord)
            } else if (line.startsWith('f ')) {
              const parts = line.split(/\s+/).slice(1)
              const vertices = []
              const textures = []
              const normals = []
        
              for (const part of parts) {
                const [v, vt, vn] = part.split('/').map(str => parseInt(str) - 1)
                vertices.push(v);
                if (vt !== undefined) textures.push(vt);
                if (vn !== undefined) normals.push(vn);
              }
        
              ret._indices.push(...vertices)
              ret._normalsM.push(...normals)
              ret._texCoordsM.push(...textures)
            }
        }
        return ret
    }
})