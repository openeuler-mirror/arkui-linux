#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Copyright (c) 2021-2022 Huawei Device Co., Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from glob import glob
from os import path
import os
import re
import shutil
import subprocess


class Test262Util:
    def __init__(self):
        self.header = re.compile(
            r"\/\*---(?P<header>.+)---\*\/", re.DOTALL)
        self.includes = re.compile(r"includes:\s+\[(?P<includes>.+)\]")
        self.includes2 = re.compile(r"includes:(?P<includes>(\s+-[^-].+)+)")
        self.flags = re.compile(r"flags:\s+\[(?P<flags>.+)\]")
        self.negative = re.compile(
            r"negative:.*phase:\s+(?P<phase>\w+).*type:\s+(?P<type>\w+)",
            re.DOTALL)
        self.async_ok = re.compile(r"Test262:AsyncTestComplete")

    def generate(self, revision, build_dir, harness_path, show_progress):
        dest_path = path.join(build_dir, 'test262')
        stamp_file = path.join(dest_path, 'test262.stamp')

        if path.isfile(stamp_file):
            return dest_path

        test262_path = path.join(path.sep, 'tmp', 'test262-%s' % revision)

        if not path.exists(test262_path):
            archive_file = path.join(path.sep, 'tmp', 'test262.zip')

            print("Downloading test262")

            cmd = ['wget', '-q', '-O', archive_file,
                   'https://github.com/tc39/test262/archive/%s.zip' % revision]

            if show_progress:
                cmd.append('--show-progress')

            return_code = subprocess.call(cmd)

            if return_code:
                raise Exception('Downloading test262 repository failed.')

            print("Extracting archive")
            if path.isdir(test262_path):
                shutil.rmtree(test262_path)

            return_code = subprocess.call(
                ['unzip', '-q', '-d', path.join(path.sep, 'tmp'), archive_file])

            if return_code:
                raise Exception(
                    'Failed to unzip test262 repository')

            os.remove(archive_file)

        print("Generating tests")
        src_path = path.join(test262_path, 'test')

        glob_expression = path.join(src_path, "**/*.js")
        files = glob(glob_expression, recursive=True)
        files = list(filter(lambda f: not f.endswith("FIXTURE.js"), files))

        with open(harness_path, 'r') as fp:
            harness = fp.read()

        harness = harness.replace('$SOURCE', '`%s`' % harness)

        for src_file in files:
            dest_file = src_file.replace(src_path, dest_path)
            os.makedirs(path.dirname(dest_file), exist_ok=True)
            self.create_file(src_file, dest_file, harness, test262_path)

        with open(stamp_file, 'w') as fp:
            pass

        return dest_path

    def create_file(self, input_file, output_file, harness, test262_dir):
        with open(input_file, 'r') as fp:
            input_str = fp.read()

        header = self.get_header(input_str)
        desc = self.parse_descriptor(header)

        out_str = header
        out_str += "\n"
        out_str += harness

        for include in desc['includes']:
            out_str += "//------------ %s start ------------\n" % include
            with open(path.join(test262_dir, 'harness', include), 'r') as fp:
                harness_str = fp.read()
            out_str += harness_str
            out_str += "//------------ %s end ------------\n" % include
            out_str += "\n"

        out_str += input_str
        with open(output_file, 'w') as o:
            o.write(out_str)

    def get_header(self, content):
        header_comment = self.header.search(content)
        assert header_comment
        return header_comment.group(0)

    def parse_descriptor(self, header):
        match = self.includes.search(header)
        includes = list(map(lambda e: e.strip(), match.group(
            'includes').split(','))) if match else []

        match = self.includes2.search(header)
        includes += list(map(lambda e: e.strip(), match.group(
            'includes').split('-')))[1:] if match else []

        includes.extend(['assert.js', 'sta.js'])

        match = self.flags.search(header)
        flags = list(map(lambda e: e.strip(),
                         match.group('flags').split(','))) if match else []

        if 'async' in flags:
            includes.extend(['doneprintHandle.js'])

        match = self.negative.search(header)
        negative_phase = match.group('phase') if match else 'pass'
        negative_type = match.group('type') if match else ''

        # negative_phase: pass, parse, resolution, runtime
        return {
            'flags': flags,
            'negative_phase': negative_phase,
            'negative_type': negative_type,
            'includes': includes,
        }

    @staticmethod
    def validate_parse_result(return_code, std_err, desc, out):
        is_negative = (desc['negative_phase'] == 'parse')

        if return_code == 0:  # passed
            if is_negative:
                return False, False  # negative test passed

            return True, True  # positive test passed

        if return_code == 1:  # failed
            return is_negative and (desc['negative_type'] in out), False

        return False, False  # abnormal

    def validate_runtime_result(self, return_code, std_err, desc, out):
        is_negative = (desc['negative_phase'] == 'runtime') or (
            desc['negative_phase'] == 'resolution')

        if return_code == 0:  # passed
            if is_negative:
                return False  # negative test passed

            passed = (len(std_err) == 0)
            if 'async' in desc['flags']:
                passed = passed and bool(self.async_ok.match(out))
            return passed  # positive test passed?

        if return_code == 1:  # failed
            return is_negative and (desc['negative_type'] in std_err)

        return False  # abnormal
