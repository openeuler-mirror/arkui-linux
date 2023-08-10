#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Copyright (c) 2022 Huawei Device Co., Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
import sys
import argparse
import subprocess
import ssl
import shutil
import importlib
import time
from multiprocessing import cpu_count
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import partial
from urllib.request import urlopen
import urllib.error
from scripts.util.file_utils import read_json_file

def _run_cmd(cmd):
    res = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE,
                           stderr=subprocess.PIPE)
    sout, serr = res.communicate()
    return sout.rstrip().decode('utf-8'), serr, res.returncode

def _check_sha256(check_url, local_file):
    check_sha256_cmd = 'curl -s -k ' + check_url + '.sha256'
    local_sha256_cmd = 'sha256sum ' + local_file + "|cut -d ' ' -f1"
    check_sha256, err, returncode = _run_cmd(check_sha256_cmd)
    local_sha256, err, returncode = _run_cmd(local_sha256_cmd)
    return check_sha256 == local_sha256

def _check_sha256_by_mark(args, check_url, code_dir, unzip_dir, unzip_filename):
    check_sha256_cmd = 'curl -s -k ' + check_url + '.sha256'
    check_sha256, err, returncode = _run_cmd(check_sha256_cmd)
    mark_file_dir = os.path.join(code_dir, unzip_dir)
    mark_file_name = check_sha256 + '.' + unzip_filename + '.mark'
    mark_file_path = os.path.join(mark_file_dir, mark_file_name)
    args.mark_file_path = mark_file_path
    return os.path.exists(mark_file_path)

def _config_parse(config, tool_repo):
    parse_dict = dict()
    parse_dict['unzip_dir'] = config.get('unzip_dir')
    parse_dict['huaweicloud_url'] = tool_repo + config.get('file_path')
    parse_dict['unzip_filename'] = config.get('unzip_filename')
    md5_huaweicloud_url_cmd = 'echo ' + parse_dict.get('huaweicloud_url') + "|md5sum|cut -d ' ' -f1"
    parse_dict['md5_huaweicloud_url'], err, returncode = _run_cmd(md5_huaweicloud_url_cmd)
    parse_dict['bin_file'] = os.path.basename(parse_dict.get('huaweicloud_url'))
    return parse_dict

def _uncompress(args, src_file, code_dir, unzip_dir, unzip_filename, mark_file_path):
    dest_dir = os.path.join(code_dir, unzip_dir)
    if src_file[-3:] == 'zip':
        cmd = 'unzip -o {} -d {};echo 0 > {}'.format(src_file, dest_dir, mark_file_path)
    elif src_file[-6:] == 'tar.gz':
        cmd = 'tar -xvzf {} -C {};echo 0 > {}'.format(src_file, dest_dir, mark_file_path)
    else:
        cmd = 'tar -xvf {} -C {};echo 0 > {}'.format(src_file, dest_dir, mark_file_path)
    _run_cmd(cmd)

    # npm install
    if os.path.basename(unzip_dir) == 'nodejs':
        _npm_install(args, code_dir, unzip_dir, unzip_filename)

def _copy_url(args, task_id, url, local_file, code_dir, unzip_dir, unzip_filename, mark_file_path, progress):
    # download files
    download_buffer_size = 32768
    progress.console.log('Requesting {}'.format(url))
    try:
        response = urlopen(url)
    except urllib.error.HTTPError as e:
        progress.console.log("Failed to open {}, HTTPError: {}".format(url, e.code), style='red')
    progress.update(task_id, total=int(response.info()["Content-length"]))
    with open(local_file, "wb") as dest_file:
        progress.start_task(task_id)
        for data in iter(partial(response.read, download_buffer_size), b""):
            dest_file.write(data)
            progress.update(task_id, advance=len(data))
    progress.console.log("Downloaded {}".format(local_file))

    # decompressing files
    progress.console.log("Decompressing {}".format(local_file))
    _uncompress(args, local_file, code_dir, unzip_dir, unzip_filename, mark_file_path)
    progress.console.log("Decompressed {}".format(local_file))

def _copy_url_disable_rich(args, url, local_file, code_dir, unzip_dir, unzip_filename, mark_file_path):
    # download files
    download_buffer_size = 32768
    print('Requesting {}, please wait'.format(url))
    try:
        response = urlopen(url)
    except urllib.error.HTTPError as e:
        print("Failed to open {}, HTTPError: {}".format(url, e.code))
    with open(local_file, "wb") as dest_file:
        for data in iter(partial(response.read, download_buffer_size), b""):
            dest_file.write(data)
    print("Downloaded {}".format(local_file))

    # decompressing files
    print("Decompressing {}, please wait".format(local_file))
    _uncompress(args, local_file, code_dir, unzip_dir, unzip_filename, mark_file_path)
    print("Decompressed {}".format(local_file))

