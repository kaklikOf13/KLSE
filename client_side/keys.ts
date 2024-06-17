import { Vec, Vector } from "../mod.ts";
import { SignalManager } from "../utils/_utils.ts";

export enum Key{
    A=0,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    J,
    K,
    L,
    M,
    N,
    O,
    P,
    Q,
    R,
    S,
    T,
    U,
    V,
    W,
    X,
    Y,
    Z,
    Number_0,
    Number_1,
    Number_2,
    Number_3,
    Number_4,
    Number_5,
    Number_6,
    Number_7,
    Number_8,
    Number_9,
    
    Enter,
    Backspace,
    Space,
    Delete,
    Tab,
    LShift,
    RShift,
    LCtrl,
    RCtrl,
    LALT,
    RALT,

    Arrow_Up,
    Arrow_Down,
    Arrow_Left,
    Arrow_Right,

    Mouse_Left,
    Mouse_Middle,
    Mouse_Right,

    Mouse_Option1,
    Mouse_Option2
}

export const JSKeys:Record<Key,number>={
  [Key.A]: 65,
  [Key.B]: 66,
  [Key.C]: 67,
  [Key.D]: 68,
  [Key.E]: 69,
  [Key.F]: 70,
  [Key.G]: 71,
  [Key.H]: 72,
  [Key.I]: 73,
  [Key.J]: 74,
  [Key.K]: 75,
  [Key.L]: 76,
  [Key.M]: 77,
  [Key.N]: 78,
  [Key.O]: 79,
  [Key.P]: 80,
  [Key.Q]: 81,
  [Key.R]: 82,
  [Key.S]: 83,
  [Key.T]: 84,
  [Key.U]: 85,
  [Key.V]: 86,
  [Key.W]: 87,
  [Key.X]: 88,
  [Key.Y]: 89,
  [Key.Z]: 100,

  [Key.Number_0]: 48,
  [Key.Number_1]: 49,
  [Key.Number_2]: 50,
  [Key.Number_3]: 51,
  [Key.Number_4]: 52,
  [Key.Number_5]: 53,
  [Key.Number_6]: 54,
  [Key.Number_7]: 55,
  [Key.Number_8]: 56,
  [Key.Number_9]: 57,

  [Key.Enter]: 13,
  [Key.Backspace]: 8,
  [Key.Space]: 32,
  [Key.Delete]: 46,
  [Key.Tab]: 9,

  [Key.LShift]: 16,
  [Key.RShift]: 16,

  [Key.LCtrl]: 17,
  [Key.RCtrl]: 17,

  [Key.LALT]: 18,
  [Key.RALT]: 18,

  [Key.Arrow_Up]: 38,
  [Key.Arrow_Down]: 40,
  [Key.Arrow_Left]: 37,
  [Key.Arrow_Right]: 39,

  [Key.Mouse_Left]: 300,
  [Key.Mouse_Middle]: 301,
  [Key.Mouse_Right]: 302,
  [Key.Mouse_Option1]: 303,
  [Key.Mouse_Option2]: 304
}
export const KeyNames: Record<number, Key> = {
    65: Key.A,
    66: Key.B,
    67: Key.C,
    68: Key.D,
    69: Key.E,
    70: Key.F,
    71: Key.G,
    72: Key.H,
    73: Key.I,
    74: Key.J,
    75: Key.K,
    76: Key.L,
    77: Key.M,
    78: Key.N,
    79: Key.O,
    80: Key.P,
    81: Key.Q,
    82: Key.R,
    83: Key.S,
    84: Key.T,
    85: Key.U,
    86: Key.V,
    87: Key.W,
    88: Key.X,
    89: Key.Y,
    100: Key.Z,
  
    48: Key.Number_0,
    49: Key.Number_1,
    50: Key.Number_2,
    51: Key.Number_3,
    52: Key.Number_4,
    53: Key.Number_5,
    54: Key.Number_6,
    55: Key.Number_7,
    56: Key.Number_8,
    57: Key.Number_9,
  
    13: Key.Enter,
    8: Key.Backspace,
    32: Key.Space,
    46: Key.Delete,
    9: Key.Tab,
  
    16: Key.LShift,
    17: Key.LCtrl,
    18: Key.LALT,

    38: Key.Arrow_Up,
    40: Key.Arrow_Down,
    37: Key.Arrow_Left,
    39: Key.Arrow_Right,
  
    301: Key.Mouse_Left,
    302: Key.Mouse_Middle,
    303: Key.Mouse_Right,
    304: Key.Mouse_Option1,
    305: Key.Mouse_Option2
}

export enum Events{
    KeyDown="keydown",
    KeyUp="keyup"
}

export class KeyListener{
    private keys:number[]
    private keysdown:number[]
    private keysup:number[]

    public listener:SignalManager
    constructor(){
        this.keys=[]
        this.keysdown=[]
        this.keysup=[]
        this.listener=new SignalManager()
    }
    bind(elem:HTMLElement){
        elem.addEventListener("keydown",(e:KeyboardEvent)=>{
            this.keysdown.push(e.keyCode)
            this.keys.push(e.keyCode)
            this.listener.emit(Events.KeyDown,KeyNames[e.keyCode])
        })
        elem.addEventListener("keyup",(e:KeyboardEvent)=>{
            this.keysup.push(e.keyCode)
            this.listener.emit(Events.KeyUp,KeyNames[e.keyCode])
        })
        elem.addEventListener("mousedown",(e:MouseEvent)=>{
            this.keysdown.push(e.button+300)
            this.keys.push(e.button+300)
            this.listener.emit(Events.KeyDown,KeyNames[e.button+300])
        })
        elem.addEventListener("mouseup",(e:MouseEvent)=>{
            this.keys.splice(this.keys.indexOf(e.button+300))
            this.keysup.push(e.button+300)
            this.listener.emit(Events.KeyUp,KeyNames[e.button+300])
        })
    }
    //to work
    tick(){
        this.keysdown=[]
        for(const i of this.keysup){
            let index=this.keys.indexOf(i)
            while(index!=-1){
                this.keys.splice(index,1)
                index=this.keys.indexOf(i)
            }
        }
        this.keysup=[]
    }
    keyPress(key:Key):boolean{
        return this.keys.includes(JSKeys[key])
    }
    keyDown(key:Key):boolean{
        return this.keysdown.includes(JSKeys[key])
    }
    keyUp(key:Key):boolean{
        return this.keysup.includes(JSKeys[key])
    }
}

export class MousePosListener{
    private _position:Vector
    private readonly meter_size:number
    get position():Vector{
        return Vec.scale(this._position,this.meter_size)
    }
    constructor(meter_size:number){
        this._position=Vec.new(0,0)
        this.meter_size=meter_size
    }
    bind(elem:HTMLElement){
        elem.addEventListener("mousemove",(e:MouseEvent)=>{
            this._position=Vec.new(e.clientX,e.clientY)
        })
    }
}