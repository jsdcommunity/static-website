const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInjector = require("html-webpack-injector");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLTemplates = require("./config/html_templates");

const resolve = p => path.resolve(__dirname, p);

const config = {
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        removeComments: false,
      },
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackInjector(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[fullhash].css",
    }),
    new CleanWebpackPlugin(),
  ],
  entry: {
    index: "./src/js/scripts.js",
  },
  output: {
    filename: "js/[name].[chunkhash].js",
    path: resolve("static-website/"),
    // Using "/static-website/" for github pages, because
    // github pages will host this as "https://jsdcommunity.github.io/static-website/"
    // so for pages to find assets they have to look on this child directory
    publicPath: "/static-website/",
  },
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(html)$/,
        use: [HTMLTemplates],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[contenthash].[ext]",
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          {
            loader: "postcss-loader",
          },
          "sass-loader",
        ],
      },
    ],
  },
};

module.exports = config;
