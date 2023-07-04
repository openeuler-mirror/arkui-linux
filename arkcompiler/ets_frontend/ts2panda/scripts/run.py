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

Description: Compile ark front-end code with tsc
"""

import os
import sys
import subprocess
import argparse
import platform
import shutil


def parse_args():
    parser = argparse.ArgumentParser()

    parser.add_argument('--src-dir',
                        help='Source directory')
    parser.add_argument('--dist-dir',
                        help='Destination directory')
    parser.add_argument('--platform',
                        help='platform, as: linux, mac, win')
    parser.add_argument('--node',
                        help='node path')
    parser.add_argument("--node-modules",
                        help='path to node-modules exetuable')
    parser.add_argument("--buildMode",
                        help='buildMode, as: debug, release')
    parser.add_argument("--js2abc",
                        help='js2abc file')
    return parser.parse_args()


def set_env(node_dir):
    if platform.system() == "Windows":
        jsoner_format = ";"
    else:
        jsoner_format = ":"
    os.environ["PATH"] = f'{node_dir}{jsoner_format}{os.environ["PATH"]}'


def run_command(cmd, execution_path=os.getcwd()):
    print(" ".join(cmd) + " | execution_path: " + execution_path)
    proc = subprocess.Popen(cmd, cwd=execution_path)
    ret = proc.wait()
    assert not ret, f'\n{" ".join(cmd)} failed'


def node_modules(options):
    src_dir = options.src_dir
    dist_dir = options.dist_dir
    run_command(['cp', '-f', os.path.join(src_dir, "package.json"),
                 os.path.join(dist_dir, "package.json")])
    run_command(['cp', '-f', os.path.join(src_dir, "package-lock.json"),
                 os.path.join(dist_dir, "package-lock.json")])

    if options.node_modules:
        run_command(['cp', '-rf', options.node_modules,
                     os.path.join(dist_dir, "node_modules")])
    else:
        run_command(['npm', 'install'], dist_dir)


def per_platform_config(options, inp_dir):
    dist_dir = options.dist_dir
    if os.path.exists(os.path.join(dist_dir, inp_dir)):
        shutil.rmtree(os.path.join(dist_dir, inp_dir), ignore_errors=True)
    cmd = ['mv', 'dist', inp_dir]
    run_command(cmd, dist_dir)
    run_command(['cp', '-f', "package.json",
                 "./{}/package.json".format(inp_dir)], dist_dir)
    run_command(['cp', '-f', "package-lock.json",
                 "./{}/package-lock.json".format(inp_dir)], dist_dir)
    (js2abc_dir, _) = os.path.split(options.js2abc)
    build_dir = os.path.join(js2abc_dir, inp_dir)
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    run_command(['cp', '-r', os.path.join(dist_dir, inp_dir), js2abc_dir])
    bin_dir = os.path.join(build_dir, 'bin')
    if not os.path.exists(bin_dir):
        os.mkdir(bin_dir)
    run_command(['cp', '-f', options.js2abc, bin_dir])
    obj_bin_dir = os.path.join(dist_dir, inp_dir, 'bin/')
    if not os.path.exists(obj_bin_dir):
        os.mkdir(obj_bin_dir)
    run_command(['cp', '-f', options.js2abc, obj_bin_dir])
    run_command(['cp', '-r', os.path.join(dist_dir,"node_modules"),
                os.path.join(dist_dir, inp_dir)])


def npm_run_build(options):
    plat_form = options.platform
    os.chdir(options.dist_dir)
    webpack = "node_modules/webpack/bin/webpack.js"

    cmd = [webpack,  '--config', 'webpack.config.js', '--progress',
           '--env', 'buildMode={}'.format(options.buildMode)]
    if os.getenv("NO_DEVTOOL"):
        cmd += ['--no-devtool']
    run_command(cmd, options.dist_dir)
    if plat_form == "linux":
        per_platform_config(options, "build")
    elif plat_form == "win":
        per_platform_config(options, "build-win")
    elif plat_form == 'mac':
        per_platform_config(options, "build-mac")


def main():
    args = parse_args()
    set_env(args.node)
    if not os.path.exists(os.path.join(args.dist_dir, "node_modules")):
        node_modules(args)
    npm_run_build(args)


if __name__ == "__main__":
    sys.exit(main())
