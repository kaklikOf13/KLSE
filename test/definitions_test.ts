import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { Language, LocalizatorDefs } from "../utils/definitions.ts";
Deno.test("Definitions Basics",()=>{
    const lang1:Language={name:"en-us",value:{
        "aba":{
            "ca":{
                "dabra":"x"
            },
            "uc":"abc"
        }
    }}

    const lang2:Language={name:"en-us",value:{
        "aba":{
            "ca":{
                "dabra":"y"
            },
            "uc":"def"
        }
    }}

    const translator:LocalizatorDefs=new LocalizatorDefs(lang1)

    let v1=translator.get("aba.ca.dabra")
    console.log(v1)
    assertEquals(v1,"x")

    let v2=translator.get("aba.uc")
    console.log(v2)
    assertEquals(v2,"abc")

    translator.language=lang2
    
    v1=translator.get("aba.ca.dabra")
    console.log(v1)
    assertEquals(v1,"y")

    v2=translator.get("aba.uc")
    console.log(v2)
    assertEquals(v2,"def")
})