const { Config, environment } = require('webpack-config');

const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefix = require('autoprefixer');

environment.setAll({
    env: () => process.env.WEBPACK_ENV,
});

const mode = process.env.WEBPACK_ENV === 'development' ? 'development' : 'production';
const devtool = process.env.WEBPACK_ENV === 'development' ? 'inline-source-map' : '';

module.exports = new Config().defaults({
    mode: mode,
    devtool: devtool,
    entry: {
        app: [
            './public/src/scripts/app.js',
        ],
    },
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.twig$/,
                loader: 'twig-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(bootstrap)\/).*/,
                loader: 'babel-loader',
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefix,
                            ],
                        },
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[hash:8].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
});
