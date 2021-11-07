const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const pathToDir=__dirname;
const pathToStylesDir=path.join(pathToDir,'styles');
const pathToProjectDistDir=path.join(pathToDir,'project-dist');
const writeStream=fs.createWriteStream(path.join(pathToProjectDistDir,'bundle.css'),{flags:'w'});
writeStream.on('error', err => process.exit(err.message));

function generateCssFile(){
    getFolderContent()
    .then(getCssFileNames)
    .then(getFileContent)
}

function getFolderContent(){
    return fsPromises.readdir(pathToStylesDir,{withFileTypes:true}).catch(err=>process.exit(err.message));
}

function getCssFileNames(content){
    content=content.filter(elem=>elem.isFile() && path.extname(elem.name).toLowerCase()=='.css').map(elem=>elem.name);
    return content.length!=0? content: process.exit(`The folder doesn't contain css files at the top level`);
}

function writeDataToCssFile(content){
    writeStream.write(content, err=>process.exit(err.message));
}

function getFileContent(fileNames){
    fileNames.forEach(el => {
    fsPromises.readFile(path.join(pathToStylesDir,el),'utf-8')
    .then(writeDataToCssFile)
    .catch(err=>process.exit(err.message)) 
    });
}

process.on('exit',(message)=>{
    if(message!=0)console.log(message);
});


generateCssFile();