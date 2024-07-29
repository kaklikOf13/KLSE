import { Clock, cloneDeep } from "./_utils.ts"
import { BaseObject2D, BaseObject3D, type CellsManager2D, GameObjectManager2D, GameObjectManager3D, CellsManager3D } from "./gameObject.ts"
import { type Vec2, type Vec3 } from "./geometry.ts";
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
export interface Scene2D{
    cellsSize?:number
    objects:Record<string,Array<{
        type:string,
        position?:Vec2
        scale?:Vec2
        rotation?:number
        // deno-lint-ignore no-explicit-any
        vals?:Record<string,any>
        id?:number
    }>>
}
export interface Scene3D{
    cellsSize?:number
    objects:Record<string,Array<{
        type:string,
        position?:Vec3
        scale?:Vec3
        rotation?:Vec3
        // deno-lint-ignore no-explicit-any
        vals?:Record<string,any>
        id?:number
    }>>
}

export class Scene2DInstance<DefaultGameObject extends BaseGameObject2D=BaseGameObject2D,Events extends DefaultEvents=DefaultEvents,Map extends DefaultEventsMap2D=DefaultEventsMap2D>{
    readonly scene:Scene2D
    readonly objects:GameObjectManager2D<DefaultGameObject>
    readonly cells:CellsManager2D<DefaultGameObject>
    readonly game:Game2D<DefaultGameObject,Events,Map>
    constructor(scene:Scene2D,game:Game2D<DefaultGameObject,Events,Map>){
        this.scene=scene
        this.objects=new GameObjectManager2D<DefaultGameObject>(scene.cellsSize)
        this.cells=this.objects.cells
        this.game=game
        this.reset()
    }
    reset(){
        this.objects.clear()
        this.objects.add_object=(obj: DefaultGameObject, category: string, id?: number | undefined, args?: Record<string, any> | undefined)=>{
            const ret=GameObjectManager2D.prototype.add_object.call(this.objects,obj,category,id,args)
            ret.game=this.game
            return ret
        }
        for(const c in this.scene.objects){
            this.objects.add_category(c)
            for(const o of this.scene.objects[c]){
                const obj=this.objects.add_object(new this.game.objects[o.type](),c,o.id,o.vals)
                if(o.position)obj.position=cloneDeep(o.position as Vec2)
            }
        }
    }
    asyncReset():Promise<void>{
        return new Promise<void>((resolve)=>{
            resolve(this.reset())
        })
    }
}
export class Scene3DInstance<DefaultGameObject extends BaseGameObject3D=BaseGameObject3D,Events extends DefaultEvents=DefaultEvents,Map extends DefaultEventsMap3D=DefaultEventsMap3D>{
    readonly scene:Scene3D
    readonly objects:GameObjectManager3D<DefaultGameObject>
    readonly cells:CellsManager3D<DefaultGameObject>
    readonly game:Game3D<DefaultGameObject,Events,Map>
    constructor(scene:Scene3D,game:Game3D<DefaultGameObject,Events,Map>){
        this.scene=scene
        this.objects=new GameObjectManager3D<DefaultGameObject>(scene.cellsSize)
        this.cells=this.objects.cells
        this.game=game
        this.reset()
    }
    reset(){
        this.objects.clear()
        this.objects.add_object=(obj: DefaultGameObject, category: string, id?: number | undefined, args?: Record<string, any> | undefined)=>{
            const ret=GameObjectManager3D.prototype.add_object.call(this.objects,obj,category,id,args)
            ret.game=this.game
            return ret
        }
        for(const c in this.scene.objects){
            this.objects.add_category(c)
            for(const o of this.scene.objects[c]){
                const obj=this.objects.add_object(new this.game.objects[o.type](),c,o.id,o.vals)
                if(o.position)obj.position=o.position as Vec3
                if(o.scale)obj.hb.transform.scale=cloneDeep(o.scale as Vec3)
                if(o.rotation)obj.hb.transform.rotation=cloneDeep(o.rotation as Vec3)
            }
        }
    }
    asyncReset():Promise<void>{
        return new Promise<void>((resolve)=>{
            resolve(this.reset())
        })
    }
}
export abstract class Game2D<DefaultGameObject extends BaseGameObject2D=BaseGameObject2D,Events extends DefaultEvents=DefaultEvents,Map extends DefaultEventsMap2D=DefaultEventsMap2D>{
    readonly tps:number

    private readonly clock:Clock
    running:boolean=true
    readonly events:EventsManager<Events,Map>
    scene:Scene2DInstance<DefaultGameObject,Events,Map>
    objects:Record<string,new()=>DefaultGameObject>
    constructor(tps: number,objects:Record<string,new()=>DefaultGameObject>){
        this.tps=tps
        this.events=new EventsManager()
        this.clock=new Clock(tps,1)
        this.objects=objects
        this.scene=new Scene2DInstance<DefaultGameObject,Events,Map>({objects:{}},this)
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
    instantiate(scene:Scene2D):Scene2DInstance<DefaultGameObject,Events,Map>{
        return new Scene2DInstance<DefaultGameObject,Events,Map>(scene,this)
    }
    asyncInstantiate(scene:Scene2D):Promise<Scene2DInstance<DefaultGameObject,Events,Map>>{
        return new Promise<Scene2DInstance<DefaultGameObject,Events,Map>>((resolve, _reject) => {
            resolve(new Scene2DInstance<DefaultGameObject,Events,Map>(scene,this))
        })
    }
}
export abstract class Game3D<DefaultGameObject extends BaseGameObject3D=BaseGameObject3D,Events extends DefaultEvents=DefaultEvents,Map extends DefaultEventsMap3D=DefaultEventsMap3D>{
    readonly tps:number

    private readonly clock:Clock
    running:boolean=true
    readonly events:EventsManager<Events,Map>
    scene:Scene3DInstance<DefaultGameObject,Events,Map>
    objects:Record<string,new()=>DefaultGameObject>
    constructor(tps: number,objects:Record<string,new()=>DefaultGameObject>){
        this.tps=tps
        this.events=new EventsManager()
        this.clock=new Clock(tps,1)
        this.objects=objects
        this.scene=new Scene3DInstance<DefaultGameObject,Events,Map>({objects:{}},this)
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
    instantiate(scene:Scene3D):Scene3DInstance<DefaultGameObject,Events,Map>{
        return new Scene3DInstance<DefaultGameObject,Events,Map>(scene,this)
    }
    asyncInstantiate(scene:Scene3D):Promise<Scene3DInstance<DefaultGameObject,Events,Map>>{
        return new Promise<Scene3DInstance<DefaultGameObject,Events,Map>>((resolve, _reject) => {
            resolve(new Scene3DInstance<DefaultGameObject,Events,Map>(scene,this))
        })
    }
}