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