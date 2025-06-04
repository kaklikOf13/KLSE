import argparse
import json
import os
import subprocess
import sys
from typing import Dict, Any
MAIN_FILE=""
if getattr(sys, 'frozen', False):
    MAIN_FILE=sys.executable
else:
    MAIN_FILE=__file__

# Constants
DEFAULT_INCLUDES = os.path.join(os.path.dirname(MAIN_FILE),"includes")
DEFAULT_LIBS = os.path.join(os.path.dirname(MAIN_FILE), "libs")
DEFAULT_KLSE_JSON = "klse.json"
IS_WINDOWS = os.name == "nt"

os.makedirs(DEFAULT_INCLUDES, exist_ok=True)
os.makedirs(DEFAULT_LIBS, exist_ok=True)

def load_klse_json(path: str) -> Dict[str, Any]:
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {path}: {e}")
        sys.exit(1)


def ensure_dirs(paths):
    for path in paths:
        os.makedirs(path, exist_ok=True)


def build_dir_command(args,parser):
    ensure_dirs([
        os.path.join("dist", "libs"),
        os.path.join("dist", "bin"),
        os.path.join("dist", "obj")
    ])
    print("Build directories created.")


def help_command(args, parser):
    parser.print_help()


def run_subprocess(command: str):
    print(f"Executing: {command}")
    subprocess.run(command, shell=True, text=True)


def smart_compile(language: str, src: str, dest: str, additionals: list[str]|None,debug:bool=False):
    src_mtime = os.path.getmtime(src)
    out_mtime = os.path.getmtime(dest) if os.path.isfile(dest) else 0
    if not os.path.exists(dest) or src_mtime > out_mtime:
        command = f"{compilers[language]} \"{src}\" -c -o \"{dest}\""
        if additionals!=None:
            for i in additionals:
                command+=i+" "
        if debug:
            command+="-g "
        command+=f'-I"{DEFAULT_INCLUDES}" -L"{DEFAULT_LIBS}"'
        run_subprocess(command)

def compile_folder(language: str, output_dir: str, folder: str, additionals: str,debug):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.endswith((".cpp", ".c")):
                src_path = os.path.join(root, file)
                obj_path = os.path.join(output_dir, f"{os.path.splitext(file)[0]}.o")
                smart_compile(language,src_path,obj_path,additionals,debug)


def merge_library(lib_output: str, obj_dir: str):
    name = os.path.basename(lib_output)
    extension = "lib" if IS_WINDOWS else "a"
    prefix = "" if IS_WINDOWS else "lib"
    lib_path = f"{os.path.dirname(lib_output)}/{prefix}{name}.{extension}"
    obj_files = " ".join([os.path.join(obj_dir, f) for f in os.listdir(obj_dir) if f.endswith(".o")])
    command = f"ar rcs {lib_path} {obj_files}"
    run_subprocess(command)


def execute_build_task(klse_data,task: dict,debug:bool):
    includes_flags=[]

    for pt in task.get("pre_tasks",[]):
        exec_task(klse_data,pt.split(" "),debug)

    for inc in task.get("includes", []):
        includes_flags.append(f"-I\"{inc}\"")
    for libdir in task.get("libs_dir", []):
        includes_flags.append(f"-L\"{libdir}\"")

    lang = task.get("language", "c++")
    outputo = task.get("o_output", "")
    if task.get("source"):
        ensure_dirs([outputo])
        for src_folder in task["source"]:
            compile_folder(lang, outputo, src_folder, includes_flags,debug)

    if "lib_output" in task:
        merge_library(task["lib_output"], outputo)
    elif "bin_output" in task:
        dd=os.path.dirname(task["bin_output"])
        if not os.path.isdir(dd):
            os.makedirs(dd)
        name=f'{os.path.dirname(task["bin_output"])}/{os.path.basename(task["bin_output"])}{".exe" if IS_WINDOWS else ""}'
        libsi=" "
        if "libs" in task:
            for l in task["libs"]:
                match l:
                    case "gl":
                        if IS_WINDOWS:
                            libsi+="-lklse_glfw -lklse_gl -lglfw3 -lgdi32 -ldwmapi "
                        else:
                            libsi+="-lklse_glfw -lklse_gl -lglfw -lGL -ldl -lpthread "
                    case _:
                        libsi+="-l"+l+" "
        command=f"{compilers[lang]} {task['bin_main']} -o {name} {' '.join(includes_flags)} "+'-I"'+DEFAULT_INCLUDES+'" '+'-L"'+DEFAULT_LIBS+'"'+f" {libsi}"
        print("Executing:",command)
        subprocess.run(command, shell=True,text=True)

def exec_task(klse_data,task_id,debug):
    task = klse_data.get("task", {})
    task_seq = task_id

    print("Executing Task:"," ".join(task_id))

    current = task
    for name in task_seq:
        current = current.get("childs", {}).get(name, current.get(name))
        if current is None:
            print(f"Task {name} not found.")
            sys.exit(1)

    if "task" in current:
        run_subprocess(current["task"])
    elif "build" in current:
        execute_build_task(klse_data,current["build"],debug)
    elif IS_WINDOWS and "windows" in current:
        run_subprocess(current["windows"])
    elif not IS_WINDOWS and "posix" in current:
        run_subprocess(current["posix"])
    else:
        print("No valid task found to execute.")
        sys.exit(1)
def task_command(args,parser):
    klse_data = load_klse_json(os.path.join(args.path, DEFAULT_KLSE_JSON))
    exec_task(klse_data,args.task,args.debug)


commands={
    "help":help_command,
    "task":task_command,
    "build-dir":build_dir_command,
    "smart-compile":lambda args,parser:smart_compile(args.language,args.source,args.output,[args.additional],args.debug)
}

def main():
    parser = argparse.ArgumentParser(description="KLSE CLI")
    subparsers = parser.add_subparsers(dest="command")

    parser.add_argument("-tp", "--path", type=str, default=".", help="Path to klse.json")
    parser.add_argument("-d","--debug", action="store_true", help="Enable debug mode")

    # help
    subparsers.add_parser("help", help="Show help message")

    # build-dir
    subparsers.add_parser("build-dir", help="Create required build directories")

    # Smart-Compile
    pars=subparsers.add_parser("smart-compile", help="Compile Just If Is Necessery")
    pars.add_argument("language", help="The Language. c++ or c")
    pars.add_argument("source", help="The Code File")
    pars.add_argument("output", help="The Output File")
    pars.add_argument("--additional","-a", help="Includes, Libs And Another Things")

    # task
    task_parser = subparsers.add_parser("task", help="Execute tasks from klse.json")
    task_parser.add_argument("task", nargs="+", help="Task sequence to execute")

    args = parser.parse_args()

    if args.command in commands.keys():
        commands[args.command](args,parser)
    elif args.command is None:
        help_command(args, parser)
    else:
        print("Unknown command. Use 'help' for usage.")
        sys.exit(1)

# Simulate a compiler map for now (add your actual compiler logic here)
compilers = {
    "c++": "g++",
    "c": "gcc"
}

if __name__ == "__main__":
    main()

