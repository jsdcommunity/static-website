const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInjector = require('html-webpack-injector')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Handlebars = require('handlebars')

const fs = require('fs')
const header = fs.readFileSync(__dirname + '/src/layout/header.html')
const footer = fs.readFileSync(__dirname + '/src/layout/footer.html')

const resolve = p => path.resolve(__dirname, p)

const config = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: process.env.PORT || 3000,
        contentBase: path.join(__dirname, './dist'),
        watchContentBase: true,
        overlay: true,
        open: true,
        hot: true,
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            // minify: null,
            template: './src/index.html',
            filename: 'index.html',
            chunks: 'index',
            // favicon: 
        }),
        new HtmlWebpackInjector()
    ],
    entry: {
        index: './src/js/scripts.js',
    },
    output: {
        filename: 'js/[name].[chunkhash].js',
        path: resolve('dist/'),
        publicPath: '/'
    },
    resolve: {
        alias: {
            "@": resolve('src')
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
                    'style-loader',
                    "css-loader",
                    "stylus-loader"
                ]
            }
        ]
    }
}

module.exports = config