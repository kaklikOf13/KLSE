import { v3 } from "./geometry.ts";
import { RectHitbox3D } from "./hitbox.ts";

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
            const p=v3.new(this._vertices[i],this._vertices[i+1],this._vertices[i+2])
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
}
export const m3=Object.freeze({
    cube(s:number=1){
        const ret=new Model3D()
        ret._vertices=[
            0, 0, 0, // 0
            s, 0, 0, // 1
            0, s, 0, // 2
            s, s, 0, // 3
            0, 0, s, // 4
            s, 0, s, // 5
            0, s, s, // 6
            s, s, s  // 7
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