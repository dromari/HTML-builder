const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');

async function buildHtml() {
    let template = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
    const map = new Map();
    const assetsFiles = await fsPromises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
    for (file of assetsFiles) {
        const fileContent = await fsPromises.readFile(path.join(file.path, file.name));
        const filePath = path.join(file.path, file.name);
        const fileName = path.parse(filePath).name;
        map.set(`{{${fileName}}}`, fileContent.toString());
    }
    for (let [key, value] of map) {
        template = template.replace(key, value);
    }
    await fsPromises.rm(path.join(__dirname, 'project-dist'), { force: true, recursive: true });
    await fsPromises.mkdir(path.join(__dirname, 'project-dist'));
    await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template);
    await copyFolderAssets(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    await unitFiles();
}
buildHtml();

async function copyFolderAssets(folderAssets, folderProject) {
    await fsPromises.mkdir(folderProject, { recursive: true });
    const files = await fsPromises.readdir(folderAssets, { withFileTypes: true });
    files.forEach((file) => {
        if (file.isFile()) {
            fsPromises.copyFile(
                path.join(folderAssets, file.name),
                path.join(folderProject, file.name),
            )
        } else {
            copyFolderAssets(path.join(folderAssets, file.name), path.join(folderProject, file.name));
        }
    });
}

async function unitFiles() {
    const newFileCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    const files = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    for (file of files) {
        const filePath = path.join(path.join(__dirname, 'styles'), file.name);
        const fileName = path.basename(filePath);
        if (path.extname(filePath) === '.css') {
            fs.createReadStream(path.join(path.join(__dirname, 'styles'), fileName)).on('data', (data) => {
                newFileCss.write(data.toString() + '\n');
            });
        }
    }
}




