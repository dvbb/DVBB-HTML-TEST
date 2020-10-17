//导入node中的path包
//这里导入的是全局变量中的path
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        //__dirname为当前文件(webpack.config.js)所在的路径
        //然后再该路径下找到dist
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}