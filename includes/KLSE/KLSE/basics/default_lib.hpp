#ifndef KLSE_DEFAULT_LIB_HPP
#define KLSE_DEFAULT_LIB_HPP
#include "types.hpp"
#include <iostream>
#include <unordered_map>
namespace KLSE
{
    
    namespace Dynamic
    {
        class Type;
        class Value{
            public:
            Type* value_type;
            Value(Type* tp):value_type(tp){};

            virtual bool operator==(Value*)=0;

            virtual bool operator>(Value*)=0;
            virtual bool operator>=(Value*)=0;
            virtual bool operator<(Value*)=0;
            virtual bool operator<=(Value*)=0;

            virtual Value* operator+(Value*)=0;
            virtual Value* operator-(Value*)=0;
            virtual Value* operator*(Value*)=0;
            virtual Value* operator/(Value*)=0;
            virtual Value* operator+=(Value*)=0;
            virtual Value* operator-=(Value*)=0;
            virtual Value* operator*=(Value*)=0;
            virtual Value* operator/=(Value*)=0;
        };
        enum Kind{
            number,
            object,
            array,
            string
        };
        class Type:public Value{
            public:
            Kind kind;
            Type(Kind kind):Value(nullptr),kind(kind){}
            virtual bool convertible(Type*)=0;
            virtual Value* convert(Value*)=0;
        };
        class NumberType:public Type{
            public:
            bool is_unsigned;
            uint8 bytes;
            NumberType(bool is_unsigned,uint8 bytes):Type(Kind::number),is_unsigned(is_unsigned),bytes(bytes){};

            bool operator==(Value*)override;

            Value* instantiate(int64){return nullptr;};
        };
        void Init();

        extern Type* Int8;
        extern Type* Int16;
        extern Type* Int32;
        extern Type* Int64;

        extern Type* UInt8;
        extern Type* UInt16;
        extern Type* UInt32;
        extern Type* UInt64;
    } // namespace Dynamic
    namespace STD
    {
        struct ArrayRange{
            uint64 start;
            uint64 size;
        };
        template<typename T>
        class Array{
            public:
            uint64 length;
            uint64 alloc;
            T* value;
            Array():length(0),alloc(0),value(0){}

            static Array<T> pre_alloc(uint64 alloc);
            ~Array(){
                if(value){
                    delete[] value;
                }
            }

            T& operator[](int index)const;

            Array<T> operator[](ArrayRange index)const;

            Array<T> operator+(const Array<T>&)const;
            Array<T>& operator+=(const Array<T>&);

            void push(T);
            void splice(uint64 index,uint64 count);

            bool contains(T& val)const;
        };
        class string{
            public:
            char* value;
            uint64 length;
            uint64 alloc;
            string():value(nullptr),length(0),alloc(0){}
            static string pre_alloc(uint64 alloc);
            string(const string&);
            string(const char*);
            string(const char*, uint64 size);

            string(int);
            string(unsigned int);

            string(long long int);
            string(long long unsigned int);

            string(short int);
            string(unsigned short int);

            string(float);
            string(double);

            static uint64 itoa_base(char* buffer, long long value, uint64 base, bool is_unsigned = false);

            static uint64 ftoa(char* buffer, double value);

            const char* c_str()const;
            ~string(){
                if(value){
                    delete[] value;
                }
            }
            uint64 hash()const;
            char& operator[](uint64 index)const;
            bool contains(const string& str)const;

            string operator+(const string&)const;
            string& operator+=(const string&);
        };
        string operator+(const string& left, const char* right);
        string operator+(const char* left,const string& right);
    } // namespace STD
} // namespace
namespace std {
    template<>
    struct hash <KLSE::STD::string> {
        size_t operator()(const KLSE::STD::string& s) const noexcept {
            return s.hash();
        }
    };
}
#endif