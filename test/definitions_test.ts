import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { DefaultGameDefs, NewGameDef } from "../utils/definitions.ts";
import { getEnumValues } from "../utils/_utils.ts";

Deno.test("Game Definitions",()=>{
    const def=NewGameDef(getEnumValues(DefaultGameDefs))
    console.log(def)
})