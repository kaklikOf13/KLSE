#include <KLSE/klse.hpp>
#include <stdio.h>
#include <cstring>
#include <string.h>
#include <cstdlib>

#include <map>
#include <iostream>
#include <filesystem>
#include <fstream>

#include <algorithm>
std::string compiler="g++";
std::string compilerWasm="emcc";
std::string ar="ar";
void printHelp(){
    std::printf("- Commands:\n");
    std::printf("\tcompile-o <name> <dest> <carg>? # Create .o file from src and others\n");
    std::printf("\tcompile-static-lib <name> <dest> <carg>? <largs>?  # Create static lib file from src and others\n");
    std::printf("\tgenerate-wasm <name> <dest> <carg>?");
    std::printf("\tmerge-libs <lib1> <lib2> <dest> <name> # Merge two static libraries into one\n");
    std::printf("\tbuild-dir <dir> # if directory already exist, delete. always create a dir.\n");
    std::printf("\ttask <YOUR-OS> <TASK-THREE>\n");
    std::printf("\tremove <FILE> #delete file or directory");
}
KLSE::KLSEDef def=KLSE::KLSEDef();

void runTask(int argc, char* argv[], KLSE::Tasks& task) {
    std::string v="windows";
    if(argc==0){
        std::cout << "Running Windows task : "<<" : "<<v << std::endl;
        system(task.task.c_str());
        return;
    }else{
        if(task.childs.count(argv[0])==0){
            throw "Invalid Task";
        }
        v+="/"+std::string(argv[0]);
        runTask(argc-1,&argv[1],task.childs[argv[0]]);
    }
}

std::vector<std::string> compileO(std::string name,std::string dest,std::string argc){
    std::vector<std::string> oFiles;
    if (std::filesystem::exists(dest+"/o/"+name) && std::filesystem::is_directory(dest+"/o/"+name)) {
        std::filesystem::remove_all(dest+"/o/"+name);
    }
    std::filesystem::create_directories(dest+"/o/"+name);
    for (const auto& entry : std::filesystem::directory_iterator("src/"+name)) {
        if(!(entry.path().extension()==".cpp"||entry.path().extension()==".c")){
            continue;
        }
        char command[256];
        std::filesystem::path ofile=dest+"/o/"+name+"/"+entry.path().filename().string();
        ofile.replace_extension(".o");
        std::sprintf(command,"%s %s -c -o \"%s\" \"%s\"",
        compiler.c_str(),argc.c_str(),ofile.string().c_str(),entry.path().string().c_str()
        );
        oFiles.push_back(ofile.string());
        std::cout<<command<<std::endl;
        system(command);
    }
    return oFiles;
}
void compileStatic(std::vector<std::string> objects,std::string name,std::string dest,std::string argc){
    if (!std::filesystem::exists(dest+"/libs")){
        std::filesystem::create_directories(dest+"/libs/");
    }
    std::string file=dest+"/libs/"+KLSE::replaceAll(KLSE::replaceAll(name,"/","-"),"/","-")+".lib";
    if (!std::filesystem::exists(dest+"/libs")){
        std::filesystem::remove(dest+"/libs/");
    }
    std::string command=ar+" rcs \""+file+"\"";
    for (int i=0;i<objects.size();i++) {
        command+=" \""+objects[i]+"\"";
    }
    std::cout<<command<<std::endl;
    system(command.c_str());
}

std::string compileWasmLib(std::string name,std::string dest,std::string argc){
    std::vector<std::string> oFiles;
    if (std::filesystem::exists(dest+"/libs/") && std::filesystem::is_directory(dest+"/libs/")) {
        std::filesystem::remove_all(dest+"/libs/");
    }
    std::filesystem::create_directories(dest+"/libs/");
    std::string file=dest+"/libs/"+KLSE::replaceAll(KLSE::replaceAll(name,"/","-"),"/","-")+".wasm";
    std::string command=compilerWasm+" -o "+file+" -s WASM=1 -s EXPORT_ALL=1 --no-entry";
    for (const auto& entry : std::filesystem::directory_iterator("src/"+name)) {
        if(!(entry.path().extension()==".cpp"||entry.path().extension()==".c")){
            continue;
        }
        command+=" "+entry.path().string();
    }
    command+=" "+argc;
    system(command.c_str());
    return command;
}

