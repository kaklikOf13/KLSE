""" Copyright (c) 2025 Kaklik
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE."""

# system
import json
import sys
import os
import subprocess
import shutil
from typing import Union

# klse
from options import *
from shlex import split as shsplit

# const

if os.name == "nt":
    OS = "windows"
else:
    OS = "posix"

# default commands
default_search_path = ""

default_options = {
    "-tp": Opt("tp", "Set the tasks path to search for klse.json `klse -tp=\"my/path/to/klse/json/file\" task`"),
}

default_commands = {
    "help": Command("help", "Show this help message"),
    "task": Command("task", "Execute a klse.json tasks file `klse -tp dir task build release`"),
    "smart-compile":Command("smart-compile","Compile Just Modified Files"),
    "compile-folder":Command("compile-folder","Compile A Entire Folder. But Dont Compile The Subfolders"),
    "merge-lib":Command("merge-lib","Merge All .o files Of A Folder In A Static Lib"),
    "build-dir": Command("build-dir", "Prepares all the bin and build directories based on your current CD directory")
}

def prepare_commands():
    # Opt
    def task_path_klse(new_path: str):
        global default_search_path
        default_search_path = new_path
    # Commands
    
    #TODO: Improve the logic on this
    def task_exec_klse(task_sequence: str):
        task_sequence: list[str] = shsplit(task_sequence)
        if task_sequence[0] == '':
            print_error("No task provided")
            sys.exit(1)
        path = os.path.join(default_search_path, "klse.json")
        if os.path.isfile(path):
            with open(path) as f:
                kf: dict = json.loads(f.read())
        else:
            print_error(f"Could not find or load file `{path}`")
            sys.exit(1)
            
        kf = kf.get("task", None)
        if kf is None:
            print_error(f"Could not find a \"task\" object on file `{path}`")
            sys.exit(1)
        
        def exec_task(task: dict):
            if OS in task.keys():
                subprocess.run(task[OS], shell=True)
            elif "task" in task.keys():
                subprocess.run(task["task"], shell=True)
            else:
                print_error("Invalid Task!!!")
                sys.exit(1)
        
        if task_sequence[0] in kf.keys():
            kf = kf[task_sequence[0]]
            task_sequence.pop(0)
        while len(task_sequence) > 0:
            if "childs" in kf.keys() and task_sequence[0] in kf["childs"].keys():
                kf = kf["childs"][task_sequence[0]]
                task_sequence.pop(0)
            else:
                break
            
        exec_task(kf)
        
    def help_klse():
        print("Usage: klse [options] [command]\n")
        
        cmm: list[Command] = [c for c in default_commands.values() if isinstance(c, Command)]
        opt: list[Opt] = [o for o in default_options.values() if isinstance(o, Opt)]
        
        print("Main commands:")
        for c in cmm:
            print(f"\t{c.name} - {c.description}")
        print("Options:")
        for o in opt:
            print(f"\t-{o.opt} - {o.description}")
    def build_dir_klse():
        directory: str = os.path.join(os.getcwd(), "dist")
        if not os.path.exists(directory):
            os.mkdir(directory)
        
        for path in ["/libs", "/bin", "/obj"]:
            pth = directory + path
            
            if not os.path.exists(pth):
                os.mkdir(pth)
    def smart_compile_klse(args: str):
        args=shsplit(args)
        if len(args)<3:
            print_error("Invalid Args Count")
            sys.exit(1)
        src_file=args[1]
        output_dir=args[2]
        out_file=f"{output_dir}/{os.path.splitext(os.path.basename(src_file))[0]}.o"
        args_ext=""
        if not os.path.isdir(output_dir):
            print_error("Invalid Output Dir")
            sys.exit(1)
        if(len(args)>3):
            args_ext=" ".join(args[3:len(args)])
        command=""
        match args[0]:
            case "c++"|"c":
                command=f"{compilers[args[0]]} {src_file} -o {out_file} -c {args_ext}"
            case _:
                print_error(f"Invalid Languague {args[0]}")
        src_mtime = os.path.getmtime(src_file)
        out_mtime = os.path.getmtime(out_file) if os.path.isfile(out_file) else 0
        if not os.path.exists(out_file) or src_mtime > out_mtime:
            print_success("COMPILATION COMMAND",command)
            subprocess.run(command)
        else:
            print_success("ALREADY IS COMPILED",f"{out_file}")
    def compile_folder_klse(args: str):
        args=shsplit(args)
        if len(args)<3:
            print_error("Invalid Args Count")
            sys.exit(1)
        output_dir=args[1]
        if not os.path.isdir(output_dir):
            os.mkdir(output_dir)
        args_ext=""
        if(len(args)>3):
            args_ext=" ".join(args[3:len(args)])
        src_dir=args[2]
        language=args[0]
        if not os.path.isdir(src_dir):
            print_error("Invalid Sources Dir")
            sys.exit(1)
        files=os.listdir(src_dir)
        for f in files:
            fp=src_dir+"/"+f
            if os.path.isfile(fp):
                default_commands["smart-compile"].exec(f"{language} {fp} {output_dir} {args_ext}")
    def merge_lib_klse(args: str):
        args=shsplit(args)
        if len(args)<2:
            print_error("Invalid Args Count")
            sys.exit(1)
        output_file=args[0]
        src_dir=args[1]
        files=os.listdir(src_dir)
        command=f"{compilers['ar']} rcs {output_file}"
        for f in files:
            command+=" "+src_dir+"/"+f
        print_success("COMMAND",command)
        subprocess.run(command)
    default_options["-tp"].setExec(task_path_klse)
    
    default_commands["help"].setExec(help_klse)
    default_commands["task"].setExec(task_exec_klse)
    default_commands["smart-compile"].setExec(smart_compile_klse)
    default_commands["compile-folder"].setExec(compile_folder_klse)
    default_commands["merge-lib"].setExec(merge_lib_klse)
    default_commands["build-dir"].setExec(build_dir_klse)

