const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const pathToFolder=path.join(__dirname,'secret-folder');

function getFolderContent(){
    return fsPromises.readdir(pathToFolder,{withFileTypes:true});
}

function getFileNames(content){
    content=content.filter(elem=>elem.isFile()).map(elem=>elem.name);
    return content.length!=0? content: process.exit(`The folder doesn't contain files at the top level`);
}

function getFilesInfo(fileNames){
    fileNames.forEach((name)=>{
        fs.stat(path.join(pathToFolder,name),(err,stats)=>{
            if(err) process.exit(err.message);
            printFileInfo(name,stats.size);
        })
    })
}

function printFileInfo(fileName,fileSize){
    let extension=path.extname(fileName);
    console.log(`${path.basename(fileName,extension)} - ${extension.slice(1)} - ${fileSize}b`)
}

getFolderContent().then((content)=>getFileNames(content)).catch(err=>process.exit(err.message)).then(fileNames=>getFilesInfo(fileNames));

process.on('exit',(message)=>{
    if(message!=0)console.log(message);
});

