var jade = require('pug');
var fs = require("fs")
var html=fs.readFileSync("./10-first-demo.pug").toString("utf8")
var template = jade.compile(html);
var result = template({});
console.log(result)
