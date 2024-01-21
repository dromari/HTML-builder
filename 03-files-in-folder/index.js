const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');

const filePath = path.join(__dirname, 'secret-folder');

async function readFiles() {
    try {
        const files = await fsPromises.readdir(filePath, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                const filePath = path.join(file.path, file.name);
                const fileExt = path.extname(filePath).slice(1);
                const fileName = path.parse(filePath).name;

                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        throw Error(err);
                    };
                    const fileSize = (stats.size / 1024);
                    console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
                });
            }
        };
    } catch (err) {
        console.log(err);
    }
}

readFiles();
