export type ID=number
export function random_id():ID{
    return Math.floor(Math.random() * 4294967296)
}