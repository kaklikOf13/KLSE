#include <KLSE/objects2d.hpp>
namespace KLSE
{
    void Layer2D::update(){
        for(ObjectID i=0;i<orden.size();i++){
            auto obj=orden[i];
            if(obj->destroyed){
                obj->on_destroy();
                unregistry(obj,i);
                if(i!=0){
                    i--;
                }
                continue;
            }
            if(obj->enabled){
                obj->on_update();
            }
        }
    }
    void Layer2D::unregistry(Object2D* obj,ObjectID i){
        objects.erase(obj->id);
        orden.erase(orden.begin()+i);
        delete obj;
    }
    void Layer2D::on_destroy(){
        while(orden.size()>0){
            unregistry(orden[0],0);
        }
    }
    Object2D* Layer2D::registry(Object2D* object, json args,ObjectID id){
        if(id==0){
            id=Math::random::object_id();
            while(objects.count(id)!=0){
                id=Math::random::object_id();
            }
        }
        if(objects.count(id)!=0){
            throw std::runtime_error(Formatter()<<"Object With ID "<<id<<" already exist");
        }

        object->id=id;
        object->manager=manager;
        object->layer=this;

        orden.push_back(object);
        objects[id]=object;

        object->on_create(args);
        return object;
    }

    void Layer2D::update_object(Object2D* obj){

    }

    std::vector<Object2D*> Layer2D::get_objects(Collider2D* collider){
        return orden;
    }

    void ObjectsManager2D::registry(Layer2D* layer){
        layer->manager=this;

        layers[layer->name]=layer;
        orden.push_back(layer);
    }

    Layer2D* ObjectsManager2D::add_layer2D(const std::string& layer){
        Layer2D* l=new Layer2D();
        l->name=layer;

        registry(l);
        return l;
    };
    void ObjectsManager2D::update(){
        for(ObjectID i=0;i<orden.size();i++){
            auto layer=orden[i];
            if(layer->destroyed){
                layer->on_destroy();

                layers.erase(layer->name);
                orden.erase(orden.begin()+1);
                if(i!=0){
                    i--;
                }
                delete layer;
            }
            if(layer->enabled){
                layer->update();
            }
        }
    }
}