def _hwcloud_download(args, config, bin_dir, code_dir):
    try:
        cnt = cpu_count()
    except:
        cnt = 1
    with ThreadPoolExecutor(max_workers=cnt) as pool:
        tasks = dict()
        for config_info in config:
            parse_dict = _config_parse(config_info, args.tool_repo)
            unzip_dir = parse_dict.get('unzip_dir')
            huaweicloud_url = parse_dict.get('huaweicloud_url')
            unzip_filename = parse_dict.get('unzip_filename')
            md5_huaweicloud_url = parse_dict.get('md5_huaweicloud_url')
            bin_file = parse_dict.get('bin_file')
            abs_unzip_dir = os.path.join(code_dir, unzip_dir)
            if not os.path.exists(abs_unzip_dir):
                os.makedirs(abs_unzip_dir)
            if _check_sha256_by_mark(args, huaweicloud_url, code_dir, unzip_dir, unzip_filename):
                if not args.disable_rich:
                    args.progress.console.log('{}, Sha256 markword check OK.'.format(huaweicloud_url), style='green')
                else:
                    print('{}, Sha256 markword check OK.'.format(huaweicloud_url))
                if os.path.basename(abs_unzip_dir) == 'nodejs':
                    _npm_install(args, code_dir, unzip_dir, unzip_filename)
            else:
                _run_cmd('rm -rf ' + code_dir + '/' + unzip_dir + '/*.' + unzip_filename + '.mark')
                _run_cmd('rm -rf ' + code_dir + '/' + unzip_dir + '/' + unzip_filename)
                local_file = os.path.join(bin_dir, md5_huaweicloud_url + '.' + bin_file)
                if os.path.exists(local_file):
                    if _check_sha256(huaweicloud_url, local_file):
                        if not args.disable_rich:
                            args.progress.console.log('{}, Sha256 check download OK.'.format(local_file), style='green')
                        else:
                            print('{}, Sha256 check download OK. Start decompression, please wait'.format(local_file))
                        task = pool.submit(_uncompress, args, local_file, code_dir, 
                                           unzip_dir, unzip_filename, args.mark_file_path)
                        tasks[task] = os.path.basename(huaweicloud_url)
                    else:
                        os.remove(local_file)
                else:
                    filename = huaweicloud_url.split("/")[-1]
                    if not args.disable_rich:
                        task_id = args.progress.add_task("download", filename=filename, start=False)
                        task = pool.submit(_copy_url, args, task_id, huaweicloud_url, local_file, code_dir,
                                        unzip_dir, unzip_filename, args.mark_file_path, args.progress)
                        tasks[task] = os.path.basename(huaweicloud_url)
                    else:
                        task = pool.submit(_copy_url_disable_rich, args, huaweicloud_url, local_file, code_dir,
                                           unzip_dir, unzip_filename, args.mark_file_path)
        for task in as_completed(tasks):
            if not args.disable_rich:
                args.progress.console.log('{}, download and decompress completed'.format(tasks.get(task)), style='green')
            else:
                print('{}, download and decompress completed'.format(tasks.get(task)))

def _npm_install(args, code_dir, unzip_dir, unzip_filename):
    procs = []
    skip_ssl_cmd = ''
    unsafe_perm_cmd = ''
    os.environ['PATH'] = '{}/{}/{}/bin:{}'.format(code_dir, unzip_dir, unzip_filename, os.environ.get('PATH'))
    for install_info in args.npm_install_config:
        full_code_path = os.path.join(code_dir, install_info)
        if os.path.exists(full_code_path):
            npm = '{}/{}/{}/bin/npm'.format(code_dir, unzip_dir, unzip_filename)
            if args.skip_ssl:
                skip_ssl_cmd = '{} config set strict-ssl false;'.format(npm)
            if args.unsafe_perm:
                unsafe_perm_cmd = '--unsafe-perm;'
            cmd = 'cd {};{}{} cache clean -f;{} install --registry {} {}'.format(
                      full_code_path, skip_ssl_cmd, npm, npm, args.npm_registry, unsafe_perm_cmd)
            proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            # wait proc Popen with 0.1 second
            time.sleep(0.1)
            procs.append(proc)
        else:
            raise Exception("{} not exist, it shouldn't happen, pls check...".format(full_code_path))
    for proc in procs:
        out, err = proc.communicate()
        if proc.returncode:
            raise Exception(err.decode())

