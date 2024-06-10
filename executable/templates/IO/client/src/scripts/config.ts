export class Server{
    IP:string
    Port:number
    HTTP:boolean
    constructor(IP:string,Port:number,HTTP:boolean=false){
        this.IP=IP
        this.Port=Port
        this.HTTP=HTTP
    }
    toString():string{
        return `${this.HTTP ? "s" : ""}://${this.IP}:${this.Port}`
    }
}