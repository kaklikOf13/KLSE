import { Clock } from "./_utils.ts"
import { BaseObject2D, BaseObject3D, GameObjectManager2D, GameObjectManager3D } from "./gameObject.ts"
export enum DefaultEvents{
    GameTick="game-tick",
    GameRun="game-run"
}
export interface DefaultEventsMap2D{
    // deno-lint-ignore no-explicit-any
    [DefaultEvents.GameRun]:Game2D<any,any,any>
    // deno-lint-ignore no-explicit-any
    [DefaultEvents.GameTick]:Game2D<any,any,any>
}
export abstract class Game2DPlugin<Events extends DefaultEvents,Map extends DefaultEventsMap2D>{
    // deno-lint-ignore no-explicit-any
    public game!:Game2D<any,any,any>
    // deno-lint-ignore no-explicit-any
    constructor(game:Game2D<any,any,any>){
        this.game=game
    }
    abstract init_signals():void
    on<Ev extends Events>(signal: Ev, cb?: (data: Map[Ev]) => void){
        this.game.events.on(signal,cb)
    }
}
export interface DefaultEventsMap3D{
    // deno-lint-ignore no-explicit-any
    [DefaultEvents.GameRun]:Game3D<any,any,any>
    // deno-lint-ignore no-explicit-any
    [DefaultEvents.GameTick]:Game3D<any,any,any>
}
export abstract class Game3DPlugin<Events extends DefaultEvents,Map extends DefaultEventsMap3D>{
    // deno-lint-ignore no-explicit-any
    public game!:Game3D<any,any,any>
    // deno-lint-ignore no-explicit-any
    constructor(game:Game3D<any,any,any>){
        this.game=game
    }
    abstract init_signals():void
    on<Ev extends Events>(signal: Ev, cb?: (data: Map[Ev]) => void){
        this.game.events.on(signal,cb)
    }
}
export type EventHandlers<Events extends DefaultEvents=DefaultEvents,EventDataMap extends DefaultEventsMap2D|DefaultEventsMap3D=DefaultEventsMap2D>=Record<Events|DefaultEvents,Array<(data: EventDataMap[Events]) => void>>
export class EventsManager<Events extends DefaultEvents,Map extends DefaultEventsMap2D|DefaultEventsMap3D> {
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
    // deno-lint-ignore no-explicit-any
    public game!:Game2D<any,any,any>
    constructor(){
        super()
    }
}
export abstract class BaseGameObject3D extends BaseObject3D{
    // deno-lint-ignore no-explicit-any
    public game!:Game3D<any,any,any>
    constructor(){
        super()
    }
}
export abstract class Game2D<DefaultGameObject extends BaseGameObject2D=BaseGameObject2D,Events extends DefaultEvents=DefaultEvents,Map extends DefaultEventsMap2D=DefaultEventsMap2D>{
    readonly tps:number

    private readonly clock:Clock
    running:boolean=true
    readonly events:EventsManager<Events,Map>
    readonly objects:GameObjectManager2D<DefaultGameObject>

    constructor(tps: number,objects?:GameObjectManager2D<DefaultGameObject>){
        this.tps=tps
        this.events=new EventsManager()
        this.clock=new Clock(tps,1)
        this.objects=objects??new GameObjectManager2D(32)
        this.objects.add_object=(obj: DefaultGameObject, category: string, id?: number | undefined)=>{
            GameObjectManager2D.prototype.add_object.call(this.objects,obj,category,id)
        }
    }
    add_plugin(plugin:Game2DPlugin<Events,Map>){
        plugin.game=this
        plugin.init_signals()
    }
    clear_plugins(){
        this.events.clearAll()
    }
    update() {
        this.objects.update()
        this.on_update()
        this.events.emit(DefaultEvents.GameTick,this)
        this.clock.tick(this.update.bind(this))
    }
    on_update():void{}
    on_run():void{}
    mainloop(){
        // Start
        this.on_run()
        this.events.emit(DefaultEvents.GameRun,this)
        // Mainloop
        this.update()
    }
}
export abstract class Game3D<DefaultGameObject extends BaseGameObject3D=BaseGameObject3D,Events extends DefaultEvents=DefaultEvents,Map extends DefaultEventsMap3D=DefaultEventsMap3D>{
    readonly tps:number

    private readonly clock:Clock
    running:boolean=true
    readonly events:EventsManager<Events,Map>
    readonly objects:GameObjectManager3D<DefaultGameObject>

    constructor(tps: number,objects?:GameObjectManager3D<DefaultGameObject>){
        this.tps=tps
        this.events=new EventsManager()
        this.clock=new Clock(tps,1)
        this.objects=objects??new GameObjectManager3D(32)
        this.objects.add_object=(obj: DefaultGameObject, category: string, id?: number | undefined)=>{
            GameObjectManager2D.prototype.add_object.call(this.objects,obj,category,id)
        }
    }
    add_plugin(plugin:Game3DPlugin<Events,Map>){
        plugin.game=this
        plugin.init_signals()
    }
    clear_plugins(){
        this.events.clearAll()
    }
    update() {
        this.objects.update()
        this.on_update()
        this.events.emit(DefaultEvents.GameTick,this)
        this.clock.tick(this.update.bind(this))
    }
    on_update():void{}
    on_run():void{}
    mainloop(){
        // Start
        this.on_run()
        this.events.emit(DefaultEvents.GameRun,this)
        // Mainloop
        this.update()
    }
}