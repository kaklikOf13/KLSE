import { ID } from "./_utils.ts";

export const random=Object.freeze({
    int(min:number,max:number):number{
        return Math.floor(Math.random()*(max-min)+min)
    },
    float(min:number,max:number):number{
        return Math.random()*(max-min)+min
    },
    choose(val:[]):unknown{
        return val[Math.floor(Math.random()*val.length)]
    },
    id():ID{
        return Math.floor(Math.random() * 4294967296)
    }
})