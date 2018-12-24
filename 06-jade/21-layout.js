var jade = require('pug');
var fs = require("fs")
var html=fs.readFileSync("./layout.pug").toString("utf8")
var template = jade.compile(html);
var result = template({});
console.log(result)
