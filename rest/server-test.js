const spawn = require("child_process").spawn;
const pythonProcess = spawn('python3',["testing.py", 49.505564, 5.965662, 3]);
const fs = require('fs');

pythonProcess.stdout.on('data', (data) => {
    // Do something with the data returned from python script
    //var arr = JSON.parse(data)
    let rawdata = fs.readFileSync('result.json');
    let filedata = JSON.parse(rawdata);
    console.log(filedata);
});