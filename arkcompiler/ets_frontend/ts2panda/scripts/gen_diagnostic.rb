#!/usr/bin/env ruby
# Copyright (c) 2021 Huawei Device Co., Ltd.
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

require 'optparse'
require 'yaml'
require 'json'
require 'erb'

module Gen
  def self.on_require(data); end
end

require_relative  ('diagnostic')

def create_sandbox
  # nothing but Ruby core libs and 'required' files
  binding
end

def check_option(optparser, options, key)
  return if options[key]

  puts "Missing option: --#{key}"
  puts optparser
  exit false
end

options = OpenStruct.new

optparser = OptionParser.new do |opts|
  opts.banner = 'Usage: gen.rb [options]'

  opts.on('-t', '--template FILE', 'Template for file generation (required)')
  opts.on('-d', '--datafile FILE', 'Source data in JSON format (required)')
  opts.on('-o', '--output FILE', 'Output file (required)')
  opts.on('-r', '--require foo,bar,baz', Array, 'List of files to be required for generation')

  opts.on('-h', '--help', 'Prints this help') do
    puts opts
    exit
  end
end
optparser.parse!(into: options)

check_option(optparser, options, :datafile)
check_option(optparser, options, :template)
check_option(optparser, options, :output)

template_file = File.read(options.template)
output_file = File.open(options.output, 'w')

data = YAML.load_file(options.datafile)
data = JSON.parse(data.to_json)
options&.require&.each { |r| require r }
Gen.on_require(data)

t = ERB.new(template_file, nil, '%-')
t.filename = options.template

output_file.write(t.result(create_sandbox))
output_file.close
