const path = require("path");
module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.join(__dirname, "build")
    },
    module: {
        rules: [
            { test: /\.css$/i, use: ["style-loader", "css-loader"] }
        ]
    },
    mode: "development",
    stats: {
        warnings: false
    }
};