def _node_modules_copy(config, code_dir, enable_symlink):
    for config_info in config:
        src_dir = os.path.join(code_dir, config_info.get('src'))
        dest_dir = os.path.join(code_dir, config_info.get('dest'))
        use_symlink = config_info.get('use_symlink')
        if os.path.exists(os.path.dirname(dest_dir)):
            shutil.rmtree(os.path.dirname(dest_dir))
        if use_symlink == 'True' and enable_symlink == True:
            os.makedirs(os.path.dirname(dest_dir))
            os.symlink(src_dir, dest_dir)
        else:
            shutil.copytree(src_dir, dest_dir, symlinks=True)

def _file_handle(config, code_dir):
    for config_info in config:
        src_dir = code_dir + config_info.get('src')
        dest_dir = code_dir + config_info.get('dest')
        tmp_dir = config_info.get('tmp')
        symlink_src = config_info.get('symlink_src')
        symlink_dest = config_info.get('symlink_dest')
        rename = config_info.get('rename')
        if os.path.exists(src_dir):
            if tmp_dir:
                tmp_dir = code_dir + tmp_dir
                shutil.move(src_dir, tmp_dir)
                cmd = 'mv {}/*.mark {}'.format(dest_dir, tmp_dir)
                _run_cmd(cmd)
                if os.path.exists(dest_dir):
                    shutil.rmtree(dest_dir)
                shutil.move(tmp_dir, dest_dir)
            elif rename:
                if os.path.exists(dest_dir):
                    shutil.rmtree(dest_dir)
                shutil.move(src_dir, dest_dir)
                if symlink_src and symlink_dest:
                    os.symlink(dest_dir + symlink_src, dest_dir + symlink_dest)
            else:
                _run_cmd('chmod 755 {} -R'.format(dest_dir))

def _import_rich_module():
    module = importlib.import_module('rich.progress')
    progress = module.Progress(
        module.TextColumn("[bold blue]{task.fields[filename]}", justify="right"),
        module.BarColumn(bar_width=None),
        "[progress.percentage]{task.percentage:>3.1f}%",
        "•",
        module.DownloadColumn(),
        "•",
        module.TransferSpeedColumn(),
        "•",
        module.TimeRemainingColumn(),
    )
    return progress

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--skip-ssl', action='store_true', help='skip ssl authentication')
    parser.add_argument('--unsafe-perm', action='store_true', help='add "--unsafe-perm" for npm install')
    parser.add_argument('--disable-rich', action='store_true', help='disable the rich module')
    parser.add_argument('--enable-symlink', action='store_true', help='enable symlink while copying node_modules')
    parser.add_argument('--tool-repo', default='https://repo.huaweicloud.com', help='prebuilt file download source')
    parser.add_argument('--npm-registry', default='https://repo.huaweicloud.com/repository/npm/',
                        help='npm download source')
    parser.add_argument('--host-cpu', help='host cpu', required=True)
    parser.add_argument('--host-platform', help='host platform', required=True)
    args = parser.parse_args()
    args.code_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if args.skip_ssl:
        ssl._create_default_https_context = ssl._create_unverified_context

    host_platform = args.host_platform
    host_cpu = args.host_cpu
    tool_repo = args.tool_repo
    config_file = os.path.join(args.code_dir, 'build/prebuilts_download_config.json')
    config_info = read_json_file(config_file)
    args.npm_install_config = config_info.get('npm_install_path')
    node_modules_copy_config = config_info.get('node_modules_copy')
    file_handle_config = config_info.get('file_handle_config')

    args.bin_dir = os.path.join(args.code_dir, config_info.get('prebuilts_download_dir'))
    if not os.path.exists(args.bin_dir):
        os.makedirs(args.bin_dir)
    copy_config = config_info.get(host_platform).get(host_cpu).get('copy_config')
    node_config = config_info.get(host_platform).get('node_config')
    copy_config.extend(node_config)
    if host_platform == 'linux':
        linux_copy_config = config_info.get(host_platform).get(host_cpu).get('linux_copy_config')
        copy_config.extend(linux_copy_config)
    elif host_platform == 'darwin':
        darwin_copy_config = config_info.get(host_platform).get(host_cpu).get('darwin_copy_config')
        copy_config.extend(darwin_copy_config)
    if args.disable_rich:
        _hwcloud_download(args, copy_config, args.bin_dir, args.code_dir)
    else:
        args.progress = _import_rich_module()
        with args.progress:
            _hwcloud_download(args, copy_config, args.bin_dir, args.code_dir)

    _file_handle(file_handle_config, args.code_dir)
    _node_modules_copy(node_modules_copy_config, args.code_dir, args.enable_symlink)

if __name__ == '__main__':
    sys.exit(main())
