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