const path = require("path");
module.exports = {
    entry: "./src/new/Main.js",
    output: {
        filename: "main.js",
        path: path.join(__dirname, "buildTest")
    },
    module: {
        rules: [
            { test: /\.css$/i, use: ["style-loader", "css-loader"] }
        ]
    },
    mode: "production",
    stats: {
        warnings: false
    }
};