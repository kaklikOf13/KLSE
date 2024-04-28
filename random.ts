export function random_int(min:number,max:number):number{
    return Math.floor(Math.random()*(max-min)+min)
}
export function random_float(min:number,max:number):number{
    return Math.random()*(max-min)+min
}