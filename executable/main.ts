//cp -r executable/templates dist/templates)

import { copy } from "https://deno.land/std/fs/mod.ts";
async function copyDir(source: string, destination: string): Promise<void> {
    await copy(source, destination, { overwrite: true })
}
function help(){
    console.log("Commands:")
    console.log(" - new-project //create new project, with template.")
    console.log(" - list-templates //create new project, with template.")
}

if(Deno.args[0]){
    switch(Deno.args[0]){
        case "new-project":{
            const den="projecto_123456"
            const nn=prompt("project name:")
            const template=prompt("template:")
            if (nn&&template){
                await copyDir(import.meta.dirname+"/templates/"+template,den)
                await Deno.rename(den,nn)
            }
            break
        }
        case "list-templates":{
            for (const dirEntry of Deno.readDirSync(import.meta.dirname+"/templates")) {
                console.log(dirEntry.name)
            }
            break
        }
        default:{
            help()
        }
    }
}else{
    help()
}
