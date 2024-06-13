import { Clock, SignalManager } from "./_utils.ts"
import { CellsGameObjectsManager } from "./gameObject.ts"
export enum CATEGORYS{
    PLAYERS="players"
}
export enum GenericEvents{
    GameStart="Game Start",
    GameTick="Game Tick"
}
export interface GenericEventsDataMap{
    [GenericEvents.GameStart]:undefined
    [GenericEvents.GameTick]:undefined
}
export abstract class GamePlugin{

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