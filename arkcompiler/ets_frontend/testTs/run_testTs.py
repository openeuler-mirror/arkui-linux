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
import subprocess
import argparse
import datetime
import sys
import shutil
import json
from glob import glob
from utils import *
from config import *


class MyException(Exception):
    def __init__(self, name):
        self.name = name


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--testinstype', action='store_true', dest='testinstype', default=False, help="ins type test")
    parser.add_argument('--dir', metavar='DIR', help="Directory to test")
    parser.add_argument('--file', metavar='FILE', help="File to test")
    parser.add_argument(
        '--ark_frontend_tool',
        help="ark frontend conversion tool")
    arguments = parser.parse_args()
    return arguments


def skip(filepath, flag=False):
    with open(SKIP_FILE_PATH, 'r') as read_skip:
        sk_content = read_skip.read()
        skip_test = json.loads(sk_content)
        skip_test_list = skip_test['error.txt'] + skip_test['no2015'] + skip_test['tsc_error'] + \
            skip_test['import_skip'] + \
            skip_test['code_rule'] + skip_test['no_case'] + skip_test['not_supported_by_4.2.3']
        if os.path.isfile(filepath):
            if filepath.endswith('.ts'):
                if filepath not in skip_test_list:
                    return True
                else:
                    if flag:
                        print(
                            f'This file is outside the scope of validation : {filepath}\n')
                    return False


def abc_judge(filepath):
    if not os.path.getsize(filepath):
        print(f'Error : {filepath}.The file is empty')


def run_test(file, tool, flag=False):
    path_list = file.split(os.sep)
    if path_list[0] != '.':
        file = "." + os.sep + file
    out_file_path = file.replace(TEST_PATH, OUT_PATH).replace(TS_EXT, TXT_EXT)
    temp_out_file_path = file.replace(TS_EXT, TXT_EXT)
    temp_abc_file_path = file.replace(TS_EXT, ABC_EXT)
    ts_list = temp_out_file_path.split(os.sep)
    ts_list.pop(-1)
    ts_dir_path = os.sep.join(ts_list)
    path_list = out_file_path.split(os.sep)
    path_list.pop(-1)
    out_dir_path = os.sep.join(path_list)
    if not os.path.exists(out_dir_path):
        os.makedirs(out_dir_path)
    try:
        if file in IMPORT_TEST['import'] + IMPORT_TEST['m_parameter']:
            command_os(['node', '--expose-gc', tool, '-m', file, '--output-type'])
        else:
            command_os(['node', '--expose-gc', tool, file, '--output-type'])
    except BaseException as e:
        print(e)
    if flag:
        for root, dirs, files in os.walk(ts_dir_path):
            for fi in files:
                ts_file = f'{root}/{fi}'
                if ABC_EXT in ts_file:
                    remove_file(ts_file)
                elif TXT_EXT in ts_file:
                    sj_path = ts_file.replace(TEST_PATH, OUT_PATH)
                    move_file(ts_file, sj_path)
    else:
        if os.path.exists(temp_abc_file_path):
            abc_judge(temp_abc_file_path)
            remove_file(temp_abc_file_path)
        if os.path.exists(temp_out_file_path):
            move_file(temp_out_file_path, out_file_path)


def run_test_machine(args):
    ark_frontend_tool = DEFAULT_ARK_FRONTEND_TOOL
    result_path = []
    if args.ark_frontend_tool:
        ark_frontend_tool = args.ark_frontend_tool

    if args.file:
        if skip(args.file, True):
            if args.file in IMPORT_TEST['import']:
                run_test(args.file, ark_frontend_tool, True)
                result = compare(args.file, True)
                result_path.append(result)
            else:
                run_test(args.file, ark_frontend_tool)
                result = compare(args.file)
                result_path.append(result)

    elif args.dir:
        for root, dirs, files in os.walk(args.dir):
            for file in files:
                test_path = f'{root}/{file}'
                if skip(test_path, True):
                    if test_path in IMPORT_TEST['import']:
                        run_test(test_path, ark_frontend_tool, True)
                        result = compare(test_path, True)
                        result_path.append(result)
                    else:
                        run_test(test_path, ark_frontend_tool)
                        result = compare(test_path)
                        result_path.append(result)

    elif args.file is None and args.dir is None:
        for root, dirs, files in os.walk(TS_CASES_DIR):
            for file in files:
                test_path = f'{root}/{file}'
                if skip(test_path):
                    if test_path in IMPORT_TEST['import']:
                        run_test(test_path, ark_frontend_tool, True)
                        result = compare(test_path, True)
                        result_path.append(result)
                    else:
                        run_test(test_path, ark_frontend_tool)
                        result = compare(test_path)
                        result_path.append(result)
    with open(OUT_RESULT_FILE, 'w') as read_out_result:
        read_out_result.writelines(result_path)


def read_out_file(file_path):
    with open(file_path, 'r') as read_file_path:
        out_content = read_file_path.read()
    if out_content:
        if '}\n{' in out_content:
            out_list = out_content.split('}\n{')
        else:
            out_list = []
            out_list.append(''.join(out_content.split('\n')))
    else:
        out_list = []
    out_text_list = []
    if len(out_list) > 1:
        for i in range(len(out_list)):
            if i == 0:
                out_do = ''.join(out_list[i].split('\n')).strip(' ') + '}'
            elif i == (len(out_list) - 1):
                out_do = '{' + ''.join(out_list[i].split('\n')).strip(' ')
            else:
                out_do = (
                    '{' +
                    ''.join(
                        out_list[i].split('\n')).strip(' ') +
                    '}')
            out_txt = json.loads(out_do)
            out_text_list.append(out_txt)
    else:
        for i in range(len(out_list)):
            c = json.loads(out_list[i])
            out_text_list.append(c)
    return out_text_list


