import { Clock, getEnumValues } from "./_utils.ts"
import { DefaultGameDefs, DefaultGameDefsMap, Definitions, GameDefs, NewGameDef } from "./definitions.ts";
import { BaseObject2D, BaseObject3D, type CellsManager2D, GameObjectManager2D, GameObjectManager3D, CellsManager3D } from "./gameObject.ts"
import { type Vec2, type Vec3 } from "./geometry.ts";
export enum DefaultEvents{
    GameTick="game-tick",
    GameRun="game-run"
}
export interface DefaultEventsMap2D{
    // deno-lint-ignore no-explicit-any
    [DefaultEvents.GameRun]:Game2D<any,any,any,any>
    // deno-lint-ignore no-explicit-any
    [DefaultEvents.GameTick]:Game2D<any,any,any,any>
}
export abstract class Game2DPlugin<Events extends DefaultEvents,Map extends DefaultEventsMap2D>{
    // deno-lint-ignore no-explicit-any
    public game!:Game2D<any,any,any,any>
    // deno-lint-ignore no-explicit-any
    constructor(game:Game2D<any,any,any,any>){
        this.game=game
    }
    abstract init_signals():void
    on<Ev extends Events>(signal: Ev, cb?: (data: Map[Ev]) => void){
        this.game.events.on(signal,cb)
    }
}
export interface DefaultEventsMap3D{
    // deno-lint-ignore no-explicit-any
    [DefaultEvents.GameRun]:Game3D<any,any,any,any>
    // deno-lint-ignore no-explicit-any
    [DefaultEvents.GameTick]:Game3D<any,any,any,any>
}
export abstract class Game3DPlugin<Events extends DefaultEvents,Map extends DefaultEventsMap3D>{
    // deno-lint-ignore no-explicit-any
    public game!:Game3D<any,any,any,any>
    // deno-lint-ignore no-explicit-any
    constructor(game:Game3D<any,any,any,any>){
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
export interface Scene{
    cellsSize?:number
    Objects:Record<string,Array<{
        type:string,
        position?:Vec2|Vec3
        // deno-lint-ignore no-explicit-any
        vals?:Record<string,any>
    }>>
}
export class Scene2DInstance<DefaultGameObject extends BaseGameObject2D=BaseGameObject2D,Events extends DefaultEvents=DefaultEvents,Map extends DefaultEventsMap2D=DefaultEventsMap2D,Defs extends DefaultGameDefs=DefaultGameDefs, DefsMap extends DefaultGameDefsMap=DefaultGameDefsMap>{
    readonly scene:Scene
    readonly objects:GameObjectManager2D<DefaultGameObject>
    readonly cells:CellsManager2D<DefaultGameObject>
    readonly game:Game2D<DefaultGameObject,Events,Map,Defs,DefsMap>
    constructor(scene:Scene,game:Game2D<DefaultGameObject,Events,Map,Defs,DefsMap>){
        this.scene=scene
        this.objects=new GameObjectManager2D<DefaultGameObject>(scene.cellsSize)
        this.cells=this.objects.cells
        this.game=game
        this.reset()
    }
    reset(){
        this.objects.clear()
        for(const c in this.scene.Objects){
            this.objects.add_category(c)
            for(const o of this.scene.Objects[c]){
                // deno-lint-ignore ban-ts-comment
                //@ts-expect-error
                this.objects.add_object(new ((this.game.definitions[DefaultGameDefs.Objects]as Definitions<(new()=>BaseGameObject2D|BaseGameObject3D)>).get(o.type))() as DefaultGameObject,c,undefined,o.vals)
            }
        }
    }
    asyncReset():Promise<void>{
        return new Promise<void>((resolve)=>{
            resolve(this.reset())
        })
    }
}
export class Scene3DInstance<DefaultGameObject extends BaseGameObject3D=BaseGameObject3D,Events extends DefaultEvents=DefaultEvents,Map extends DefaultEventsMap3D=DefaultEventsMap3D,Defs extends DefaultGameDefs=DefaultGameDefs, DefsMap extends DefaultGameDefsMap=DefaultGameDefsMap>{
    readonly scene:Scene
    readonly objects:GameObjectManager3D<DefaultGameObject>
    readonly cells:CellsManager3D<DefaultGameObject>
    readonly game:Game3D<DefaultGameObject,Events,Map,Defs,DefsMap>
    constructor(scene:Scene,game:Game3D<DefaultGameObject,Events,Map,Defs,DefsMap>){
        this.scene=scene
        this.objects=new GameObjectManager3D<DefaultGameObject>(scene.cellsSize)
        this.cells=this.objects.cells
        this.game=game
        this.reset()
    }
    reset(){
        this.objects.clear()
        for(const c in this.scene.Objects){
            this.objects.add_category(c)
            for(const o of this.scene.Objects[c]){
                // deno-lint-ignore ban-ts-comment
                //@ts-expect-error
                this.objects.add_object(new ((this.game.definitions[DefaultGameDefs.Objects]as Definitions<(new()=>BaseGameObject2D|BaseGameObject3D)>).get(o.type))() as DefaultGameObject,c,undefined,o.vals)
            }
        }
    }
    asyncReset():Promise<void>{
        return new Promise<void>((resolve)=>{
            resolve(this.reset())
        })
    }
}
export abstract class Game2D<DefaultGameObject extends BaseGameObject2D=BaseGameObject2D,Events extends DefaultEvents=DefaultEvents,Map extends DefaultEventsMap2D=DefaultEventsMap2D,Defs extends DefaultGameDefs=DefaultGameDefs, DefsMap extends DefaultGameDefsMap=DefaultGameDefsMap>{
    readonly tps:number

    private readonly clock:Clock
    running:boolean=true
    readonly events:EventsManager<Events,Map>
    readonly scene:Scene2DInstance<DefaultGameObject,Events,Map,Defs,DefsMap>
    definitions:GameDefs<Defs,DefsMap>
    constructor(tps: number,scene?:Scene2DInstance<DefaultGameObject>,defs:GameDefs<Defs,DefsMap>=NewGameDef<Defs,DefsMap>(getEnumValues(DefaultGameDefs) as Defs[])){
        this.tps=tps
        this.events=new EventsManager()
        this.clock=new Clock(tps,1)
        this.definitions=defs
        this.scene=scene??new Scene2DInstance<DefaultGameObject,Events,Map,Defs,DefsMap>({Objects:{}},this)
    }
    add_plugin(plugin:Game2DPlugin<Events,Map>){
        plugin.game=this
        plugin.init_signals()
    }
    clear_plugins(){
        this.events.clearAll()
    }
    update() {
        this.scene.objects.update()
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
    instantiate(scene:Scene):Scene2DInstance<DefaultGameObject,Events,Map,Defs,DefsMap>{
        return new Scene2DInstance<DefaultGameObject,Events,Map,Defs,DefsMap>(scene,this)
    }
}
export abstract class Game3D<DefaultGameObject extends BaseGameObject3D=BaseGameObject3D,Events extends DefaultEvents=DefaultEvents,Map extends DefaultEventsMap3D=DefaultEventsMap3D,Defs extends DefaultGameDefs=DefaultGameDefs, DefsMap extends DefaultGameDefsMap=DefaultGameDefsMap>{
    readonly tps:number

    private readonly clock:Clock
    running:boolean=true
    readonly events:EventsManager<Events,Map>
    readonly scene:Scene3DInstance<DefaultGameObject,Events,Map,Defs,DefsMap>
    definitions:GameDefs<Defs,DefsMap>
    constructor(tps: number,scene?:Scene3DInstance<DefaultGameObject>,defs:GameDefs<Defs,DefsMap>=NewGameDef<Defs,DefsMap>(getEnumValues(DefaultGameDefs) as Defs[])){
        this.tps=tps
        this.events=new EventsManager()
        this.clock=new Clock(tps,1)
        this.definitions=defs
        this.scene=scene??new Scene3DInstance<DefaultGameObject,Events,Map,Defs,DefsMap>({Objects:{}},this)
    }
    add_plugin(plugin:Game3DPlugin<Events,Map>){
        plugin.game=this
        plugin.init_signals()
    }
    clear_plugins(){
        this.events.clearAll()
    }
    update() {
        this.scene.objects.update()
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
    instantiate(scene:Scene):Scene3DInstance<DefaultGameObject,Events,Map,Defs,DefsMap>{
        return new Scene3DInstance<DefaultGameObject,Events,Map,Defs,DefsMap>(scene,this)
    }
    asyncInstantiate(scene:Scene):Promise<Scene3DInstance<DefaultGameObject,Events,Map,Defs,DefsMap>>{
        return new Promise<Scene3DInstance<DefaultGameObject,Events,Map,Defs,DefsMap>>((resolve, _reject) => {
            resolve(new Scene3DInstance<DefaultGameObject,Events,Map,Defs,DefsMap>(scene,this))
        })
    }
}