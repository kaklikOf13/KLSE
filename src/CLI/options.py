from enum import Enum
from typing import Callable

class Opt:
    def __init__(self, opt: str, description: str):
        self.opt = opt
        self.description = description
        self.exec = None
        
    def setExec(self, call: Callable):
        self.exec = call
class Command:
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.exec = None
    
    def setExec(self, call: Callable):
        self.exec = call

class OptType(Enum):
    TASK_PATH = 0

class CommandType(Enum):
    TASK = 0
    HELP = 1

def print_error(*val):
    print(f"\033[91mERROR:\033[0m",*val)
def print_success(sucess_message="SUCCESS",*val):
    print(f"\033[32m{sucess_message}:\033[0m",*val)