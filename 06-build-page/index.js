const fs = require('fs');
// const fsEx = require('fs-extra');
const fsPromises = require('fs/promises');
const path = require('path');
const pathToDir=__dirname;
const pathToStylesDir=path.join(pathToDir,'styles');
const pathToProjectDistDir=path.join(pathToDir,'project-dist');
const pathToComponentsDir=path.join(pathToDir,'components');
let pathToOrigAssetsDir=path.join(pathToDir,'assets');
let pathToCopyAssetsDir=path.join(pathToProjectDistDir,'assets');
let createDir=(path)=> fsPromises.mkdir(path,{recursive:true}).catch(err=>process.exit(err.message));
let getDirContent=(path1)=>fsPromises.readdir(path1,{withFileTypes:true}).catch(err=>process.exit(err.message));

let contentComponents={};


function createProjectDistDir(){
    return deleteDir(pathToProjectDistDir).catch(err=>err)
    .then(()=>createDir(pathToProjectDistDir));   
}


function deleteDir(path1){
    return fsPromises.access(path1)
    .catch(err=>{throw err;})
    .then(()=>{
        return fsPromises.rm(path.join(path1),{ recursive: true })
             .catch(err=>process.exit(err.message));
    });
}

function getFileNames(content,extension=''){
    if(extension!='')content=content.filter(elem=>elem.isFile() && path.extname(elem.name).toLowerCase()==extension).map(elem=>elem.name);
    else {
        let cont2=content;
        cont2=cont2.filter(elem=>elem.isFile()).map(elem=>elem.name);
        if(!cont2.length) content=content.filter(elem=>elem.isDirectory()).map(elem=>elem.name);
        else content=cont2;
    }
    return content.length!=0? content: process.exit(`The folder doesn't contain css files at the top level`);
}

function copyFiles(content,pathFrom,pathTo,fileName=''){
    if(!content.length) return;
    content.forEach(el => {
        if(fileName!=''){
         fsPromises.copyFile(path.join(pathFrom,el),path.join(pathTo,fileName))
        .catch(err=>process.exit(err.message));
        }
        else{
            if(path.extname(el).toLowerCase()!=''){
                fsPromises.copyFile(path.join(pathFrom,el),path.join(pathTo,el))
                .catch(err=>process.exit(err.message));
            }
            else copyDir(path.join(pathFrom,el),path.join(pathTo,el));
            
        }
    });
}


function processingFiles(path1,fileNames){
    let fileContent;
    fileNames.forEach((el,ind)=>{
        fsPromises.readFile(path.join(path1,el),'utf8')
        .then((data)=>{
            contentComponents[path.basename(el,'.html')]=data;
        })
        .then(()=>{
            if(ind==fileNames.length-1){
                fsPromises.readFile(path.join(pathToProjectDistDir,'index.html'),'utf8')
                .then(data=>{
                    fileContent=data;
                    fileNames.forEach(el=>{
                       fileContent= fileContent.replace(`{{${path.basename(el,'.html')}}}`, contentComponents[path.basename(el,'.html')]);
                    })
                    fsPromises.writeFile(path.join(pathToProjectDistDir,'index.html'),fileContent);
                })
            }
        });
    })
   
}

function replacementInFile(){
   return getDirContent(pathToComponentsDir)
    .then(cont=>getFileNames(cont,'.html'))
    .then(fileNames=>processingFiles(pathToComponentsDir,fileNames));
}


function generateCssFile(){
    getDirContent(pathToStylesDir)
    .then(cont=>getFileNames(cont,'.css'))
    .then((fileNames)=>getFileContent(fileNames))
}

function writeDataToCssFile(content){
    return fsPromises.appendFile(path.join(pathToProjectDistDir,'style.css'),content+'\n');
}

function getFileContent(fileNames){
    fileNames.forEach(el => {
    fsPromises.readFile(path.join(pathToStylesDir,el),'utf-8')
    .then(data=>writeDataToCssFile(data))
    .catch(err=>process.exit(err.message)) 
    });
}

function copyDir(path1,path2){
    createDir(path2)
    .then(()=>getDirContent(path1))
    .then((cont)=>getFileNames(cont))
    .then((cont)=>copyFiles(cont,path1,path2));
}


createProjectDistDir()
.then(()=>copyFiles(['template.html'],pathToDir,pathToProjectDistDir,'index.html'))
.then(()=>replacementInFile())
.then(()=>generateCssFile())
.then(()=>copyDir(pathToOrigAssetsDir,pathToCopyAssetsDir));    

process.on('exit',(message)=>{
    if(message!=0)console.log(message);
});








