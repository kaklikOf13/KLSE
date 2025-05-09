#ifndef KLSE_DEFAULT_LIB_HPP
#define KLSE_DEFAULT_LIB_HPP
#include "types.hpp"
namespace KLSE
{
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

            Array<T> operator+(const Array<T>& other)const;
            Array<T>& operator+=(const Array<T>& other);

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
            string(const string& other);
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

            string operator+(const string& other)const;
            string& operator+=(const string& other);
        };
        string operator+(const string& left, const char* right);
        string operator+(const char* left,const string& right);
    } // namespace STD
} // namespace 
#endif