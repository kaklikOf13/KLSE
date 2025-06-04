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
#include "../rendering/renderer.hpp"
#include "../net/stream.hpp"
#include <unordered_map>
#include <map>
#include "../others/definitions.hpp"
namespace KLSE
{
    using ObjectID=unsigned long int;

    class Layer2D;
    class ObjectsManager2D;
    class GameBase;
    class Object2D;

    struct NetSync{
        bool deletion,creation,dirty;
    };

    struct Object2DEncoderDef{
        public:
        void(*encode)(Stream*,Object2D*);
        void(*decode)(Stream*,Object2D*);
        Object2DEncoderDef(){};
    };

    using Object2DConstructor=Object2D*(*)();

    class Object2D{
        public:

        //STATES
        Collider2D* collider;
        Transform2D transform;
        bool destroyed=false;
        bool enabled=true;

        //DEFS
        ObjectID id=0;
        uint32 number_type=0;
        STD::string string_type="";
        NetSync netsync={true,true,true};

        //PARENTS
        Layer2D* layer;
        ObjectsManager2D* manager;
        GameBase* game;

        //FUNCTIONS

        virtual void on_update(float64){};
        virtual void on_draw(Renderer*,Camera*){};
        virtual void on_create(ZeroStruct*){};
        virtual void on_destroy(){};

        //ADDITIONAL FUNCTIONS
        void destroy();
        void encode(Stream*);

        //CONSTRUCTORS
        Object2D():collider(nullptr){}
        virtual ~Object2D(){
            if(collider!=nullptr){
                delete collider;
                collider=nullptr;
            }
        }
    };

    class CellsManager2D{
        public:
        Layer2D* layer;
        std::unordered_map<ObjectID,std::vector<IVec2>> objects_cells;
        std::unordered_map<ObjectID,Object2D*> objects;
        std::unordered_map<IDimention,std::unordered_map<IDimention,std::map<ObjectID,Object2D*>>> cells;
        IDimention cells_size=10;

        void registry(Object2D* obj);
        void unregistry(Object2D* obj);

        IVec2 cell_pos(Vec2);

        void update_object(Object2D* obj);
        std::vector<Object2D*> get_objects(const Vec2& postion);
        //void reload();

        protected:
        void remove_object_from_cells(ObjectID id);
    };
    class Layer2D{
        public:
            std::unordered_map<ObjectID,Object2D*> objects;
            std::vector<Object2D*> orden;

            ObjectsManager2D* manager;

            CellsManager2D cells;

            uint32 id;

            bool destroyed=false;
            bool enabled=true;

            void destroy();

            virtual void update(Dimention deltaTime);
            virtual void draw(Renderer*,Camera*);

            virtual Object2D* registry(Object2D* object,ZeroStruct* args,ObjectID id=0);

            virtual void unregistry(Object2D* object,uint32 index);

            virtual void on_destroy();

            Layer2D(){};
    };

    class ObjectsManager2D{
        public:
            std::unordered_map<uint32,Layer2D*> layers;
            std::vector<Layer2D*> orden;

            IDimention cells_size=10;
            GameBase* game;

            virtual Layer2D* add_layer(uint32 layer);
            void registry(Layer2D* layer);

            virtual void update(Dimention deltaTime);
            virtual void draw(Renderer*,Camera*);

            std::unordered_map<uint64,Object2DEncoderDef> encoders;
            BasicDefinitions<Object2DConstructor> objects;

            void registry_object(Object2DConstructor,Object2DEncoderDef);

            ObjectsManager2D(GameBase* game):game(game),objects(){}
    };
} // namespace KLSE

#endif