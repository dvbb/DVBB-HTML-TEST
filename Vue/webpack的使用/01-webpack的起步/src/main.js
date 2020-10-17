//1、commonjs的模块化规范 导入 add、mul
const {add,mul} = require('./mathUtils')

console.log(add(20,40));
console.log(mul(20,40));

//2、ES6的模块化规范 导入 name、age、height
import {name,age,height} from "./info";
console.log(name);
console.log(age);
console.log(height);

