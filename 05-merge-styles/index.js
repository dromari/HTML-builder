const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');
const newFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

async function unitFiles() {
    try {
        const files = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
        for (file of files) {
            const filePath = path.join(path.join(__dirname, 'styles'), file.name);
            const fileName = path.basename(filePath);
            if (path.extname(filePath) === '.css') {
                fs.createReadStream(path.join(path.join(__dirname, 'styles'), fileName)).on('data', (data) => {
                    newFile.write(data.toString() + '\n');
                });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}
unitFiles()



