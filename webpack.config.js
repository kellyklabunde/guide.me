const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const dotenv = require('dotenv');
dotenv.config();

module.exports = () => ({
    entry: [
        "@babel/polyfill",
        path.join(__dirname, "client", "style.css"),
        path.join(__dirname, "client", "src", "start.js"),
    ],
    output: {
        path: path.join(__dirname, "client", "public"),
        filename: "bundle.js",
    },
    performance: {
        hints: false,
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "client", "public"),
        },
        proxy: {
            "/": {
                target: "http://localhost:3001",
            },
            "/socket.io": {
                target: "http://localhost:3001",
                ws: true,
            },
        },
        historyApiFallback: true,
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "bundle.css",
        }),
        new webpack.DefinePlugin({
            'process.env.AWS_KEY': JSON.stringify(process.env.AWS_KEY),
            'process.env.AWS_SECRET': JSON.stringify(process.env.AWS_SECRET),
            'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
        }),
    ],
});
