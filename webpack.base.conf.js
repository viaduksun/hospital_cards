const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PATHS = {
  src: path.join(__dirname, "./src"),
  dist: path.join(__dirname, "./dist"),
  assets: "assets",
};

module.exports = {
  externals: {
    paths: PATHS,
  },
  entry: ["babel-polyfill", `${PATHS.src}/js/main.js`],
  // {
  //   app: `${PATHS.src}/js/main.js`,
  // },
  output: {
    filename: `${PATHS.assets}/js/[name].js`,
    path: PATHS.dist,
    publicPath: `/${PATHS.assets}/`,
    clean: true,
    // libraryExport: "default",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendors",
          test: /node_modules/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: "/node_modules/",
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },

      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  require("autoprefixer"),
                  require("cssnano"),
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          // "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: { esModule: false },
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  require("autoprefixer"),
                  require("cssnano"),
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          url: false,
        },
      },
      {
        test: /\.html$/,
        exclude: [/node_modules/, require.resolve("./src/index.html")],
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}/css/[name].css`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/img`, to: `${PATHS.assets}/img` },
        { from: `${PATHS.src}/fonts`, to: `${PATHS.assets}/fonts` },
        { from: `${PATHS.src}/static`, to: `${PATHS.dist}/static` },
      ],
    }),
    new HtmlWebpackPlugin({
      hash: false,
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
};
