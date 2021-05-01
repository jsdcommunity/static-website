const
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    HtmlWebpackInjector = require('html-webpack-injector'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),

    isProd = process.env.NODE_ENV==='production',

    resolve = p => path.resolve(__dirname,p),

    // Webpack configurations
    config = {
        mode: isProd ? 'production' : 'development',
        devtool: 'inline-source-map',
        devServer:{
            port: process.env.PORT || 3000,
            contentBase: path.join(__dirname, '../dist'),
            overlay: true,
            open: true,
            openPage: '/acceleration.html',
            hot: true,
            publicPath: '/'
        },
        plugins:[
            new HtmlWebpackInjector()
        ],
        entry:{},
        output:{
            filename: 'js/[name].[chunkhash].js',
            path: resolve('dist'),
            publicPath: '/'
        },
        resolve:{
            alias:{
                "@": resolve('src')
            }
        },
        module:{
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
                }
            ]
        }
    },

    pageFactory = data => {
        const filename = data.filename || data.html.split('/').pop().split('.')[0];
        // Adding the html files
        config.plugins.unshift(
            new HtmlWebpackPlugin({
                inject: true,
                minify: isProd ? {
                    removeAttributeQuotes: false,
                    collapseWhitespace: false,
                    removeComments: false
                } : null,
                template: data.html,
                filename: `${filename}.html`,
                chunks: data.chunks,
                favicon: data.favicon
            })
        )
        // Adding the javascript file for the page
        config.entry[filename] = data.js
    }

require('./webpack.entry.js').forEach(entry => pageFactory(entry))

console.log(config)

module.exports = config