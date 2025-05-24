#include "KLSE/KLSE/net/socket.hpp"

namespace KLSE
{
    Socket* OfflineSocket::ConnectTo(OfflineServer* server){
        OfflineSocket* client_sock=new OfflineSocket();
        client_sock->server=server;
        OfflineSocket* server_sock=new OfflineSocket();
        server_sock->server=server;

        server_sock->connection=client_sock;
        client_sock->connection=server_sock;

        server->sok=server_sock;
        return client_sock;
    }
    Socket* OfflineServer::accept(){
        if(sok){
            return sok;
        }
        return nullptr;
    }

    void OfflineServer::stop(){
        
    }
    Stream* OfflineSocket::recv(){
        auto stream=recev_stream;
        recev_stream->pointer=0;
        recev_stream=nullptr;
        return stream;
    }
    int OfflineSocket::send(Stream* stream){
        connection->recev_stream=stream->clone();
        return 0;
    }
    void OfflineSocket::close(){
        connection=nullptr;
    };
} // namespace KLSE
