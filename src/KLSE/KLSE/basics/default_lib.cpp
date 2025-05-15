#include <KLSE/KLSE/basics/default_lib.hpp>
namespace KLSE
{
    namespace STD
    {
        #pragma region Array
        template<typename T>
        Array<T> Array<T>::pre_alloc(uint64 a) {
            Array<T> arr;
            arr.alloc = a;
            arr.length = 0;
            arr.value = new T[a];
            return arr;
        }
        template<typename T>
        T& Array<T>::operator[](int index)const{
            return value[index];
        }
        template<typename T>
        Array<T> Array<T>::operator[](ArrayRange index)const{
            Array<T> result = pre_alloc(index.size);
            if (index.start + index.size > length) {
                index.size = (index.start < length) ? (length - index.start) : 0;
            }
            for (uint64 i = 0; i < index.size; i++) {
                result.push(value[index.start + i]);
            }
            return result;
        }
        template<typename T>
        Array<T> Array<T>::operator+(const Array<T>& other)const{
            Array<T> result = pre_alloc(length + other.length);
            for (uint64 i = 0; i < length; i++) {
                result.push(value[i]);
            }
            for (uint64 i = 0; i < other.length; i++) {
                result.push(other.value[i]);
            }
            return result;
        }
        template<typename T>
        Array<T>& Array<T>::operator+=(const Array<T>& other) {
            for (uint64 i = 0; i < other.length; i++) {
                push(other.value[i]);
            }
            return *this;
        }
        template<typename T>
        void Array<T>::push(T val) {
            if (length >= alloc) {
                uint64 new_alloc = alloc == 0 ? 4 : alloc * 2;
                T* new_value = new T[new_alloc];
                for (uint64 i = 0; i < length; i++) {
                    new_value[i] = value[i];
                }
                if (value) free(value);
                value = new_value;
                alloc = new_alloc;
            }
            value[length++] = val;
        }
        template<typename T>
        void Array<T>::splice(uint64 index, uint64 count) {
            if (index >= length) return;
            if (index + count > length) count = length - index;
            for (uint64 i = index + count; i < length; i++) {
                value[i - count] = value[i];
            }
            length -= count;
        }
        template<typename T>
        bool Array<T>::contains(T& val)const{
            for(uint64 i=0;i<length;i++){
                if(val==value[i])return true;
            }
            return false;
        }
        #pragma endregion

        #pragma region STRING
        char& string::operator[](uint64 index)const{
            return value[index];
        }
        string::string(const char* str) {
            length = 0;
            while (str[length] != '\0') length++;
            alloc = length + 1;
            value = new char[alloc];
            for (uint64 i = 0; i < length; i++) {
                value[i] = str[i];
            }
            value[length] = '\0';
        }
        string::string(const char* str, uint64 size) {
            length = size;
            alloc = length + 1;
            value = new char[alloc];
            for (uint64 i = 0; i < length; i++) {
                value[i] = str[i];
            }
            value[length] = '\0';
        }
        const char* string::c_str()const{
            if (value == nullptr) return "";
            value[length] = '\0';
            return value;
        }
        uint64 string::hash()const{
            uint64 hash = 14695981039346656037ULL; // offset basis (FNV-1a 64-bit)
            for (uint64 i = 0; i < length; i++) {
                hash ^= (uint64)(unsigned char)value[i];
                hash *= 1099511628211ULL; // prime (FNV 64-bit)
            }
            return hash;
        }
        bool string::contains(const string& str)const{
            if (!value || !str.value) return false;

            if (str.length == 0 || str.length > length) return false;

            for (uint64 i = 0; i <= length - str.length; i++) {
                bool match = true;
                for (uint64 j = 0; j < str.length; j++) {
                    if (value[i + j] != str.value[j]) {
                        match = false;
                        break;
                    }
                }
                if (match) return true;
            }

            return false;
        }
        string::string(const string& other) {
            length = other.length;
            alloc = length + 1;
            value = new char[alloc];
            for (uint64 i = 0; i < alloc; i++) {
                value[i] = other.value[i];
            }
        }

