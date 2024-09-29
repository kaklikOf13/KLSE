#ifndef KLSE_OBJECTS_HPP
#define KLSE_OBJECTS_HPP
#include "colliders.hpp"
namespace KLSE
{
    using ObjectID=unsigned long int;

    class Layer2D;
    class ObjectsManager2D;

    class Object2D{
        public:

        //STATES
        Collider2D* collider;
        bool destroyed=false;
        bool enabled=true;
        ObjectID id=0;

        //PARENTS
        Layer2D* layer;
        ObjectsManager2D* manager;

        //FUNCTIONS
        virtual void on_update(){};
        virtual void on_create(json args){};
        virtual void on_destroy(){};

        //CONSTRUCTORS
        Object2D():collider(new Collider2D()){}
        ~Object2D(){
            delete collider;
        }
    };

    class Layer2D{
        public:
            std::unordered_map<ObjectID,Object2D*> objects;
            std::vector<Object2D*> orden;

            ObjectsManager2D* manager;
            std::string name;

            bool destroyed=false;
            bool enabled=true;

            virtual void update();
            virtual void update_object(Object2D* obj);
            virtual std::vector<Object2D*> get_objects(Collider2D* collider);

            virtual Object2D* registry(Object2D* object, json args=nullptr,ObjectID id=0);

            virtual void unregistry(Object2D* object,ObjectID i);

            virtual void on_destroy();

            Layer2D(){};
    };

    class ObjectsManager2D{
        public:
            std::map<std::string,Layer2D*> layers;
            std::vector<Layer2D*> orden;

            virtual Layer2D* add_layer2D(const std::string& layer);
            void registry(Layer2D* layer);

            virtual void update();
    };
} // namespace KLSE

#endif