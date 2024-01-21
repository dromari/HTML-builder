const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');

async function copyFiles() {
    try {
        await fsPromises.rm(path.join(__dirname, 'files-copy'), { force: true, recursive: true });
        await fsPromises.mkdir(path.join(__dirname, 'files-copy'));
        const filePath = path.join(__dirname, 'files');
        const files = await fsPromises.readdir(filePath, { withFileTypes: true });
        for (file of files) {
            fsPromises.copyFile(path.join(__dirname, 'files', file.name),
                path.join(__dirname, 'files-copy', file.name));
        }
    } catch (err) {
        console.log(err);
    }
}
copyFiles();
