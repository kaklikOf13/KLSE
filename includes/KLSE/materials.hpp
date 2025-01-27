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
}
#endif