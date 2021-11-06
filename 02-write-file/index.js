const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });
const writeStream=fs.createWriteStream(path.join(__dirname,'text.txt'),{flags:'w'});
writeStream.on('error', (err) => {
    console.log(`Ошибка при создании потока для записи. ${err}`);
});

console.log('Введите текст, который будет записан в файл.\nДля окончания процесса записи данных в файл введите exit либо зажмите сочетание клавиш ctrl+c');

rl.on('nextInput',function(){
    rl.question('', (answer)=>{
     if(answer.toLowerCase().trim()=='exit') rl.emit('close');
     writeStream.write(`${answer}\n`);
     rl.emit('nextInput');
    });    
});

rl.emit('nextInput');

rl.on('close', ()=>{
console.log('Запись данных в файл завершена. До встречи)');
process.exit();
});