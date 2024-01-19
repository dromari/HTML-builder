const fs = require('node:fs');
const path = require('node:path');
const { stdin, stdout } = process;

const stream = fs.createWriteStream(
  path.join(__dirname, 'file.txt'),
  'utf-8',
);

stdout.write('Hello! How are you?:');
stdin.on('data', (data) => {
  if (data.toString().toLowerCase().trim() === 'exit') {
    process.exit();
  } else {
    stream.write(data, 'utf-8');
  }
});

process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => {
  console.log('Thank you! Have a nice day!');
});