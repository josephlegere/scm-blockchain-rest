const fs = require('fs');
const Path = require('path');

exports.createJSON = (val, name, source) => {
    return new Promise((resolve, reject) => {
        const filename = `${name}.json`;
        const filesource = `${source}`;
        const path = Path.resolve(Path.dirname(__dirname), filesource, filename);
        const filedata = JSON.stringify(val);// JSON Data
        let _return = null;

        let dir = `./${source}`;// to create a directory that will store the file
        if (!fs.existsSync(dir)) {
            console.log(dir)
            fs.mkdirSync(dir);
        }

        fs.writeFile(`${path}`, filedata, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                console.log('JSON File created!');
                resolve({
                    source: `${filename}`,
                    data: filedata
                });
            }
        });
    });
}