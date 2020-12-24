const yaml = require('js-yaml');
const fs = require('fs');

const dir = process.argv[2];
const resultFile = (process.argv[3] ?? 'result') + '.csv';

let index = 0;
try {
    fs.readdir(dir, (err, files) => {
        files.forEach(file => {
            console.log(`Processing: ${file}`);
            const doc = yaml.safeLoad(fs.readFileSync(`${dir}/${file}`, 'utf8'));
            if(index == 0) {
                const keys = arrToCSVLine(getAllProps(doc, true));
                fs.writeFileSync(resultFile, keys);
            }
            const values = arrToCSVLine(getAllProps(doc));
            fs.appendFileSync(resultFile, values);
            index ++;
        })
    });
} catch (e) {
    console.log(e);
}

const getAllProps = (json, getKey = false) => {
    let results = [];
    for (const [key, value] of Object.entries(json)) {
        if(typeof value === 'object' && value !== null) {
            results = [...results, getAllProps(value, getKey)];
        } else {
            results.push(getKey ? key : value !== null ? value : 'null');
        }
    }
    return results;
}

const arrToCSVLine = (arr) => arr.join(',') + "\n";