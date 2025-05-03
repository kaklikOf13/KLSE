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
#include <KLSE/objects2d.hpp>
namespace KLSE
{
    #pragma region Object2D
    void Object2D::destroy(){
        on_destroy();
        destroyed=true;
    }
    void Object2D::encode(Stream* steam){
        
    }
    #pragma endregion
    #pragma region Cells
    void CellsManager2D::registry(Object2D* obj){
        objects[obj->id]=obj;
        update_object(obj);
    }
    void CellsManager2D::unregistry(Object2D* obj){
        remove_object_from_cells(obj->id);
        objects.erase(obj->id);
    }
    IVec2 CellsManager2D::cell_pos(Vec2 pos){
        return IVec2(pos/cells_size);
    }
    void CellsManager2D::remove_object_from_cells(ObjectID obj){
        if(objects_cells.find(obj)==objects_cells.end())return;
        for(uint32 i=0;i<objects_cells[obj].size();i++){
            IVec2 cp=objects_cells[obj][i];
            if(cells.find(cp.y)!=cells.end()&&cells[cp.y].find(cp.x)!=cells[cp.y].end()&&cells[cp.y][cp.x].find(obj)!=cells[cp.y][cp.x].end()){
                cells[cp.y][cp.x].erase(obj);
            }
        }
    }
    void CellsManager2D::update_object(Object2D* obj){
        remove_object_from_cells(obj->id);
        Vec2 cp=cell_pos(obj->transform.position);
        if(cells.find(cp.y)==cells.end()){
            cells[cp.y]={};
        }
        if(cells[cp.y].find(cp.x)==cells[cp.y].end()){
            cells[cp.y][cp.x]={};
        }
        cells[cp.y][cp.x][obj->id]=obj;

        //Objects
        RectCollider2D* rect=obj->collider->to_rect(obj->transform);
        IVec2 min = cell_pos(rect->position);
        IVec2 max = cell_pos(min+rect->size);
        if(max<min){
            IVec2 m=min;
            min=max;
            max=m;
        }
        if(objects_cells.find(obj->id)==objects_cells.end()){
            objects_cells[obj->id]={};
        }
        objects_cells[obj->id].clear();
        for(IDimention y=min.y;y<=max.y;y++){ 
            if(cells.find(cp.y)==cells.end())cells[y]={};
            for(IDimention x=min.x;x<=max.x;x++){
                if(cells[cp.y].find(cp.x)==cells[cp.y].end())cells[y][x]={};
                cells[y][x][obj->id]=obj;
                objects_cells[obj->id].push_back(IVec2(x,y));
            }
        }
        delete rect;
    }
    std::vector<Object2D*> CellsManager2D::get_objects(const Vec2& postion){
        std::vector<Object2D*> ret;
        IVec2 cp=cell_pos(postion);
        if(cells.find(cp.y)!=cells.end()&&cells[cp.y].find(cp.x)!=cells[cp.y].end()){
            for (const auto& par : cells[cp.y][cp.x]) {
                ret.push_back(par.second);
            }
        }
        return ret;
    }
    #pragma endregion
    #pragma region Layer2D
    void Layer2D::update(Dimention dt){
        for(ObjectID i=0;i<orden.size();i++){
            auto obj=orden[i];
            if(obj->destroyed){
                unregistry(obj,i);
                if(i!=0){
                    i--;
                }
                continue;
            }
            if(obj->enabled){
                obj->on_update(dt);
            }
        }
    }
    void Layer2D::draw(Renderer* renderer,Camera* camera){
        for(ObjectID i=0;i<orden.size();i++){
            auto obj=orden[i];
            if(obj->destroyed){
                if(i!=0){
                    i--;
                }
                continue;
            }
            if(obj->enabled){
                obj->on_draw(renderer,camera);
            }
        }
    }
    void Layer2D::unregistry(Object2D* obj,uint32 index){
        objects.erase(obj->id);
        orden.erase(orden.begin()+index);
        delete obj;
    }
    void Layer2D::on_destroy(){
        while(orden.size()>0){
            unregistry(orden[0],0);
        }
    }
    void Layer2D::destroy(){
        destroyed=true;
    }
    Object2D* Layer2D::registry(Object2D* object,Renderer* renderer, ZeroStruct* args,ObjectID id){
        if(id==0){
            id=Math::random::object_id();
            while(objects.count(id)!=0){
                id=Math::random::object_id();
            }
        }
        if(objects.count(id)!=0){
            //throw std::runtime_error(Formatter()<<"Object With ID "<<id<<" already exist");
        }

        object->id=id;
        object->manager=manager;
        object->layer=this;

        orden.push_back(object);
        objects[id]=object;

        cells.registry(object);

        object->on_create(renderer,args);

        delete args;
        return object;
    }
    #pragma endregion
    #pragma region ObjectsManager2D
    void ObjectsManager2D::registry(Layer2D* layer){
        layer->cells.cells_size=cells_size;


        layer->manager=this;
        layers[layer->id]=layer;
        orden.push_back(layer);
    }

    Layer2D* ObjectsManager2D::add_layer(uint32 layer){
        Layer2D* l=new Layer2D();
        l->id=layer;

        registry(l);
        return l;
    };
    void ObjectsManager2D::update(Dimention dt){
        for(ObjectID i=0;i<orden.size();i++){
            auto layer=orden[i];
            if(layer->destroyed){
                layer->on_destroy();

                layers.erase(layer->id);
                orden.erase(orden.begin()+i);
                if(i!=0){
                    i--;
                }
                delete layer;
            }
            if(layer->enabled){
                layer->update(dt);
            }
        }
    }
    void ObjectsManager2D::draw(Renderer* renderer,Camera* camera){
        for(ObjectID i=0;i<orden.size();i++){
            auto layer=orden[i];
            if(layer->enabled){
                layer->draw(renderer,camera);
            }
        }
    }
    #pragma endregion
}