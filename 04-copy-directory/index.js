const fsPromises = require('fs/promises');
const path = require('path');
const pathToDir=__dirname;
const pathToFirstDir=path.join(pathToDir,'files');
const pathToSecondDir=path.join(pathToDir,'files-copy/');

let createDir=()=> fsPromises.mkdir(pathToSecondDir,{recursive:true}).catch(err=>process.exit(err.message+'s'));
let getDirContent=(path1=pathToFirstDir)=>fsPromises.readdir(path1,{withFileTypes:true}).catch(err=>process.exit(err.message));

function getFileNames(content){
    if(!content.length) return;
    content=content.filter(elem=>elem.isFile()).map(elem=>elem.name);
    return content;
}

function copyDir(){
    createDir()
    .then(clearDir())
    .then(getDirContent().then(getFileNames).then(copyFiles));
}

function clearDir(){
    getDirContent(pathToSecondDir)
    .then(getFileNames)
    .then(deleteContentDir)
}

function deleteContentDir(content){
   if(content==undefined) return;
   if(!content.length) return;
    content.forEach(el=>{
        fsPromises.unlink(path.join(pathToSecondDir,el))
        .catch(err=>process.exit(err.message));
    });
}

function copyFiles(content){
    if(!content.length) return;
    content.forEach(el => {
        fsPromises.copyFile(path.join(pathToFirstDir,el),path.join(pathToSecondDir,el))
        .catch(err=>process.exit(err.message));
    });
}

process.on('exit',(message)=>{
    if(message!=0)console.log(message);
});

copyDir();
