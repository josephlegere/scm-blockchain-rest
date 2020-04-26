const fs = require('fs');
const parser = require('xml2json');
//const { create, convert } = require('xmlbuilder2');
const Path = require('path');

exports.readXML = (val) => {
    return new Promise((resolve, reject) => {
        fs.readFile(val, (err, data) => {
            let _json = parser.toJson(data, { reversible: true });
            _xml = parser.toXml(_json)
            //console.log(_xml)
            resolve(_xml);
        });
    });
}

exports.createXML = (val, name, source) => {
    const filename = `${name}.xml`;
    const filesource = `${source}`;
    const path = Path.resolve(Path.dirname(__dirname), filesource, filename);
    const jsonStr = JSON.stringify(val);
    const filedata = parser.toXml(jsonStr);// XML Data
    let _return = null;
    //console.log(filedata);

    let dir = `./${source}`;// to create a directory that will store the file
    if (!fs.existsSync(dir)) {
        console.log(dir)
        fs.mkdirSync(dir);
    }

    fs.writeFile(`${path}`, filedata, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('XML File created!');
        }
    });

    return {
        source: `${filename}`,
        data: filedata
    };
}

exports.writeXML = async (val) => {
    /*fs.readFile('./survey.xml', function (err, data) {
        var json = JSON.parse(parser.toJson(data, { reversible: true }));
        var answers = json["Survey"]["Answer"];
        for (var i = 0; i < answers.length; i++) {
            var answer = answers[i];
            answer.AnswerId = i;
        }

        var stringified = JSON.stringify(json);
        var xml = parser.toXml(stringified);
        fs.writeFile('survey-fixed.xml', xml, function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('updated!');
            }
        });
    });*/
}