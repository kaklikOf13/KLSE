import { ID } from "../utils/_utils.ts";
import { BaseGameObject2D, DefaultEvents, DefaultEventsMap2D, Game2D } from "../utils/game.ts";
import { GameObjectManager2D } from "../utils/gameObject.ts";
import { ObjectsPacket, PacketsManager } from "../utils/packets.ts";
import { Client, ClientsManager } from "./websockets.ts";

export abstract class ServerGame2D<DefaultGameObject extends BaseGameObject2D=BaseGameObject2D,Events extends DefaultEvents = DefaultEvents, Map extends DefaultEventsMap2D = DefaultEventsMap2D> extends Game2D<DefaultGameObject,Events,Map>{
    public clients:ClientsManager
    public allowJoin:boolean
    public id:ID=1
    constructor(tps:number,id:ID,packetManager:PacketsManager,objects?:GameObjectManager2D<DefaultGameObject>){
        super(tps,objects)
        this.id=id
        this.allowJoin=true
        this.clients=new ClientsManager(this._handle.bind(this))
        this.clients.packets_manager=packetManager
    }
    private _handle(client:Client) {
        this.handleConnections(client)
    }
    abstract handleConnections(client:Client):void
    update(): void {
        Game2D.prototype.update.call(this)
        this.clients.emit(new ObjectsPacket(this.objects.stream))
    }
}