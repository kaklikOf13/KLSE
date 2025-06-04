#include "KLSE/KLSE/others/definitions.hpp"
namespace KLSE
{
    template <typename TP>
    void BasicDefinitions<TP>::registry(STD::string id_string,uint32 id_number,TP val){
        value_string[id_string]=val;
        value_number[id_number]=val;
        number_keys[id_string]=id_number;
        string_keys[id_number]=id_string;
    }
    template <typename TP>
    void BasicDefinitions<TP>::unregistry(STD::string id_string){
        uint32 id_number=number_keys[id_string];
        value_string.erase(id_string);
        value_number.erase(id_number);
        number_keys.erase(id_string);
        string_keys.erase(id_number);
    }
    template <typename TP>
    void BasicDefinitions<TP>::unregistry(uint32 id_number){
        STD::string id_string=string_keys[id_number];
        value_string.erase(id_string);
        value_number.erase(id_number);
        number_keys.erase(id_string);
        string_keys.erase(id_number);
    }
    template <typename TP>
    TP& BasicDefinitions<TP>::operator[](STD::string id){
        return value_string[id];
    }
    template <typename TP>
    TP& BasicDefinitions<TP>::operator[](uint32 id){
        return value_number[id];
    }
    template <typename TP>
    TP& BasicDefinitions<TP>::get(STD::string id){
        return value_string[id];
    }
    template <typename TP>
    TP& BasicDefinitions<TP>::get(uint32 id){
        return value_number[id];
    }
} // namespace KLSE
