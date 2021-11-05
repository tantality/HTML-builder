const fs = require("fs");
const path = require("path");
const readStream=fs.createReadStream(path.join(__dirname,'text.txt'),'utf8');
readStream.on('error', (err) => console.log(`${err}`));
readStream.on('data',(data)=>console.log(data));