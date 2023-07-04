#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Copyright (c) 2022 Huawei Device Co., Ltd.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Description: Use ark to execute test 262 test suite
"""

import os
import datetime
import shutil
import difflib
from config import *
import subprocess
import json


def command_os(order):
    subprocess.run(order)


def mk_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)


def remove_dir(path):
    if os.path.exists(path):
        shutil.rmtree(path)


def remove_file(path):
    if os.path.exists(path):
        os.remove(path)


def clean_file(path):
    with open(path, "w") as utils_clean:
        utils_clean.write("")


def read_file(path):
    util_read_content = []
    with open(path, "r") as utils_read:
        util_read_content = utils_read.readlines()

    return util_read_content


def write_file(path, write_content):
    with open(path, "w") as utils_write:
        utils_write.write(write_content)


def write_append(path, add_content):
    fd = os.open(path, os.O_APPEND|os.O_CREAT|os.O_WRONLY)
    with os.fdopen(fd, 'a+') as utils_append:
        utils_append.write(add_content)


def move_file(srcfile, dstfile):
    subprocess.getstatusoutput("mv %s %s" % (srcfile, dstfile))


def current_time():
    return datetime.datetime.now()


def excuting_npm_install(args):
    ark_frontend_tool = os.path.join(DEFAULT_ARK_FRONTEND_TOOL)
    if args.ark_frontend_tool:
        ark_frontend_tool = os.path.join(args.ark_frontend_tool)

    ts2abc_build_dir = os.path.join(os.path.dirname(os.path.realpath(ark_frontend_tool)), "..")
    if os.path.exists(os.path.join(ts2abc_build_dir, "package.json")):
        npm_install(ts2abc_build_dir)
    elif os.path.exists(os.path.join(ts2abc_build_dir, "..", "package.json")):
        npm_install(os.path.join(ts2abc_build_dir, ".."))


def npm_install(cwd):
    try:
        os.chdir(cwd)
        command_os(["npm", "install"])
        os.chdir(WORK_PATH)
    except BaseException as e:
        print(e)
