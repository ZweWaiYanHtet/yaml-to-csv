const yaml = require('js-yaml');
const fs = require('fs');

const dir = process.argv[2];
const resultFile = 'results/' + (process.argv[3] ?? 'result');
const resultFileExt = '.csv';

fs.rmdirSync('results', {recursive: true});
fs.mkdirSync('results');
try {
    fs.readdir(dir, (err, files) => {
        files.forEach(file => {
            if(!file.endsWith('.yaml')) return;
            console.log(`Processing: ${file}`);
            const doc = yaml.safeLoad(fs.readFileSync(`${dir}/${file}`, 'utf8'));

            const values = getAllProps(doc);
            const resultFileName = makeResultFileName(values);
            if(!fs.existsSync(resultFileName)){
                const keys = arrToCSVLine(getAllProps(doc, true));
                fs.writeFileSync(resultFileName, keys);
            }

            fs.appendFileSync(resultFileName, arrToCSVLine(values));
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

const makeResultFileName = (valueArr) => `${resultFile}_${valueArr.length}${resultFileExt}`;