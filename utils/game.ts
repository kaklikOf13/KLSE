import { Clock } from "./_utils.ts"
import { BaseObject2D, GameObjectManager2D } from "./gameObject.ts"
export enum DefaultEvents{
    GameTick="game-tick",
    GameRun="game-run"
}
export interface DefaultEventsMap{
    [DefaultEvents.GameRun]:Game
    [DefaultEvents.GameTick]:Game
}
export abstract class GamePlugin<Events extends DefaultEvents,Map extends DefaultEventsMap>{
    game:Game
    constructor(game:Game){
        this.game=game
    }
    abstract init_signals():void
    on<Ev extends Events>(signal: Ev, cb?: (data: Map[Ev]) => void){
        this.game.events.on(signal,cb)
    }
}
export type EventHandlers<Events extends DefaultEvents=DefaultEvents,EventDataMap extends DefaultEventsMap=DefaultEventsMap>=Record<Events|DefaultEvents,Array<(data: EventDataMap[Events]) => void>>
export class EventsManager<Events extends DefaultEvents,Map extends DefaultEventsMap> {
    signals:Partial<EventHandlers<Events,Map>>

    constructor() {
        this.signals={}
    }

    on<Ev extends Events>(signal: Ev|DefaultEvents, cb?: (data: Map[Ev]) => void): void {
        ((this.signals[signal] as Set<typeof cb> | undefined) ??= new Set()).add(cb);
    }

    off<Ev extends Events>(eventType: Ev|DefaultEvents, cb?: (data: Map[Ev]) => void): void {
        if (!cb) {
            delete this.signals[eventType];
            return;
        }

        (this.signals[eventType] as Set<typeof cb> | undefined)?.delete(cb);
    }

    emit<Ev extends Events>(eventType: Ev|DefaultEvents, data: Map[Ev]): void {
        for (const cb of this.signals[eventType]||[]) {
            if(cb){
                cb(data)
            }
        }
    }

    clear(eventType: Events): void {
        this.signals[eventType]=[]
    }
    clearAll(): void {
        this.signals={}
    }
}
export abstract class BaseGameObject2D extends BaseObject2D{
    public game!:Game
    constructor(){
        super()
    }
}
export abstract class Game<Events extends DefaultEvents=DefaultEvents,Map extends DefaultEventsMap=DefaultEventsMap,DefaultGameObject extends BaseGameObject2D=BaseGameObject2D>{
    readonly tps:number

    private readonly clock:Clock
    running:boolean=true
    readonly events:EventsManager<Events,Map>
    readonly objects:GameObjectManager2D<DefaultGameObject>

    constructor(tps: number,objects:GameObjectManager2D<DefaultGameObject>=new GameObjectManager2D(32)){
        this.tps=tps
        this.events=new EventsManager()
        this.clock=new Clock(tps,1)
        this.objects=objects
        this.objects.add_object=(obj: DefaultGameObject, category: string, id?: number | undefined)=>{
            obj.game=this
            GameObjectManager2D.prototype.add_object.call(this.objects,obj,category,id)
        }
    }
    add_plugin(plugin:GamePlugin<Events,Map>){
        plugin.game=this
        plugin.init_signals()
    }
    clear_plugins(){
        this.events.clearAll()
    }
    update() {
        GameObjectManager2D.prototype.update.call(this)
        this.on_update()
        this.events.emit(DefaultEvents.GameTick,this)
        this.clock.tick(this.update.bind(this))
    }
    abstract on_update():void
    abstract on_run():void
    mainloop(){
        // Start
        this.on_run()
        this.events.emit(DefaultEvents.GameRun,this)
        // Mainloop
        this.update()
    }
}