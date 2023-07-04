#!/usr/bin/env python3
# coding: utf-8

"""
Copyright (c) 2021 Huawei Device Co., Ltd.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

"""

import os
import sys
import subprocess
import argparse
import time

CUR_FILE_DIR = os.path.dirname(__file__)
TS2PANDA_DIR = os.path.abspath(os.path.join(CUR_FILE_DIR, ".."))
CODE_ROOT = os.path.abspath(os.path.join(TS2PANDA_DIR, "../../.."))
DEFAULT_TARGET_DIR = os.path.join(
    CODE_ROOT, "out/hispark_taurus/clang_x64/obj/arkcompiler/ets_frontend/ts2panda")
DEFAULT_NODE_MODULE = os.path.join(
    CODE_ROOT, "prebuilts/build-tools/common/ts2abc/node_modules")


def parse_args():
    parser = argparse.ArgumentParser()

    parser.add_argument('--src-dir',
                        default=TS2PANDA_DIR,
                        help='Source directory')
    parser.add_argument('--dist-dir',
                        default=DEFAULT_TARGET_DIR,
                        help='Destination directory')
    parser.add_argument("--node-modules",
                        default=DEFAULT_NODE_MODULE,
                        help='path to node-modules exetuable')
    parser.add_argument('--platform',
                        default="linux",
                        help='platform, as: linux, mac, win')
    parser.add_argument('--js-file',
                        metavar='FILE',
                        help='The name of the test use case file to execute')

    return parser.parse_args()


def run_command(cmd, execution_path=os.getcwd()):
    print(" ".join(cmd))
    proc = subprocess.Popen(cmd, cwd=execution_path)
    ret = proc.wait()
    return ret


class Ts2abcTests():
    def __init__(self, args):
        self.args = args
        self.src_dir = TS2PANDA_DIR
        self.dist_dir = DEFAULT_TARGET_DIR
        self.node_modules = DEFAULT_NODE_MODULE
        self.platform = "linux"

    def proce_parameters(self):
        if self.args.src_dir:
            self.src_dir = self.args.src_dir

        if self.args.dist_dir:
            self.dist_dir = self.args.dist_dir

        if self.args.node_modules:
            self.node_modules = self.args.node_modules

        if self.args.platform:
            self.platform = self.args.platform

    def copy_node_modules(self):
        src_dir = self.src_dir
        dist_dir = self.dist_dir
        run_command(['cp', '-f', os.path.join(src_dir, "package.json"),
                     os.path.join(dist_dir, "package.json")])
        run_command(['cp', '-f', os.path.join(src_dir, "package-lock.json"),
                     os.path.join(dist_dir, "package-lock.json")])

        if self.node_modules:
            run_command(['cp', '-rf', self.node_modules, dist_dir])
        else:
            run_command(['npm', 'install'], dist_dir)

    def copy_tests(self):
        if os.path.exists(f'{self.dist_dir}/tests'):
            run_command(['rm', '-rf', f'{self.dist_dir}/tests'])
        run_command(['cp', '-rf', f'{self.src_dir}/tests', self.dist_dir])

    def run_build(self):
        plat_form = self.platform
        tsc = "node_modules/typescript/bin/tsc"
        if plat_form == "linux":
            cmd = [tsc, '-b', 'src', 'tests']
            ret = run_command(cmd, self.dist_dir)
        elif plat_form == "win":
            cmd = [tsc, '-b', 'src/tsconfig.win.json',
                   'tests/tsconfig.win.json']
            ret = run_command(cmd, self.dist_dir)
        elif plat_form == 'mac':
            cmd = [tsc, '-b', 'src/tsconfig.mac.json',
                   'tests/tsconfig.mac.json']
            ret = run_command(cmd, self.dist_dir)
        if ret:
            raise RuntimeError("Run [{}] failed !".format(" ".join(cmd)))

    def run_tests(self):
        os.chdir(self.dist_dir)
        start_time = time.time()
        plat_form = self.platform
        mocha = "node_modules/mocha/bin/mocha"

        if self.args.js_file:
            tests_args = self.args.js_file
        else:
            tests_args = "tests/**/*.test.js"

        if plat_form == "linux":
            cmd = ['cp', f'{self.src_dir}/src/jshelpers.js', f'build/src/' ]
            run_command(cmd, self.dist_dir)
            cmd = [mocha, f'build/{tests_args}']
            ret = run_command(cmd, self.dist_dir)
        elif plat_form == "win":
            cmd = ['cp', f'{self.src_dir}/src/jshelpers.js', f'build-win/src/' ]
            run_command(cmd, self.dist_dir)
            cmd = [mocha, f'build-win/{tests_args}']
            ret = run_command(cmd, self.dist_dir)
        elif plat_form == 'mac':
            cmd = ['cp', f'{self.src_dir}/src/jshelpers.js', f'build-mac/src/' ]
            run_command(cmd, self.dist_dir)
            cmd = [mocha, f'build-mac/{tests_args}']
            ret = run_command(cmd, self.dist_dir)
        if ret:
            raise RuntimeError("Run [{}] failed !".format(" ".join(cmd)))
        else:
            print("Run [{}] success!".format(" ".join(cmd)))
        print("used: %.5f seconds" % (time.time() - start_time))


def main():
    args = parse_args()

    test = Ts2abcTests(args)
    test.copy_node_modules()
    test.copy_tests()
    test.run_build()
    test.run_tests()


if __name__ == "__main__":
    sys.exit(main())