void mergeStaticLibs(std::string lib1,std::string name, std::string lib2, std::string dest) {
    if (!std::filesystem::exists(dest+"/libs")){
        std::filesystem::create_directories(dest+"/libs/");
    }
    std::string file=dest+"/libs/"+KLSE::replaceAll(KLSE::replaceAll(name,"/","-"),"/","-")+".lib";
    
    // Create the merge command
    std::string command = ar + " -rcT " + file + " " + lib1 + " " + lib2;
    
    
    // Execute the command
    std::cout << command << std::endl;
    system(command.c_str());
}

int main(int argc, char* argv[]){
    if(argc<=1){
        printHelp();
        return 0;
    }
    if(std::filesystem::exists("klse.json")){
        std::ifstream input_file("klse.json");
        if (!input_file.is_open()) {
            std::cerr << "Failed to open file." << std::endl;
            return 1;
        }
        KLSE::json j;
        input_file >> j;
        KLSE::KLSEFile::d_from_json(j,def);
        input_file.close();
    }

    if(std::strcmp(argv[1],"compile-o")==0){
        if(argc==5){
            compileO(argv[2],argv[3],argv[4]);
        }else if(argc==4){
            compileO(argv[2],argv[3],"");
        }else{
            printf("%s Invalid command Args\n",argv[1]);
            return 1;
        }
    }else if(std::strcmp(argv[1],"generate-wasm")==0){
        std::string carg="";
        if(argc==5){
            carg=argv[4];
        }else if(argc!=4){
            printf("%s Invalid command Args\n",argv[1]);
            return 1;
        }
        auto val=compileWasmLib(argv[2],argv[3],carg);
        std::cout<<val<<"\n";
    }else if(std::strcmp(argv[1],"task")==0){
        if(argc>=3){
            if(std::strcmp(argv[2],"windows")==0){
                runTask(argc - 3, &argv[3],def.windows_tasks);
                return 0;
            }
        }else{
            printf("%s Invalid command Args\n",argv[1]);
            return 1;
        }
    }else if(std::strcmp(argv[1],"merge-libs")==0){
        std::string Name="merged";
        if(argc==6){
            Name=argv[5];
        }else if(argc==5){}else{
            printf("%s Invalid command Args\n", argv[1]);
            return 1;
        }
        mergeStaticLibs(argv[2],Name, argv[3], argv[4]);
    }else if(std::strcmp(argv[1],"compile-static-lib")==0){
        std::string Argc="";
        std::string Argl="";
        if(argc==6){
            Argl=argv[5];
            Argc=argv[4];
        }else if(argc==5){
            Argc=argv[4];
        }else if(argc<4){
            printf("%s Invalid command Args\n",argv[1]);
            return 1;
        }
        compileStatic(compileO(argv[2],argv[3],Argc),argv[2],argv[3],Argl);
    }else if(std::strcmp(argv[1],"build-dir")==0){
        if(argc==3){
            if (std::filesystem::exists(argv[2]) && std::filesystem::is_directory(argv[2])) {
                std::filesystem::remove_all(argv[2]);
            }
            std::filesystem::create_directories(argv[2]);
        }else{
            printf("%s Invalid command Args\n",argv[1]);
            return 1;
        }
    }else if(std::strcmp(argv[1],"remove")==0){
        if (std::filesystem::exists(argv[2])) {
            std::filesystem::remove_all(argv[2]);
        }
    }else{
        printf("%s Invalid command\n",argv[1]);
        printHelp();
    }

    return 0;
}