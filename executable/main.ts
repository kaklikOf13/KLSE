import { copy } from "https://deno.land/std/fs/mod.ts"
import { dirname } from "https://deno.land/std/path/mod.ts"
import { Server } from "../server_side/mod.ts";
async function copyDir(source: string, destination: string): Promise<void> {
    await copy(source, destination, { overwrite: true })
}
function help(){
    console.log("Commands:")
    console.log(" - new-project //create new project, with template.")
    console.log(" - list-templates //create new project, with template.")
    console.log(" - host //host this current dir")
}

if(Deno.args[0]){
    const dir=dirname(Deno.execPath())
    switch(Deno.args[0]){
        case "new-project":{
            const den="projecto_123456"
            const nn=prompt("project name:")
            const template=prompt("template:")
            if (nn&&template){
                await copyDir(dir+"/templates/"+template,den)
                await Deno.rename(den,nn)
            }
            break
        }
        case "list-templates":{
            for (const dirEntry of Deno.readDirSync(dir+"/templates")) {
                console.log(dirEntry.name)
            }
            break
        }
        case "host":{
            const server=new Server(80,false)
            server.folder("/",".")
            server.run()
            break
        }
        default:{
            help()
        }
    }
}else{
    help()
}
