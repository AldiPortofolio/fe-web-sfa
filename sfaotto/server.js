const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const axios = require('axios');
const filePath = path.join(__dirname, 'build', 'index.html');
require('dotenv').config()

const Api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

app.get('/', function (req, res) {
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        data = data.replace(/\$OG_TITLE/g, 'SFA OTTO');
        data = data.replace(/\$OG_DESCRIPTION/g, "SFA OTTO");
        html = data.replace(/\$OG_IMAGE/g, '');
        res.send(html);
    });
});

app.use(express.static(path.resolve(__dirname, './build')));

app.get('*', function (req, res) {
    res.sendFile(filePath);
});

app.listen(3000);