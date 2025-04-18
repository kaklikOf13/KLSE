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
#ifndef KLSE_MATERIALS_HPP
#define KLSE_MATERIALS_HPP
#include "models.hpp"
#include "renderer.hpp"
namespace KLSE{
    template<typename MaterialArg,typename FactoryArgs>class Material3D;
    template<typename MaterialArg,typename FactoryArgs>using Material3DExecutionFunction = void(*)(Material3D<MaterialArg,FactoryArgs>*,Window*,Model3D*, Camera3D*,const Transform3D& transform);
    using Material3DExecutionFunction2 = void(*)(void*,Window*,Model3D*, Camera3D*,const Transform3D& transform);
    template<typename MaterialArg,typename FactoryArgs>class Material3DFactory{
        public:
        Material3DExecutionFunction<MaterialArg,FactoryArgs> execute;
        FactoryArgs args;
        Material3D<MaterialArg,FactoryArgs>* createMaterial(MaterialArg arg){
            auto m=new Material3D<MaterialArg,FactoryArgs>(this,arg);
            return m;
        }
        Material3DFactory(Material3DExecutionFunction<MaterialArg,FactoryArgs> on_execute,FactoryArgs args):execute(on_execute),args(args){}
    };
    template<typename MaterialArg,typename FactoryArgs> class Material3D{
        public:
        Material3DFactory<MaterialArg,FactoryArgs>* factory;
        MaterialArg args;
        Material3D(Material3DFactory<MaterialArg,FactoryArgs>* factory, MaterialArg arg):factory(factory),args(arg){};
    };
    
    template<typename MaterialArg,typename FactoryArgs>class Material2D;
    template<typename MaterialArg,typename FactoryArgs>using Material2DExecutionFunction = void(*)(Material2D<MaterialArg,FactoryArgs>*,Window*,Model2D* model, Camera2D*,const Transform2D& transform);

    using Material2DExecutionFunction2 = void(*)(void*,Window*,Model2D*, Camera2D*,const Transform2D&);
    template<typename MaterialArg,typename FactoryArgs>class Material2DFactory{
        public:
        Material2DExecutionFunction<MaterialArg,FactoryArgs> execute;
        FactoryArgs args;
        Material2D<MaterialArg,FactoryArgs>* createMaterial(MaterialArg arg){
            auto m=new Material2D<MaterialArg,FactoryArgs>(this,arg);
            return m;
        }
        Material2DFactory(Material2DExecutionFunction<MaterialArg,FactoryArgs> on_execute,FactoryArgs args):execute(on_execute),args(args){}
    };
    template<typename MaterialArg,typename FactoryArgs> class Material2D{
        public:
        Material2DFactory<MaterialArg,FactoryArgs>* factory;
        MaterialArg args;
        Material2D(Material2DFactory<MaterialArg,FactoryArgs>* factory, MaterialArg arg):factory(factory),args(arg){};
    };
}
#endif