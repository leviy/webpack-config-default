const { Config, environment } = require('@leviy/webpack-config');

const path = require('path');
const webpack = require('webpack');

const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefix = require('autoprefixer');

environment.setAll({
    env: () => process.env.WEBPACK_ENV,
});

const development = process.env.WEBPACK_ENV === 'development';

const mode = development ? 'development' : 'production';
const devtool = development ? 'inline-source-map' : '';

module.exports = new Config().defaults({
    mode: mode,
    devtool: devtool,
    entry: {
        app: [
            './public/src/scripts/app.js',
        ],
    },
    output: {
        filename: development ? '[name].js' : '[name].[hash].js',
    },
    module: {
        rules: [
            {
                test: /\.twig$/,
                loader: 'twigjs-loader',
                options: {
                    renderTemplate(twigData, dependencies) {
                        return `
                            ${dependencies}
                            var twig = require('${path.resolve(process.cwd(), 'node_modules/twig')}').twig;
                            var tpl = twig(${JSON.stringify(twigData)});
                            module.exports = function(context) { return tpl.render(context); };
                        `;
                    },
                },
            },
            {
                test: /\.js$/,
                exclude: /@babel(?:\/|\\{1,2})runtime|core-js/,
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
                            name: development ? 'images/[name].[ext]' : 'images/[name].[hash].[ext]',
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
            filename: development ? '[name].css' : '[name].[hash].css',
        }),
        new ManifestPlugin({
            basePath: 'dist/',
            publicPath: 'dist/',
        }),
    ],
});
