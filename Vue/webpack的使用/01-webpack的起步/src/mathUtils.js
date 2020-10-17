function add(num1,num2){
    return num1 + num2
}

function mul(num1,num2){
    return num1 * num2
}

//模块化导出 add、mul
module.exports = {
    add,
    mul
}