        string string::operator+(const string& other) const {
            string result = string::pre_alloc(length + other.length + 1);
            result.length = length + other.length;
        
            for (uint64 i = 0; i < length; i++) result.value[i] = value[i];
            for (uint64 i = 0; i < other.length; i++) result.value[length + i] = other.value[i];
        
            result.value[result.length] = '\0';
            return result;
        }
        string& string::operator+=(const string& other){
            uint64 newLength = length + other.length;
            char* newValue = new char[newLength + 1];
        
            for (uint64 i = 0; i < length; i++) newValue[i] = value[i];
            for (uint64 i = 0; i < other.length; i++) newValue[length + i] = other.value[i];
            newValue[newLength] = '\0';
        
            delete[] value;
            value = newValue;
            length = newLength;
            alloc = newLength + 1;
            return *this;
        }
        string string::pre_alloc(uint64 alloc){
            string str;
            str.alloc = alloc;
            str.length = 0;
            str.value = new char[alloc];
            str.value[0] = '\0';
            return str;
        }

        string operator+(const string& left, const char* right) {
            return left + string(right);
        }
        string operator+(const char* left, const string& right) {
            return string(left) + right;
        }
        #pragma region Conversions
        uint64 string::itoa_base(char* buffer, long long value, uint64 base, bool is_unsigned) {
            char temp[32];
            const char* digits = "0123456789abcdef";
            uint64 i = 0;
        
            bool negative = false;
            if (!is_unsigned && value < 0) {
                negative = true;
                value = -value;
            }
        
            do {
                temp[i++] = digits[value % base];
                value /= base;
            } while (value);
        
            if (negative)
                temp[i++] = '-';
        
            // reverse into buffer
            for (uint64 j = 0; j < i; j++) {
                buffer[j] = temp[i - j - 1];
            }
            buffer[i] = 0;
            return i;
        }
        uint64 string::ftoa(char* buffer, double value) {
            long long inteiro = (long long)value;
            double resto = value - (double)inteiro;
            uint64 len = itoa_base(buffer, inteiro, 10, false);
        
            buffer[len++] = '.';
        
            for (int i = 0; i < 6; i++) {
                resto *= 10.0;
                int digito = (int)resto;
                buffer[len++] = '0' + digito;
                resto -= digito;
            }
        
            buffer[len] = 0;
            return len;
        }
        #pragma endregion
        #pragma region Numbers_Conversion
        string::string(int val) {
            char temp[64];
            length = itoa_base(temp, val, 10);
            alloc = length + 1;
            value = new char[alloc];
            for (uint64 i = 0; i < alloc; i++) value[i] = temp[i];
        }
        
        string::string(unsigned int val) {
            char temp[64];
            length = itoa_base(temp, val, 10, true);
            alloc = length + 1;
            value = new char[alloc];
            for (uint64 i = 0; i < alloc; i++) value[i] = temp[i];
        }
        
        string::string(short int val) : string((int)val) {}
        string::string(unsigned short int val) : string((unsigned int)val) {}
        
        string::string(long long int val) {
            char temp[64];
            length = itoa_base(temp, val, 10);
            alloc = length + 1;
            value = new char[alloc];
            for (uint64 i = 0; i < alloc; i++) value[i] = temp[i];
        }
        
        string::string(long long unsigned int val) {
            char temp[64];
            length = itoa_base(temp, val, 10, true);
            alloc = length + 1;
            value = new char[alloc];
            for (uint64 i = 0; i < alloc; i++) value[i] = temp[i];
        }
        
        string::string(float val) : string((double)val) {}
        
        string::string(double val) {
            char temp[128];
            length = ftoa(temp, val);
            alloc = length + 1;
            value = new char[alloc];
            for (uint64 i = 0; i < alloc; i++) value[i] = temp[i];
        }
        #pragma endregion
        #pragma endregion
    } // namespace STD
    namespace Dynamic
    {
        bool NumberType::operator==(Value* other){
            return other->value_type==nullptr&&reinterpret_cast<Type*>(other)->kind==Kind::number&&reinterpret_cast<NumberType*>(other)->bytes==this->bytes&&reinterpret_cast<NumberType*>(other)->is_unsigned==this->is_unsigned;
        }

        /*Type* Int8;
        Type* Int16;
        Type* Int32;
        Type* Int64;

        Type* UInt8;
        Type* UInt16;
        Type* UInt32;
        Type* UInt64;*/
        /*class int8t:public Value{
            int8t(NumberType* tp):Value(tp){}
            Value* operator+(Value* other){
                if(this->o)
            }
        };*/
        void Init(){
            //operator
        }
    } // namespace Dynamic
    
} // namespace KLSE
