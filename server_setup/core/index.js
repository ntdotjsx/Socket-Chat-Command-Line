const express = require('express')
const app = express()
const port = 3000
const { exec } = require('child_process');

exec('start server.py', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send('Internal Server Error');
    }
    console.log(`Server script executed successfully`);
});

app.listen(port, (req) => {
    console.log(`Example app listening on port ${port}`)
})