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
#ifndef KLSE_OTHERS_DEFINITIONS_HPP
#define KLSE_OTHERS_DEFINITIONS_HPP
#pragma once
#include <string>
#include <iostream>
#include "utils.hpp"
namespace KLSE
{

    template <typename TP>
    class BasicDefinitions {
        public:
        std::unordered_map<STD::string,TP> value_string;
        std::unordered_map<uint32,TP> value_number;
        std::map<STD::string,uint32> number_keys;
        std::map<uint32,STD::string> string_keys;

        void registry(STD::string id_string,uint32 id_number,TP val);

        void unregistry(STD::string id_string);
        void unregistry(uint32 id_number);

        TP& operator[](STD::string id);
        TP& operator[](uint32 id);

        TP& get(STD::string id);
        TP& get(uint32 id);

        BasicDefinitions(){};
    };
} // namespace KLSE

#endif