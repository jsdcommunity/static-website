const
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    HtmlWebpackInjector = require('html-webpack-injector'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    Handlebars = require('handlebars'),
    
    fs = require('fs'),
    header = fs.readFileSync(__dirname + '/src/layout/header.html'),
    footer = fs.readFileSync(__dirname + '/src/layout/footer.html'),

    isProd = process.env.NODE_ENV==='production',

    resolve = p => path.resolve(__dirname,p),

    // Webpack configurations
    config = {
        mode: isProd ? 'production' : 'development',
        devtool: 'inline-source-map',
        devServer:{
            port: process.env.PORT || 3000,
            contentBase: path.join(__dirname, './dist'),
            overlay: true,
            open: true,
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
                        filename: 'images/[hash].[ext]'
                    }
                },
                {
                    test: /\.styl$/,
                    use: isProd ? [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        "css-loader",
                        "stylus-loader"
                    ] : [
                        'style-loader',
                        "css-loader",
                        "stylus-loader"
                    ]
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
                template: `./src/${data.html.replace('.html','').replace('.htm','')}.html`,
                filename: `${filename}.html`,
                chunks: data.chunks || [ filename ],
                favicon: data.favicon
            })
        )
        // Adding the javascript file for the page
        if(data.js) config.entry[data.jsfile || filename] = `./src/js/${data.js.replace('.js','')}.js`
    }

require('./webpack.entry.js').forEach(entry => pageFactory(entry))

if(isProd){
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename:'css/[name].[hash].css',
        }),
        new CleanWebpackPlugin()
    )
}

module.exports = config