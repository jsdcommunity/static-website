const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInjector = require('html-webpack-injector');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Handlebars = require('handlebars');
const fs = require('fs');

const header = fs.readFileSync(__dirname + '/src/layout/header.html')
const footer = fs.readFileSync(__dirname + '/src/layout/footer.html')

const resolve = p => path.resolve(__dirname, p);

const config = {
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                removeComments: false
            },
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['index'],
        }),
        new HtmlWebpackInjector(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[fullhash].css',
        }),
        new CleanWebpackPlugin()
    ],
    entry: {
        index: './src/js/scripts.js',
    },
    output: {
        filename: 'js/[name].[chunkhash].js',
        path: resolve('dist/'),
        publicPath: '/static-website/'
    },
    resolve: {
        alias: {
            "@": resolve("src")
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(html)$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            preprocessor: (content, loaderContext) => {
                                let result;

                                try {
                                    result = Handlebars.compile(content)({
                                        header,
                                        footer
                                    });
                                } catch (error) {
                                    loaderContext.emitError(error);

                                    return content;
                                }

                                return result;
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[contenthash].[ext]'
                }
            },
            {
                test: /\.styl$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    "css-loader",
                    {
                        loader: "postcss-loader"
                    },
                    "stylus-loader"
                ]
            }

        ]
    }
}

module.exports = config;