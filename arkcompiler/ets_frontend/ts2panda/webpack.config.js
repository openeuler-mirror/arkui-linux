/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// the path(s) that should be cleaned
let pathsToClean = ['dist'];

// the clean options to use
let cleanOptions = {
    root: path.resolve(__dirname),
    verbose: true,
    dry: false,
};

function initConfig(config, envArgs) {
    console.log(envArgs.buildMode)
    Object.assign(config, {
        optimization: {
            minimize: envArgs.buildMode !== 'debug'
        },
        resolve: {
            extensions: ['.js', '.ts'],
        },
        devtool: 'source-map',
        mode: 'development',
        entry: {
            'index': './src/index.ts',
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist/src'),
            libraryTarget: 'commonjs',
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: path.resolve(__dirname, './tsconfig.json'),
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [new CleanWebpackPlugin(pathsToClean, cleanOptions)],
        target: 'node',
        node:{
            __dirname: false,
            __filename: false,
            global: false
        }
    });
}

module.exports = (env, argv) => {
    const config = {};
    initConfig(config, env)
    return config;
};