def compare(file, flag=False):
    result = ""
    path_list = file.split(os.sep)
    if path_list[0] != '.':
        file = "." + os.sep + file
    out_path = file.replace(TEST_PATH, OUT_PATH).replace(TS_EXT, TXT_EXT)
    expect_path = file.replace(TEST_PATH, EXPECT_PATH).replace(TS_EXT, TXT_EXT)
    if flag:
        path_list = out_path.split(os.sep)
        del path_list[-1]
        out_dir_path = os.sep.join(path_list)
        for root, dirs, files in os.walk(out_dir_path):
            for fi in files:
                fi = f'{root}/{fi}'
                if fi != out_path:
                    with open(fi, 'r') as read_out_txt:
                        el_file_txt = read_out_txt.read()
                        write_append(out_path, el_file_txt)
                        remove_file(fi)
    if (not os.path.exists(out_path) or not os.path.exists(expect_path)):
        print("There are no expected files or validation file generation: %s", file)
        result = f'FAIL {file}\n'
    else:
        outcont = read_out_file(out_path)
        expectcont = read_file(expect_path)
        expectcontlist = []
        for i in expectcont:
            i = json.loads(i.replace("'", '"').replace('\n', ''))
            expectcontlist.append(i)
        if outcont == expectcontlist:
            result = f'PASS {file}\n'
        else:
            result = f'FAIL {file}\n'
    print(result)
    return result


def summary():
    if not os.path.exists(OUT_RESULT_FILE):
        return 1
    count = -1
    fail_count = 0
    with open(OUT_RESULT_FILE, 'r') as read_outfile:
        for count, line in enumerate(read_outfile):
            if line.startswith("FAIL"):
                fail_count += 1
            pass
    count += 1

    print("\n      Regression summary")
    print("===============================")
    print("     Total         %5d         " % (count))
    print("-------------------------------")
    print("     Passed tests: %5d         " % (count - fail_count))
    print("     Failed tests: %5d         " % (fail_count))
    print("===============================")

    return 0 if fail_count == 0 else 1


def init_path():
    remove_dir(OUT_TEST_DIR)
    mk_dir(OUT_TEST_DIR)


def prepare_ts_code():
    if (os.path.exists(TS_CASES_DIR)):
        return
    try:
        mk_dir(TS_CASES_DIR)
        os.chdir('./testTs/test')
        command_os(['git', 'init'])
        command_os(['git', 'remote', 'add', 'origin', TS_GIT_PATH])
        command_os(['git', 'config', 'core.sparsecheckout', 'true'])
        with os.fdopen(os.open('.git/info/sparse-checkout', os.O_APPEND|os.O_CREAT|os.O_WRONLY)) as outf:
            subprocess.Popen(['echo', "tests/cases/conformance/"], stdout=outf)
        command_os(['git', 'pull', '--depth', '1', 'origin', TS_TAG])
        if not os.path.exists("./tests/cases/conformance/"):
            remove_dir(TS_CASES_DIR)
            raise MyException(
                "Pull TypeScript Code Fail, Please Check The Network Request")
        command_os(['git', 'apply', '../test-case.patch'])
        command_os(['cp', '-r', './tests/cases/conformance/.', './'])
        command_os(['rm', '-rf', './tests'])
        command_os(['rm', '-rf', '.git'])
        os.chdir('../../')
    except BaseException:
        print("pull test code fail")


def test_instype(args):
    # output path for abc file generation
    outpath = os.path.join(OUT_TEST_DIR, 'instype')
    mk_dir(outpath)

    # source ts files
    files = glob(os.path.join(CUR_FILE_DIR, './instype/*.ts'));
    ark_frontend_tool = DEFAULT_ARK_FRONTEND_TOOL
    if args.ark_frontend_tool:
        ark_frontend_tool = args.ark_frontend_tool

    fail_list = []
    for file in files:
        abc_file = os.path.abspath(os.path.join(outpath, '%s.abc' % os.path.splitext(os.path.basename(file))[0]))
        cmd = ['node', '--expose-gc', ark_frontend_tool, os.path.abspath(file),
               '--modules', '--display-typeinfo', '-o', abc_file];
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        try:
            out, err = process.communicate(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()
            fail_list.append(file)
            print("TIMEOUT:", " ".join(cmd))
            continue
        output = out.decode("utf-8", errors="ignore") + err.decode("utf-8", errors="ignore")

        expected_file = "%s-expected.txt" % (os.path.splitext(file)[0])
        expected = ""
        try:
            with open(expected_file, 'r') as expected_fp:
                expected = expected_fp.read()
            passed = expected == output
        except Exception:
            passed = False
        if not passed:
            fail_list.append(file)
            print("FAILED:", " ".join(cmd))
            print("output:")
            print(output)
            print("expected:")
            print(expected)

    print("Summary:")
    print("\033[37mTotal:   %5d" % (len(files)))
    print("\033[92mPassed:  %5d" % (len(files) - len(fail_list)))
    print("\033[91mFailed:  %5d" % (len(fail_list)))
    print("\033[0m")

    return 0 if len(fail_list) == 0 else 1

def main(args):
    try:
        init_path()
        if (args.testinstype):
            excuting_npm_install(args)
            return test_instype(args)
        else:
            excuting_npm_install(args)
            prepare_ts_code()
            run_test_machine(args)
            return summary()
    except BaseException:
        print("Run Python Script Fail")
        return 1


if __name__ == "__main__":
    sys.exit(main(parse_args()))
