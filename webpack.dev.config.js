var path = require('path');


module.exports = {
    mode:'development',
    devtool:'inline-cheap-module-source-map',
    entry:  path.resolve(__dirname,'./index.js'),
    entry:{
        content:path.resolve(__dirname,'./content/index.js'),
        background:path.resolve(__dirname,'./background/index.js'),
        popup:path.resolve(__dirname,'./popup/index.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    }
};