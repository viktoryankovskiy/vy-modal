const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const entryPath = './app';
const distPath = 'dist';
const outputJsName = 'modal.min.js';
const outputCssName = 'modal.min.css';
const entrySCSSName = 'modal';
const entryJSName = 'modal.js';

const config = {
    watch: true,
    entry: [`${entryPath}/js/${entryJSName}`, `${entryPath}/scss/${entrySCSSName}.scss`],
    output: {
        path: path.resolve(__dirname, distPath),
        filename: `${outputJsName}`,
        clean: true
    },
    resolve: {
        extensions: [
            '.js',
            '.scss'
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `${outputCssName}`,
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./dist/*.css', './dist/*.js']
        }),
    ],
};

module.exports = config;