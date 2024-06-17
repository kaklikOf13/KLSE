import { Clock, SignalManager } from "./_utils.ts"
import { CellsGameObjectsManager } from "./gameObject.ts"
export enum CATEGORYS{
    PLAYERS="players"
}
export enum GenericEvents{
    GameStart="Game Start",
    GameTick="Game Tick"
}
export abstract class GamePlugin<Events extends GenericEvents=GenericEvents>{
    game:Game
    constructor(game:Game){
        this.game=game
    }
    on(signal:Events,callback:(args:[])=>void){
        this.game.events.on(signal,callback)
    }
}
export abstract class Game extends CellsGameObjectsManager{
    readonly tps:number

    private readonly clock:Clock
    running:boolean=true
    readonly events:SignalManager

    constructor(tps:number,thread:number,chunksize:number){
        super(thread,chunksize)
        this.tps=tps
        this.events=new SignalManager()
        this.clock=new Clock(tps,1)
    }
    add_plugin(plugin:new(game:ThisType<this>)=>GamePlugin){
        new plugin(this)
    }
    clear_plugins(){
        this.events.clearAll()
    }
    update() {
        CellsGameObjectsManager.prototype.update.call(this)
        this.events.emit(GenericEvents.GameTick)
        this.clock.tick(this.update.bind(this))
    }
    mainloop():Promise<void>{
        return new Promise<void>((resolve) => {
            // Start
            this.events.emit(GenericEvents.GameStart)
            // Mainloop
            this.update()
            resolve()
        })
    }
}