def lex_parse(args: list[str]) -> tuple[Command, list[Opt], list[str]]:
    opts = []
    cmm = None
    cmm_set = False
    arguments = []

    for i, arg in enumerate(args):
        if arg.startswith('-'):
            arg = arg[1:]
            if arg.startswith("tp"):
                opts.append(default_options["-tp"])
                if "=" in arg:
                    arg = arg.split("=")
                    print(arg[1])
                    arguments.append(arg[1])
                else:
                    print(f"Expected '=<path>' at end of '-{arg}' but didn't get it.")
                    sys.exit(1)
            else:
                print(f"Unknown option '-{arg}', use `klse help` to get help")
                sys.exit(1)
        else:
            match arg:
                case "help":
                    cmm = default_commands["help"]
                    cmm_set = True
                case "build-dir":
                    cmm = default_commands["build-dir"]
                    cmm_set = True
                case "smart-compile":
                    cmm = default_commands["smart-compile"]
                    to_append: list[str] = []
                    for arg2 in args[i + 1:]:
                        to_append.append(arg2)
                    arguments.append(" ".join(to_append))
                    break
                case "compile-folder":
                    cmm = default_commands["compile-folder"]
                    to_append: list[str] = []
                    for arg2 in args[i + 1:]:
                        to_append.append(arg2)
                    arguments.append(" ".join(to_append))
                    break
                case "merge-lib":
                    cmm = default_commands["merge-lib"]
                    to_append: list[str] = []
                    for arg2 in args[i + 1:]:
                        to_append.append(arg2)
                    arguments.append(" ".join(to_append))
                    break
                case "task":
                    cmm = default_commands["task"]
                    to_append: list[str] = []
                    for arg2 in args[i + 1:]:
                        to_append.append(arg2)
                    arguments.append(" ".join(to_append))

                    break
                    cmm_set = True
                case _:
                    print(f"Unknown command '{arg}', use `klse help` to get help")
    
    return cmm, opts, arguments

def interpret_cmd(command: Command, options: list[Opt], arguments: list[str]):
    global default_options, default_commands, default_search_path
    
    for opt in options:
        if opt == default_options["-tp"]:
            if arguments:
                opt.exec(arguments.pop(0))
            else:
                print_error("Arguments list is empty, this means the CLI tool expected an argument for an option but it was missing")
                sys.exit(1)
    if command:
        if command == default_commands["task"]:
            if arguments:
                command.exec(arguments.pop(0))
            else:
                print_error("Arguments list is empty, this means the CLI tool expected an argument for an option but it was missing")
                sys.exit(1)
        elif command == default_commands["smart-compile"]:
            if arguments:
                command.exec(arguments.pop(0))
            else:
                print_error("Arguments list is empty, this means the CLI tool expected an argument for an option but it was missing")
                sys.exit(1)
        elif command == default_commands["compile-folder"]:
            if arguments:
                command.exec(arguments.pop(0))
            else:
                print_error("Arguments list is empty, this means the CLI tool expected an argument for an option but it was missing")
                sys.exit(1)
        elif command == default_commands["merge-lib"]:
            if arguments:
                command.exec(arguments.pop(0))
            else:
                print_error("Arguments list is empty, this means the CLI tool expected an argument for an option but it was missing")
                sys.exit(1)
        else:
            command.exec()

compilers = {
    "c":shutil.which("gcc"), 
    "c++":shutil.which("g++"),
    "ar":shutil.which("ar"),
}
if not compilers["c"]:
    print("Couldn't find the C compiler (assumes 'gcc' alias), please create an alias for your C compiler or download one from the internet (mingw or gcc)")
    sys.exit(1)
if not compilers["c++"]:
    print("Couldn't find the C++ compiler (assumes 'g++' alias), please create an alias for your C compiler or download one from the internet (mingw or gcc)")
if not compilers["ar"]:
    print("Couldn't find the C++ compiler (assumes 'ar' alias), please create an alias for your C compiler or download one from the internet (mingw or gcc)")

def main(args: list[str] = sys.argv):
    prepare_commands()
    if len(args) == 0:
        default_commands["help"].exec()
        sys.exit(0)
    command, options, arguments = lex_parse(args)
    
    interpret_cmd(command, options, arguments)

    print("\nENDED EXECUTION")
    
    
if __name__ == "__main__":
    main(sys.argv[1:])
    sys.exit(0)