const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const pathToDir=__dirname;
const pathToStylesDir=path.join(pathToDir,'styles');
const pathToProjectDistDir=path.join(pathToDir,'project-dist');

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
   return fsPromises.appendFile(path.join(pathToProjectDistDir,'bundle.css'),content+'\n');
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


function deleteFile(){
    return fsPromises.access(path.join(pathToProjectDistDir,'bundle.css'))
    .then(()=>{return fsPromises.unlink(path.join(pathToProjectDistDir,'bundle.css'))});
}

deleteFile()
.then(()=>generateCssFile());

