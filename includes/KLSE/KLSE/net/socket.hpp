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
#ifndef KLSE_NET_SOCKET_HPP
#define KLSE_NET_SOCKET_HPP
#include "stream.hpp"
#include "../basics/types.hpp"
namespace KLSE
{
    class Socket{
        public:
        uint64 id;
        Socket(uint64 id):id(id){};
        ~Socket()=default;

        virtual Stream* recv()=0;
        virtual int send(Stream*)=0;
        virtual void close()=0;
    };
    class SocketServer{
        public:
        SocketServer(){};
        virtual Socket* accept()=0;
        virtual void stop()=0;
    };

    class OfflineServer:public SocketServer{
        public:
        Socket* sok;
        OfflineServer():SocketServer(){};
        Socket* accept()override;
        void stop()override;
    };
    class OfflineSocket:public Socket{
        public:
        OfflineServer* server;
        OfflineSocket* connection;
        OfflineSocket():Socket(0){};
        static Socket* ConnectTo(OfflineServer*);
        ~OfflineSocket()=default;

        Stream* recv()override;
        int send(Stream*)override;
        void close()override;
        protected:
        Stream* recev_stream;
    };
} // namespace KLSE
#endif