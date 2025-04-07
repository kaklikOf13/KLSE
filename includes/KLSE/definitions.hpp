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
#ifndef KLSE_DEFINITIONS_HPP
#define KLSE_DEFINITIONS_HPP
#include <string>
#include <iostream>
#include "utils.hpp"
namespace KLSE
{
    template <typename TP>
    class Definition {
    private:
        struct Node {
            std::string key;
            uint32 id;
            TP value;
            Node* next;
        };

        static const uint32 TABLE_SIZE = 256;
        Node* table[TABLE_SIZE];
        Node* idTable[TABLE_SIZE];
        uint32 nextId = 1;

        uint32 hash(std::string key) {
            uint32 hash = 0;
            for (char c : key) {
                hash = (hash * 31) + c;
            }
            return hash % TABLE_SIZE;
        }

        uint32 hash(int id) {
            return id % TABLE_SIZE;
        }

    public:
        Definition() {
            for (int i = 0; i < TABLE_SIZE; i++) {
                table[i] = nullptr;
                idTable[i] = nullptr;
            }
        }

        ~Definition() {
            for (int i = 0; i < TABLE_SIZE; i++) {
                Node* current = table[i];
                while (current) {
                    Node* temp = current;
                    current = current->next;
                    delete temp;
                }
            }
        }

        int registry(std::string key, TP val) {
            int index = hash(key);
            Node* current = table[index];

            // Se a chave já existe, apenas atualiza o valor e retorna o ID
            while (current) {
                if (current->key == key) {
                    current->value = val;
                    return current->id;
                }
                current = current->next;
            }

            // Cria um novo nó com um ID único
            int newId = nextId++;
            Node* newNode = new Node{key, newId, val, table[index]};
            table[index] = newNode;

            // Armazena também no hash de IDs
            int idIndex = hash(newId);
            newNode->next = idTable[idIndex];
            idTable[idIndex] = newNode;

            return newId;
        }

        void unregistry(std::string key) {
            int index = hash(key);
            Node* current = table[index];
            Node* prev = nullptr;

            while (current) {
                if (current->key == key) {
                    // Remove da tabela de string
                    if (prev) {
                        prev->next = current->next;
                    } else {
                        table[index] = current->next;
                    }

                    // Remove da tabela de ID
                    int idIndex = hash(current->id);
                    Node* idCurrent = idTable[idIndex];
                    Node* idPrev = nullptr;
                    while (idCurrent) {
                        if (idCurrent == current) {
                            if (idPrev) {
                                idPrev->next = idCurrent->next;
                            } else {
                                idTable[idIndex] = idCurrent->next;
                            }
                            break;
                        }
                        idPrev = idCurrent;
                        idCurrent = idCurrent->next;
                    }

                    delete current;
                    return;
                }
                prev = current;
                current = current->next;
            }
        }

        void unregistry(int id) {
            int index = hash(id);
            Node* current = idTable[index];
            Node* prev = nullptr;

            while (current) {
                if (current->id == id) {
                    // Remove da tabela de ID
                    if (prev) {
                        prev->next = current->next;
                    } else {
                        idTable[index] = current->next;
                    }

                    // Remove da tabela de string
                    int strIndex = hash(current->key);
                    Node* strCurrent = table[strIndex];
                    Node* strPrev = nullptr;
                    while (strCurrent) {
                        if (strCurrent == current) {
                            if (strPrev) {
                                strPrev->next = strCurrent->next;
                            } else {
                                table[strIndex] = strCurrent->next;
                            }
                            break;
                        }
                        strPrev = strCurrent;
                        strCurrent = strCurrent->next;
                    }

                    delete current;
                    return;
                }
                prev = current;
                current = current->next;
            }
        }

        TP* get(std::string key) {
            int index = hash(key);
            Node* current = table[index];

            while (current) {
                if (current->key == key) {
                    return &current->value;
                }
                current = current->next;
            }

            return nullptr;
        }

        TP* get(int id) {
            int index = hash(id);
            Node* current = idTable[index];

            while (current) {
                if (current->id == id) {
                    return &current->value;
                }
                current = current->next;
            }

            return nullptr;
        }

        void print() {
            for (int i = 0; i < TABLE_SIZE; i++) {
                Node* current = table[i];
                while (current) {
                    std::cout << "[ID " << current->id << "] " << current->key << ": " << current->value << std::endl;
                    current = current->next;
                }
            }
        }
    };

} // namespace KLSE

#endif